import sys
from deployment import deploy_lambda

if __name__ == '__main__':
    deploy_lambda.deploy_backend(sys.argv[1:])