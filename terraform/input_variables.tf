
variable "deploy_env" {
  type        = string
  description = "Deploy environment (dev, prod, test)"
}
variable "webportal_bucket_name" {
  type        = string
  description = "The name for the bucket in which we store all the webportal static assets"
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