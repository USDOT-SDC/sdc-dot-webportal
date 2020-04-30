import argparse

# NOTE: the prod/production is temporary. There is a bug where the "prod" environment is actually using the development cognito pool.
# We are slowly transitioning to the "production" environment which will use the proper user pool.
VALID_ENVIRONMENTS = ['dev', 'dev-private', 'test', 'prod', 'production']


def parse_arguments(args):
    parser = argparse.ArgumentParser(description='Deploys the Webportal Lambda to a specified environment')
    parser.add_argument('--environment', choices=VALID_ENVIRONMENTS, required=True)
    result = parser.parse_args(args)
    return result
