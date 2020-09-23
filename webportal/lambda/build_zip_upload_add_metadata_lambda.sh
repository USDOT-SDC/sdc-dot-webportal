# check env variable
if [ $# -eq 0 ]
  then
    echo "environment variable expected."
    exit 1
fi

environment=$1

# install requirements in a venv
python3 -m venv v-env
source v-env/bin/activate
pip3 install -r requirements.txt --upgrade
deactivate

# Zip files
export CURRENT_DIR=$(pwd)
pushd v-env/lib/python3.7/site-packages
zip -r $CURRENT_DIR/add_metadata.zip .
popd
zip -g add_metadata.zip ./*.py

# Push zipped file up to S3
aws s3 cp --profile sdc process_workstation_updates.zip s3://${environment}-dot-sdc-regional-lambda-bucket-911061262852-us-east-1/sdc-dot-webportal/add_metadata.zip --region us-east-1 --acl public-read

