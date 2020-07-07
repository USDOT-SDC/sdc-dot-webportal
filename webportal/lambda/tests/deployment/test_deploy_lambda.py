import pytest
from deployment import cli_parser, gateway_normalizer, deploy_lambda
import subprocess
from argparse import Namespace


@pytest.fixture
def mock_cli_parser(mocker):
    mocker.patch.object(cli_parser, 'parse_arguments')
    return cli_parser


@pytest.fixture
def mock_gateway_normalizer(mocker):
    mocker.patch.object(gateway_normalizer, 'normalize_gateway')
    gateway_normalizer.normalize_gateway.return_value = None
    return gateway_normalizer


@pytest.fixture
def mock_subprocess(mocker):
    mocker.patch.object(subprocess, 'run')
    subprocess.run.return_value = Namespace(stdout='')
    return subprocess


def test_deploy_backend_deploys_the_backend(mock_cli_parser, mock_subprocess, mock_gateway_normalizer):
    mock_environment = 'bleh'
    mock_cli_arguments = ['--environment', mock_environment]
    cli_parser.parse_arguments.return_value = Namespace(environment=mock_environment)

    deploy_lambda.deploy_backend(mock_cli_arguments)

    mock_cli_parser.parse_arguments.assert_called_with(mock_cli_arguments)
    mock_gateway_normalizer.normalize_gateway.assert_called_with(mock_environment)
    mock_subprocess.run.assert_called_with(f'chalice deploy --stage {mock_environment} --no-autogen-policy --profile sdc', shell=True, check=True)


def test_deploy_backend_deploys_the_backend_with_sdc_profile_in_ecs(mock_cli_parser, mock_subprocess, mock_gateway_normalizer):
    mock_environment = 'ecs-bleh'
    mock_cli_arguments = ['--environment', mock_environment]
    cli_parser.parse_arguments.return_value = Namespace(environment=mock_environment)

    deploy_lambda.deploy_backend(mock_cli_arguments)

    mock_cli_parser.parse_arguments.assert_called_with(mock_cli_arguments)
    mock_gateway_normalizer.normalize_gateway.assert_called_with(mock_environment)
    mock_subprocess.run.assert_called_with(f'chalice deploy --stage {mock_environment} --no-autogen-policy', shell=True, check=True)