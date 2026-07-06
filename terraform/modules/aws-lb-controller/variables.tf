# ── modules/aws-lb-controller/variables.tf ──

variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "oidc_provider_arn" {
  type        = string
  description = "ARN of the EKS OIDC provider (module.eks.oidc_provider_arn)"
}

variable "oidc_provider_url" {
  type        = string
  description = "Issuer URL of the EKS OIDC provider (module.eks.oidc_provider_url)"
}

variable "vpc_id" {
  type = string
}

variable "region" {
  type = string
}

variable "namespace" {
  type    = string
  default = "kube-system"
}

variable "service_account_name" {
  type    = string
  default = "aws-load-balancer-controller"
}

variable "helm_chart_version" {
  type    = string
  default = "1.8.1"
}

variable "tags" {
  type    = map(string)
  default = {}
}
