# ── Outputs ──
output "helm_release_name" {
  description = "Name of the Helm release for Secrets Store CSI Driver"
  value       = helm_release.secrets_store_csi.name
}

output "helm_release_status" {
  description = "Status of the Helm release"
  value       = helm_release.secrets_store_csi.status
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy for Secrets Manager access"
  value       = aws_iam_policy.secrets_manager.arn
}

output "iam_role_arn" {
  description = "ARN of the IAM role for Secrets Manager"
  value       = aws_iam_role.secrets_manager.arn
}

output "service_account_name" {
  description = "Name of the Kubernetes service account"
  value       = kubernetes_service_account_v1.secrets_manager.metadata[0].name
}

output "namespace" {
  description = "Kubernetes namespace for the service account"
  value       = kubernetes_namespace_v1.app.metadata[0].name
}
