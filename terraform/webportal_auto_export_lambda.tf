variable "auto_export_lambda_name" {
  type    = string
  default = "sdc-auto-export"
}

data "archive_file" "auto_export" {
  type        = "zip"
  source_file = "${path.module}./auto_export_lambda/auto_export_lambda.py"
  output_path = "${path.module}./auto_export_lambda/deployment-package.zip"
}

resource "aws_lambda_function" "auto_export" {
  function_name    = "${local.environment}-${var.auto_export_lambda_name}"
  filename         = data.archive_file.add_metadata.output_path
  source_code_hash = data.archive_file.add_metadata.output_base64sha256
  role             = aws_iam_role.AutoExportLambdaRole.arn
  handler          = "auto_export_lambda.lambda_handler"
  runtime          = "python3.11"
  timeout          = 300
  tags             = local.global_tags
  environment {
    variables = {
      ENVIRONMENT                = "${local.environment}"
      DYNAMODB_AVAILABLE_DATASET = "${local.available_datasets_table}"
      EMAIL_SENDER               = "${local.sdc_support.email}"
      SDI_TEAM_BUCKET            = "${var.SDI_TEAM_BUCKET}"
      TFHRC_TEAM_BUCKET          = "${var.TFHRC_TEAM_BUCKET}"
      WAZE_AUTOEXPORT_BUCKET     = "${var.WAZE_AUTOEXPORT_BUCKET}"
    }
  }
}

data "aws_iam_policy_document" "sns_policy_doc" {
  statement {
    effect = "Allow"

    actions = ["SNS:Publish"]

    resources = ["arn:aws:sns:*:*:sdc-autoexport-topic"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }


    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"

      values = [
        for id in local.lambda_trigger_buckets[*] :
        "arn:aws:s3:::${id}"
      ]
    }
  }
}

resource "aws_sns_topic" "topic" {
  name   = "sdc-autoexport-topic"
  policy = data.aws_iam_policy_document.sns_policy_doc.json
}

resource "aws_iam_role" "AutoExportLambdaRole" {
  name = "${local.environment}-${var.auto_export_lambda_name}"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Principal" : {
            "AWS" : "arn:aws:iam::${local.account_id}:root",
            "Service" : "lambda.amazonaws.com"
          },
          "Action" : "sts:AssumeRole"
        }
      ]
    }
  )
}


resource "aws_iam_policy" "AutoExportLambdaPermissions" {
  name = "${local.environment}-${var.auto_export_lambda_name}-permissions"
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Action" : "logs:CreateLogGroup",
          "Resource" : "arn:aws:logs:${local.region_name}:${local.account_id}:*"
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource" : [
            "arn:aws:logs:${local.region_name}:${local.account_id}:log-group:/aws/lambda/${local.environment}-${var.auto_export_lambda_name}:*"
          ]
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "s3:DeleteAccessPoint",
            "ses:SendEmail",
            "s3:PutLifecycleConfiguration",
            "dynamodb:DescribeContinuousBackups",
            "s3:DeleteObject",
            "s3:GetBucketWebsite",
            "s3:PutReplicationConfiguration",
            "s3:GetObjectLegalHold",
            "s3:GetBucketNotification",
            "s3:GetReplicationConfiguration",
            "s3:PutObject",
            "s3:PutBucketNotification",
            "dynamodb:GetShardIterator",
            "dynamodb:DescribeReservedCapacity",
            "s3:PutBucketObjectLockConfiguration",
            "s3:CreateJob",
            "s3:GetLifecycleConfiguration",
            "s3:GetInventoryConfiguration",
            "s3:GetBucketTagging",
            "dynamodb:ListTables",
            "dynamodb:ListTagsOfResource",
            "s3:ListBucket",
            "dynamodb:DescribeReservedCapacityOfferings",
            "s3:AbortMultipartUpload",
            "s3:UpdateJobPriority",
            "dynamodb:DescribeLimits",
            "s3:DeleteBucket",
            "s3:PutBucketVersioning",
            "s3:ListBucketMultipartUploads",
            "s3:PutMetricsConfiguration",
            "dynamodb:Query",
            "dynamodb:DescribeStream",
            "s3:GetBucketVersioning",
            "dynamodb:ListStreams",
            "s3:PutInventoryConfiguration",
            "dynamodb:ListContributorInsights",
            "s3:GetAccountPublicAccessBlock",
            "dynamodb:ListGlobalTables",
            "s3:PutBucketWebsite",
            "s3:ListAllMyBuckets",
            "s3:PutBucketRequestPayment",
            "s3:PutObjectRetention",
            "dynamodb:DescribeGlobalTable",
            "s3:GetBucketCORS",
            "s3:GetObjectVersion",
            "s3:PutAnalyticsConfiguration",
            "s3:GetObjectVersionTagging",
            "logs:*",
            "dynamodb:DescribeContributorInsights",
            "s3:CreateBucket",
            "s3:ReplicateObject",
            "s3:GetObjectAcl",
            "s3:GetBucketObjectLockConfiguration",
            "s3:DeleteBucketWebsite",
            "dynamodb:DescribeTable",
            "dynamodb:GetItem",
            "s3:GetObjectVersionAcl",
            "s3:HeadBucket",
            "s3:GetBucketPolicyStatus",
            "dynamodb:BatchGetItem",
            "s3:GetObjectRetention",
            "s3:ListJobs",
            "dynamodb:Scan",
            "s3:PutObjectLegalHold",
            "s3:PutBucketCORS",
            "s3:ListMultipartUploadParts",
            "s3:GetObject",
            "s3:DescribeJob",
            "s3:PutBucketLogging",
            "s3:GetAnalyticsConfiguration",
            "s3:GetObjectVersionForReplication",
            "dynamodb:DescribeBackup",
            "dynamodb:GetRecords",
            "dynamodb:DescribeTableReplicaAutoScaling",
            "s3:CreateAccessPoint",
            "s3:GetAccessPoint",
            "s3:PutAccelerateConfiguration",
            "s3:DeleteObjectVersion",
            "s3:GetBucketLogging",
            "s3:ListBucketVersions",
            "s3:RestoreObject",
            "s3:GetAccelerateConfiguration",
            "s3:GetBucketPolicy",
            "s3:PutEncryptionConfiguration",
            "s3:GetEncryptionConfiguration",
            "s3:GetObjectVersionTorrent",
            "s3:GetBucketRequestPayment",
            "s3:GetAccessPointPolicyStatus",
            "s3:GetObjectTagging",
            "s3:GetMetricsConfiguration",
            "s3:GetBucketPublicAccessBlock",
            "dynamodb:ConditionCheckItem",
            "s3:ListAccessPoints",
            "dynamodb:ListBackups",
            "s3:UpdateJobStatus",
            "dynamodb:DescribeTimeToLive",
            "s3:GetBucketAcl",
            "dynamodb:DescribeGlobalTableSettings",
            "s3:GetObjectTorrent",
            "s3:GetBucketLocation",
            "s3:GetAccessPointPolicy",
            "s3:ReplicateDelete"
          ],
          "Resource" : "*"
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "AutoExportCloudWatchLogsAttachment" {
  role       = aws_iam_role.AutoExportLambdaRole.name
  policy_arn = aws_iam_policy.AutoExportLambdaPermissions.arn
}

resource "aws_lambda_permission" "sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auto_export.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.topic.arn
}

resource "aws_sns_topic_subscription" "auto_export_subscription_to_lambda" {
  topic_arn = aws_sns_topic.topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.auto_export.arn
}
