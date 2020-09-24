
variable "deploy_env" {
  type        = string
  description = "Deploy environment (dev, prod, test)"
}

variable "webportal_bucket_name" {
  type        = string
  description = "The name for the bucket in which we store all the webportal static assets"
}

variable "aws_region" {
  type = string
  default = "us-east-1"
}

variable "lambda_name" {
  type = string
  default = "add-metadata-to-s3-object"
}

variable "lambda_binary_bucket" {
  type = string
}

variable "account_number" {
  type = string
  default = "911061262852"
}

variable "EXPORT_REQUEST_FOLDER" {
  type = string
  default = "export_requests"
}

variable "lambda_trigger_buckets" {
  type = list(string)
}
#
# locals to be provided globally
#
locals {
  global_tags = {
    "SourceRepo"  = "sdc-dot-webportal"
    "Project"     = "SDC-Platform"
    "Team"        = "sdc-platform"
    "Environment" = var.deploy_env
    "Owner"       = "SDC support team"
  }
}
