# ── modules/aws-lb-controller/outputs.tf ──

output "iam_role_arn" {
  description = "ARN of the IAM role (use this for Kubernetes service account annotation)"
  value       = aws_iam_role.lb_controller.arn
}

output "iam_role_name" {
  description = "Name of the IAM role"
  value       = aws_iam_role.lb_controller.name
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy"
  value       = aws_iam_policy.lb_controller.arn
}

output "iam_policy_name" {
  description = "Name of the IAM policy"
  value       = aws_iam_policy.lb_controller.name
}
