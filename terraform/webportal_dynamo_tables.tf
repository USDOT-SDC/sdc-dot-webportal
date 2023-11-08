
# NOTE: Some tables have inconsistent names (prod vs. production)
locals {
  mismatch_deploy_env = local.environment == "prod" ? "production" : local.environment
}

# NOTE: Probably not worth doing a module for these as the redundancy is pretty limited,
# and pulling them apart later would be difficult
resource "aws_dynamodb_table" "user_stacks_table" {
  name           = "${local.environment}-UserStacksTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "username"

  attribute {
    name = "username"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "available_dataset" {
  name           = "${local.environment}-AvailableDataset"
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

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "auto_export_users_table" {
  name           = "${local.environment}-AutoExportUsersTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "UserID"
  range_key      = "Dataset-DataProvider-Datatype"

  attribute {
    name = "UserID"
    type = "S"
  }
  attribute {
    name = "Dataset-DataProvider-Datatype"
    type = "S"
  }
  attribute {
    name = "ReqReceivedTime"
    type = "N"
  }

  global_secondary_index {
    hash_key           = "Dataset-DataProvider-Datatype"
    name               = "DataInfo-ReqReceivedtimestamp-index"
    non_key_attributes = []
    projection_type    = "ALL"
    range_key          = "ReqReceivedTime"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "trusted_users_table" {
  name           = "${local.mismatch_deploy_env}-TrustedUsersTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "UserID"
  range_key      = "Dataset-DataProvider-Datatype"

  attribute {
    name = "UserID"
    type = "S"
  }
  attribute {
    name = "Dataset-DataProvider-Datatype"
    type = "S"
  }
  attribute {
    name = "ReqReceivedTimestamp"
    type = "N"
  }

  global_secondary_index {
    hash_key           = "Dataset-DataProvider-Datatype"
    name               = "DataInfo-ReqReceivedtimestamp-index"
    non_key_attributes = []
    projection_type    = "ALL"
    range_key          = "ReqReceivedTimestamp"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "request_export_table" {
  name           = "${local.mismatch_deploy_env}-RequestExportTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 15
  write_capacity = 5
  hash_key       = "S3KeyHash"
  range_key      = "RequestedBy_Epoch"

  attribute {
    name = "S3KeyHash"
    type = "S"
  }
  attribute {
    name = "RequestedBy_Epoch"
    type = "S"
  }
  attribute {
    name = "Dataset-DataProvider-Datatype"
    type = "S"
  }
  attribute {
    name = "ReqReceivedTimestamp"
    type = "N"
  }

  global_secondary_index {
    hash_key           = "Dataset-DataProvider-Datatype"
    name               = "DataInfo-ReqReceivedtimestamp-index"
    non_key_attributes = []
    projection_type    = "ALL"
    range_key          = "ReqReceivedTimestamp"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "manage_user_workstation_table" {
  name           = "${local.mismatch_deploy_env}-ManageUserWorkstationTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "RequestId"
  range_key      = "username"

  attribute {
    name = "RequestId"
    type = "S"
  }
  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    hash_key           = "username"
    name               = "${local.mismatch_deploy_env}-workstation-username-index"
    non_key_attributes = []
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

# NOTE: does not exist in prod?
resource "aws_dynamodb_table" "manage_diskspace_requests_table" {
  name           = "${local.environment}-ManageDiskspaceRequestsTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "RequestId"
  range_key      = "username"

  attribute {
    name = "RequestId"
    type = "S"
  }
  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    hash_key           = "username"
    name               = "${local.environment}-diskspace-username-index"
    non_key_attributes = []
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}

resource "aws_dynamodb_table" "schedule_uptime_table" {
  name           = "${local.mismatch_deploy_env}-ScheduleUptimeTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "RequestId"
  range_key      = "username"

  attribute {
    name = "RequestId"
    type = "S"
  }
  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    hash_key           = "username"
    name               = "${local.mismatch_deploy_env}-scheduleuptime-username-index"
    non_key_attributes = []
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.global_tags
}