
# NOTE: Some tables have inconsistent names (prod vs. production)
locals {
  mismatch_deploy_env = var.deploy_env == "prod" ? "production" : var.deploy_env
}

#
# NOTE: Probably not worth doing a module for these as the redundancy is pretty limited
#
#
#
resource "aws_dynamodb_table" "user_stacks_table" {
  name           = "${var.deploy_env}-UserStacksTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "username"

  attribute {
    name = "username"
    type = "S"
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "available_dataset" {
  name           = "${var.deploy_env}-AvailableDataset"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "Name"
  range_key      = "Type"

  attribute {
    name = "Name"
    type = "S"
  }
  attribute {
    name = "Type"
    type = "S"
  }

  tags = local.global_tags
}
