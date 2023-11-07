#!/usr/bin/env python
import shlex
import sys
import yaml
import os
import subprocess
import zipfile
import logging
import boto3
from botocore.exceptions import ClientError

if len(sys.argv) >= 2:
    if sys.argv[1] == '--no-rebuild':
        rebuild = False
    else:
        rebuild = True
else:
    rebuild = True

env = boto3.client('iam').list_account_aliases()['AccountAliases'][0].split('-')[-1]


def zip_dir(zip_path, zip_handle):
    for root, dirs, files in os.walk(zip_path):
        for file in files:
            zip_handle.write(os.path.join(root, file),
                             os.path.relpath(os.path.join(root, file),
                                             os.path.join(zip_path, '..')))


def upload_file(file_name, bucket, key=None):
    """Upload a file to an S3 bucket
    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param key: S3 key. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    # If S3 object_name was not specified, use file_name
    if key is None:
        key = file_name
    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, key)
    except ClientError as e:
        logging.error(e)
        return False
    return True


def run_command(command):
    process = subprocess.Popen(shlex.split(command), stdout=subprocess.PIPE)
    while True:
        output = process.stdout.readline()
        if process.poll() is not None:
            break
        if output:
            print(output.decode("utf-8").replace("\n", '').replace("\r", ''))
    rc = process.poll()
    return rc


# some directories
if os.name == 'nt':
    bin_dir = 'Scripts'
    lib_dir = 'Lib'
else:
    bin_dir = 'bin'
    lib_dir = 'lib/python3.8'
terraform_dir = os.path.split(os.getcwd())[-1]

# must run Python 3.8.x
# if not (sys.version_info.major == 3 and sys.version_info.minor == 8):
#     raise EnvironmentError("Python must be version 3.8.x")

# load the deployment vars
deploy_vars = yaml.load(open('zip_and_upload_lambdas_vars.yaml', 'r').read(), Loader=yaml.FullLoader)
if 'lambdas' in deploy_vars.keys():
    lambdas = deploy_vars['lambdas']
else:
    lambdas = {}

# set the environment_vars
environment_vars = deploy_vars['environments'][env]
terraform_bucket = environment_vars['terraform_bucket']

# ask user to verify
print('================================================================================')
print(f"Do you want to process the Lambdas for deployment to {env}?")
print("Only 'yes' will be accepted to approve.")
input_str = input(f"Process Lambdas for {env}: ").lower()
if input_str != "yes":
    print("Aborted")
    sys.exit()

try:
    # process each lambda
    for path, lambda_vars in lambdas.items():
        print('================================================================================')
        print(path + ': Processing...')
        if rebuild:
            # create virtual environment
            print(path + ': Creating virtual environment...')
            subprocess.check_call([sys.executable, "-m", "venv", "--copies", "--clear", os.path.join(path, "venv")])
            print(path + ': Creating virtual environment...Done')
            path_to_executable = os.path.join(os.getcwd(), path, "venv", bin_dir, "python")
            path_to_requirements = os.path.join(os.getcwd(), path, "requirements.txt")
            # upgrade pip
            print('--------------------------------------------------------------------------------')
            print(path + ': Upgrading pip...')
            subprocess.check_call([path_to_executable, "-m", "pip", "install", "--upgrade", "pip"])
            print(path + ': Upgrading pip...Done')
            # upgrade setuptools
            print('--------------------------------------------------------------------------------')
            print(path + ': Upgrading setuptools...')
            subprocess.check_call([path_to_executable, "-m", "pip", "install", "--upgrade", "setuptools"])
            print(path + ': Upgrading setuptools...Done')
            # install requirements.txt
            print('--------------------------------------------------------------------------------')
            print(path + ': Installing requirements...')
            subprocess.check_call([path_to_executable, "-m", "pip", "install", "-r", path_to_requirements, "--upgrade"])
            print(path + ': Installing requirements...Done')
        else:
            # don't create virtual environment
            print(path + ': Using the existing virtual environment...')

        # zip up the scripts and site packages
        print('--------------------------------------------------------------------------------')
        print(path + ': Creating zip file...')
        path_to_site_packages = os.path.join(path, "venv", lib_dir, "site-packages")
        zip_file = path + '.zip'
        with zipfile.ZipFile(zip_file, 'w') as lambda_zip:
            for script in lambda_vars['scripts']:
                path_to_script = os.path.join(path, script)
                print(path + ': Zipping script... ' + script)
                lambda_zip.write(path_to_script, arcname=script)
            if 'site-packages' in lambda_vars.keys():
                for site_package in lambda_vars['site-packages']:
                    path_to_site_package = os.path.join(path_to_site_packages, site_package)
                    print(path + ': Zipping site-package... ' + site_package)
                    zip_dir(path_to_site_package, lambda_zip)
        lambda_zip.close()
        print(path + ': Creating zip file...Done')

        # upload the zip file
        print('--------------------------------------------------------------------------------')
        print(path + ': Uploading ' + zip_file + ' to s3://' + terraform_bucket + '/' + terraform_dir)
        if upload_file(zip_file, terraform_bucket, terraform_dir + '/' + zip_file):
            print(path + ': Uploading...Done')
        else:
            print(path + ': Error uploading ' + zip_file)
        print(path + ': Processing...Done')
        print('================================================================================')
        print('')
except:
    print("Unexpected error while processing the Lambdas: ", sys.exc_info()[0])
    raise

# ask user to verify initialize
print('================================================================================')
print(f"Do you want to initialize the Terraform backend for {env}?")
print("Only 'yes' will be accepted to approve.")
input_str = input(f"Initialize {env}: ").lower()
print('--------------------------------------------------------------------------------')
if input_str != "yes":
    print("Aborted")
    sys.exit()
# Change to terraform Directory
try:
    os.chdir("terraform")
except:
    print("Unexpected error while changing to the terraform directory: ", sys.exc_info()[0])
    raise
# init
command_tf_init = f"terraform init -backend-config=config/backend-ecs-{env}.conf"
error = run_command(command_tf_init)
if error != 0:
    print(f"There was an error initializing the Terraform backend for {env}")
    sys.exit()
print('================================================================================')

# ask user to verify plan
print('')
print('================================================================================')
print(f"Do you want to run terraform plan for {env}?")
print("Only 'yes' will be accepted to approve.")
input_str = input(f"Plan {env}: ").lower()
print('--------------------------------------------------------------------------------')
if input_str != "yes":
    print("Aborted")
    sys.exit()
command_tf_plan = f"terraform plan -var-file=config/ecs-{env}.tfvars"
error = run_command(command_tf_plan)
if error != 0:
    print(f"There was an error running terraform plan for {env}")
    sys.exit()
print('================================================================================')

# ask user to verify apply
print('')
print('================================================================================')
print(f"Do you want to run terraform apply for {env}?")
print("Only 'yes' will be accepted to approve.")
input_str = input(f"Apply {env}: ").lower()
print('--------------------------------------------------------------------------------')
if input_str != "yes":
    print("Aborted")
    sys.exit()
command_tf_apply = f"terraform apply -var-file=config/ecs-{env}.tfvars"
error = run_command(command_tf_apply)
if error != 0:
    print(f"There was an error running terraform apply for {env}")
    sys.exit()
print('================================================================================')
