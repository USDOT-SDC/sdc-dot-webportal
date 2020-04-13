from deployment import cli_parser


def test_invalid_args_do_not_blow_up():
    invalid_args = [[], ['bleh'], ['--environment', 'invalid']]
    for invalid_arg in invalid_args:
        try:
            print(invalid_arg)
            cli_parser.parse_arguments(invalid_arg)
            raise Exception('I should not reach this point')
        except SystemExit as ex:
            pass


def test_valid_args_successfully_parse():
    for environment in cli_parser.VALID_ENVIRONMENTS:
        valid_args = ['--environment', environment]

        result = cli_parser.parse_arguments(valid_args)

        assert result.environment == environment
