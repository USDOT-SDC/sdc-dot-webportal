#
# Items with defaults
#

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "lambda_zip_path" {
  type = string
  default = "../"
}

variable "log_level" {
  type    = string
  default = "INFO"
  description = "Logging level for unified log4sdc facility"
}


variable "AUTHORIZERID" {
  type    = string
  description = "AUTHORIZERID"
}

variable "COGNITO_USER_POOL" {
  type    = string
  description = "COGNITO_USER_POOL"
}

variable "USER_POOL_ID" {
  type    = string
  description = "USER_POOL_ID"
}

variable "RECEIVER_EMAIL" {
  type    = string
  description = "RECEIVER_EMAIL"
}

variable "RESTAPIID" {
  type    = string
  description = "RESTAPIID"
}

variable "TABLENAME_AUTOEXPORT_USERS" {
  type    = string
  description = "TABLENAME_AUTOEXPORT_USERS"
}

variable "TABLENAME_AVAILABLE_DATASET" {
  type    = string
  description = "TABLENAME_AVAILABLE_DATASET"
}

variable "TABLENAME_EXPORT_FILE_REQUEST" {
  type    = string
  description = "TABLENAME_EXPORT_FILE_REQUEST"
}


variable "TABLENAME_MANAGE_DISK" {
  type    = string
  description = "TABLENAME_MANAGE_DISK"
}

variable "TABLENAME_MANAGE_DISK_INDEX" {
  type    = string
  description = "TABLENAME_MANAGE_DISK_INDEX"
}

variable "TABLENAME_MANAGE_UPTIME" {
  type    = string
  description = "TABLENAME_MANAGE_UPTIME"
}

variable "TABLENAME_MANAGE_UPTIME_INDEX" {
  type    = string
  description = "TABLENAME_MANAGE_UPTIME_INDEX"
}


variable "TABLENAME_MANAGE_USER" {
  type    = string
  description = "TABLENAME_MANAGE_USER"
}

variable "TABLENAME_MANAGE_USER_INDEX" {
  type    = string
  description = "TABLENAME_MANAGE_USER_INDEX"
}

variable "TABLENAME_TRUSTED_USERS" {
  type    = string
  description = "TABLENAME_TRUSTED_USERS"
}

variable "TABLENAME_USER_STACKS" {
  type    = string
  description = "TABLENAME_USER_STACKS"
}



#
# locals to be provided globally
#
locals {
  aws_region            = var.aws_region
  account_id            = data.aws_caller_identity.current.account_id
  environment           = data.aws_ssm_parameter.environment.value
  log_level             = var.log_level

  AUTHORIZERID = var.AUTHORIZERID
  COGNITO_USER_POOL = var.COGNITO_USER_POOL
  IDP_PROVIDER_ARNS = "arn:aws:cognito-idp:us-east-1:${data.aws_caller_identity.current.account_id}:userpool/${var.USER_POOL_ID}"
  RECEIVER_EMAIL = var.RECEIVER_EMAIL
  RESTAPIID = var.RESTAPIID
  TABLENAME_AUTOEXPORT_USERS = var.TABLENAME_AUTOEXPORT_USERS
  TABLENAME_AVAILABLE_DATASET = var.TABLENAME_AVAILABLE_DATASET
  TABLENAME_EXPORT_FILE_REQUEST = var.TABLENAME_EXPORT_FILE_REQUEST
  TABLENAME_MANAGE_DISK = var.TABLENAME_MANAGE_DISK
  TABLENAME_MANAGE_DISK_INDEX = var.TABLENAME_MANAGE_DISK_INDEX
  TABLENAME_MANAGE_UPTIME = var.TABLENAME_MANAGE_UPTIME
  TABLENAME_MANAGE_UPTIME_INDEX = var.TABLENAME_MANAGE_UPTIME_INDEX
  TABLENAME_MANAGE_USER = var.TABLENAME_MANAGE_USER
  TABLENAME_MANAGE_USER_INDEX = var.TABLENAME_MANAGE_USER_INDEX
  TABLENAME_TRUSTED_USERS = var.TABLENAME_TRUSTED_USERS
  TABLENAME_USER_STACKS = var.TABLENAME_USER_STACKS

  lambda_tags = {
    "SourceRepo"  = "sdc-dot-webportal"
    "Project"     = "SDC-Platform"
    "Team"        = "sdc-platform"
    "Environment" = "${data.aws_ssm_parameter.environment.value}"
    "Owner"       = "SDC support team"
    "aws-chalice" = "version=1.13.0:stage=ecs-dev:app=webportal"
    # "aws-chalice" = "version=1.13.0:stage=ecs-${data.aws_ssm_parameter.environment.value}:app=webportal"
  }

  global_tags = {
    "SourceRepo"  = "sdc-dot-webportal"
    "Project"     = "SDC-Platform"
    "Team"        = "sdc-platform"
    "Environment" = "${data.aws_ssm_parameter.environment.value}"
    "Owner"       = "SDC support team"
  }
}

