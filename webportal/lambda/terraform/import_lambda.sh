#!/bin/bash

terraform import -var-file=config/ecs-${AWS_ENVIRONMENT}.tfvars aws_lambda_function.webportal_lambda webportal-ecs-${AWS_ENVIRONMENT}

terraform import -var-file=config/ecs-${AWS_ENVIRONMENT}.tfvars aws_iam_role.webportal_lambda_role webportal-ecs-${AWS_ENVIRONMENT}-api_handler 


