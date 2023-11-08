resource "aws_s3_bucket_notification" "lambda_trigger_buckets_notification" {
    count  = length(local.lambda_trigger_buckets)
    bucket = local.lambda_trigger_buckets[count.index]

    lambda_function {
        lambda_function_arn = aws_lambda_function.add_metadata.arn
        events              = ["s3:ObjectCreated:Put", "s3:ObjectCreated:CompleteMultipartUpload"]
        filter_prefix = "export_requests/"
    }

    topic {
        topic_arn     = aws_sns_topic.topic.arn
        events        = ["s3:ObjectCreated:*"]
        filter_prefix = "auto_export/"
    }

    depends_on = [aws_lambda_permission.allow_lambda_trigger_buckets]
}
