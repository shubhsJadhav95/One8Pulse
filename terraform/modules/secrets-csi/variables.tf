variable "cluster_name" {
  type = string
}

variable "oidc_provider_arn" {
  type = string
}

variable "oidc_provider_url" {
  type = string
}

variable "app_namespace" {
  type    = string
  default = "one8pulse"
}

variable "service_account_name" {
  type    = string
  default = "aws-csi-secret-manager"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}
