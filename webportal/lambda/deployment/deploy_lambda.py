from . import cli_parser, gateway_normalizer
import subprocess


def deploy_backend(command_line_arguments):
    parsed_arguments = cli_parser.parse_arguments(command_line_arguments)
    chalice_deploy_command = f'chalice deploy --stage {parsed_arguments.environment} --no-autogen-policy'
    if not parsed_arguments.environment.startswith('ecs'):
        chalice_deploy_command += ' --profile sdc'
    print(f"chalice_deploy_command: {chalice_deploy_command}")
    subprocess.run(chalice_deploy_command, shell=True, check=True)
    gateway_normalizer.normalize_gateway(parsed_arguments.environment)
