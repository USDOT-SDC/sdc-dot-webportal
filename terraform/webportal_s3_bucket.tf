resource "aws_s3_bucket" "webportal_bucket" {
  bucket        = local.webportal_bucket
  force_destroy = false
  tags          = local.global_tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "webportal_bucket" {
  bucket = aws_s3_bucket.webportal_bucket.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_acl" "webportal_bucket" {
  bucket = aws_s3_bucket.webportal_bucket.id
  acl    = "private"
}
