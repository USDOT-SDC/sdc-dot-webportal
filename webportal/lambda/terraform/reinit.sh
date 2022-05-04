#!/bin/bash

echo "${AWS_ENVIRONMENT}.sdc.dot.gov.platform.terraform"
terraform init -var-file=config/backend-ecs-${AWS_ENVIRONMENT}.tfvars

