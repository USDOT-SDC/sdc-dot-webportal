#!/bin/bash

terraform plan -var-file=config/ecs-${AWS_ENVIRONMENT}.tfvars

