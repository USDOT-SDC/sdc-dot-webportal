variable "auto_export_lambda_name" {
  type = "string"
  default = "sdc-auto-export"
}

data "aws_s3_bucket_object" "auto_export_lambda_zip" {
  bucket = var.lambda_binary_bucket
  key = "sdc-dot-webportal/auto_export_lambda.zip"
}

resource "aws_lambda_function" "auto_export" {
  s3_bucket = data.aws_s3_bucket_object.auto_export_lambda_zip.bucket
  s3_key    = data.aws_s3_bucket_object.auto_export_lambda_zip.key
  s3_object_version = data.aws_s3_bucket_object.auto_export_lambda_zip.version_id
  function_name     = "${var.deploy_env}-${var.auto_export_lambda_name}"
  role              = aws_iam_role.AutoExportLambdaRole.arn
  handler           = "auto_export_lambda.lambda_handler"
  runtime           = "python3.7"
  timeout           = 300
  tags              = local.global_tags
  environment {
    variables = {
      ENVIRONMENT                       = "${var.deploy_env}"
      DYNAMODB_AVAILABLE_DATASET        = "${var.DYNAMODB_AVAILABLE_DATASET}"
      EMAIL_SENDER                      = "${var.EMAIL_SENDER}"
      SDI_TEAM_BUCKET                   = "${var.SDI_TEAM_BUCKET}"
      TFHRC_TEAM_BUCKET                 = "${var.TFHRC_TEAM_BUCKET}"
      WAZE_AUTOEXPORT_BUCKET            = "${var.WAZE_AUTOEXPORT_BUCKET}"
      WYDOT_AUTOEXPORT_BUCKET           = "${var.WYDOT_AUTOEXPORT_BUCKET}"
      WYDOT_TEAM_BUCKET                 = "${var.WYDOT_TEAM_BUCKET}"
      
    }
  }
}

data "aws_iam_policy_document" "sns_policy_doc" {
  statement {
    effect = "Allow"

    actions = [ "SNS:Publish" ]

    resources = [ "arn:aws:sns:*:*:sdc-autoexport-topic" ]

    principals { 
      type        = "AWS"
      identifiers = ["*"]
    }


    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"

      values = [
        for id in var.lambda_trigger_buckets[*]:
          "arn:aws:s3:::${id}"
      ]  
    }  
  }
}

resource "aws_sns_topic" "topic" {
  name    = "sdc-autoexport-topic"
  policy  = "${data.aws_iam_policy_document.sns_policy_doc.json}"
}

resource "aws_iam_role" "AutoExportLambdaRole" {
    name = "${var.deploy_env}-${var.auto_export_lambda_name}"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${var.account_number}:root",
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
  EOF
}


resource "aws_iam_policy" "AutoExportLambdaPermissions" {
    name = "${var.deploy_env}-${var.auto_export_lambda_name}-permissions"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:${var.aws_region}:${var.account_number}:*"
    },
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": [
          "arn:aws:logs:${var.aws_region}:${var.account_number}:log-group:/aws/lambda/${var.deploy_env}-${var.auto_export_lambda_name}:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
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
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "AutoExportCloudWatchLogsAttachment" {
  role        = aws_iam_role.AutoExportLambdaRole.name
  policy_arn  = aws_iam_policy.AutoExportLambdaPermissions.arn
}

resource "aws_lambda_permission" "sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.auto_export.function_name}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.topic.arn}"
}

resource "aws_sns_topic_subscription" "auto_export_subscription_to_lambda" {
  topic_arn = aws_sns_topic.topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.auto_export.arn
}