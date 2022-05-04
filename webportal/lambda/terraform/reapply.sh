#!/bin/bash

terraform apply -var-file=config/ecs-${AWS_ENVIRONMENT}.tfvars

