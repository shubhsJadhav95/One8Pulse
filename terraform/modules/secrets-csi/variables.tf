variable "cluster_name" {
  description = "EKS cluster name, used to build unique IAM resource names"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of the EKS cluster's IAM OIDC identity provider, e.g. arn:aws:iam::<account>:oidc-provider/oidc.eks.<region>.amazonaws.com/id/<cluster-id>"
  type        = string
}

variable "oidc_provider_url" {
  description = "OIDC issuer URL WITHOUT the https:// prefix, e.g. oidc.eks.us-east-1.amazonaws.com/id/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX. Get it with: aws eks describe-cluster --name <cluster> --query \"cluster.identity.oidc.issuer\" --output text"
  type        = string
}

variable "app_namespace" {
  description = "Kubernetes namespace the application (and its ServiceAccount) will live in"
  type        = string
  default     = "one8pulse"
}

variable "service_account_name" {
  description = "Name of the Kubernetes ServiceAccount that will be annotated for IRSA and used by the app pod"
  type        = string
  default     = "aws-csi-secret-manager"
}

variable "aws_region" {
  description = "AWS region where secrets live (used for IAM resource ARNs, not a hard restriction on the driver)"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS account ID that owns the secrets and IAM resources"
  type        = string
  default     = "797111435256"
}

variable "name_suffix" {
  description = "Suffix appended to IAM role/policy names to keep them unique per environment (e.g. \"stage-one8pulse\"). Required because IAM resource names are account-global."
  type        = string
  default     = "stage-one8pulse"
}

variable "secrets_manager_arn_pattern" {
  description = "Resource ARN pattern the IAM policy grants access to. Defaults to ALL secrets in the account/region — narrow this to specific secret name prefixes (e.g. \"stage/*\") for least privilege."
  type        = string
  default     = "*"
}