resource "aws_s3_bucket" "webportal_bucket" {
  bucket        = var.webportal_bucket_name
  acl           = "private"
  force_destroy = false

  tags = local.global_tags
}
