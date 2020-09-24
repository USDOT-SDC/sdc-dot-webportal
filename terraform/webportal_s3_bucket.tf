resource "aws_s3_bucket" "webportal_bucket" {
  bucket        = var.webportal_bucket_name
  acl           = "private"
  force_destroy = false
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = local.global_tags
}
