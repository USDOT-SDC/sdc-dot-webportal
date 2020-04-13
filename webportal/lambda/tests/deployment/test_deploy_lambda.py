import pytest
from deployment import cli_parser, gateway_normalizer, deploy_lambda
import subprocess
from argparse import Namespace

MOCK_CLI_ARGUMENTS = ['--environment', 'bleh']
MOCK_ENVIRONMENT = 'bleh'
EXPECTED_DEPLOY_COMMAND = f'chalice deploy --stage {MOCK_ENVIRONMENT} --no-autogen-policy --profile sdc'


@pytest.fixture
def mock_cli_parser(mocker):
    mocker.patch.object(cli_parser, 'parse_arguments')
    cli_parser.parse_arguments.return_value = Namespace(environment=MOCK_ENVIRONMENT)
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
    deploy_lambda.deploy_backend(MOCK_CLI_ARGUMENTS)

    mock_cli_parser.parse_arguments.assert_called_with(MOCK_CLI_ARGUMENTS)
    mock_gateway_normalizer.normalize_gateway.assert_called_with(MOCK_ENVIRONMENT)
    mock_subprocess.run.assert_called_with(EXPECTED_DEPLOY_COMMAND, shell=True, check=True)
