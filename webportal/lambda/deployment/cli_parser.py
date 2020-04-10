import argparse

VALID_ENVIRONMENTS = ['dev', 'test', 'prod', 'production']


def parse_arguments(args):
    parser = argparse.ArgumentParser(description='Deploys the Webportal Lambda to a specified environment')
    parser.add_argument('--environment', choices=VALID_ENVIRONMENTS, required=True)
    result = parser.parse_args(args)
    return result
