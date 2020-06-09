# Overview

This document establishes some basic guidelines and practices for how we can continue to maintain our current cloud infrastructure while adding new reosurces to support the brand new cloud in the DOT ECS infrastructure.

# Webportal-specific guidance

Webportal deploys are already composed of two parts:

- `prod_deploy.sh` - Pushes the angular files into a target S3 bucket for static asset hosting
- `python3 deploy.py --environment production` - Uses Chalice to push our API Gateways and lambdas into AWS

I am proposing we add a third step:
- `terraform apply` which will deploy any non-chalice resources into AWS.

Terraform is already being used by a lot of our other repos, and gives us a lot more flexibility than chalice. The unfortunate side effect is that a "full deploy" ultimately consists of 3 steps, but we could add a `deploy_all.sh` that would run all 3 of these commands for convenience.

# Branching

I recommend we have a long-lived `ecs-migration` branch that is spawned **DIRECTLY FROM MASTER**. 

For the moment, I think a single branch will suffice. If we need to manage dev, test, and prod concurrently in both clouds, we can refine this guidance, but it will start to get **much** more complicated at that point, so it will be preferable if we can try to minimize our branches.

# Terraform

## Potential issues

There are a couple of items to worry about:
- We **do not** want to accidentally overwrite the state of another backend
- We will be adding new resources, but there will be slight deviations between our current account and ECS, because ECS will not have preexisting resources. For this reason, terraform scripts might drift between `master` and `ecs-migration`.

## Recommended strategy - backends and configs

I recommend we add a backend and a config for the ECS environment as though it was just another environment.

For example:
```
/config
  backend-dev.conf
  backend-ecs-dev.conf
  dev.tfvars
  ecs-dev.tfvars
```

I recommend `ecs-dev` over `dev-ecs` simply because it would be easy to accidentally type `dev` instead of `dev-ecs` and that could cause problems, whereas a `ecs-dev` wouldn't have that sort of typo problem.

## Recommended strategy - resources

### Greenfield resources

Generally, we will be adding new resources (as ECS will need the resources, but our current account has preexisting manually created resources), so it should be possible to do something like this:
```
resource "aws_s3_bucket" "webportal_bucket" {
  bucket = "webportal-bucket"
}
```

This would be safe to run in both clouds, even though it will create a useless bucket in our current account.
The only issue here will be if we **need to maintain the same name**. I am currently recommending we use new names to avoid complexity. If we MUST use the same name, we'll either have to import the resource into terraform or pass in name as a variable, in which case our current account will get a garbage name, and the new account will get the correct one.

### References and drift

The next bit of complexity is references. At the moment, we will have resources in our account that take variables, and all we should need to do is update them to use a reference instead.

For example

`master` will have:
```
resource "aws_cognito_identity_provider" "SamlDotActiveDirectoryIdp" {
  user_pool_id  = var.user_pool_id
  provider_name = "${var.environment}-dot-ad"
  provider_type = "SAML"
}

# New pool that is not used in our current account, but mirrors the settings of var.user_pool_id pool
# For testing, we can update the user_pool_id to be the ID of this resource, but DO NOT use a ref above
resource "aws_cognito_user_pool" "new_pool" {
  name = "pool"
}
```

`ecs-migration` will have:
```
resource "aws_cognito_identity_provider" "SamlDotActiveDirectoryIdp" {
  user_pool_id  = aws_cognito_user_pool.new_pool
  provider_name = "${var.environment}-dot-ad"
  provider_type = "SAML"
}

# New pool that will be used in ECS
resource "aws_cognito_user_pool" "new_pool" {
  name = "pool"
}
```