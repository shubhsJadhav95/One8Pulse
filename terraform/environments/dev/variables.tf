# ── General ──
variable "project" {
  description = "Project / application name"
  type        = string
  default = "one8pulse"
}

variable "env" {
  description = "Environment (dev / staging / prod)"
  type        = string
  default = "stage"
}

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

# ── Network ──
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

# ── EC2 ──
variable "ami_id" {
  description = "ubuntu AMI for us-east-1"
  type        = string
   default = "ami-0b6d9d3d33ba97d99" # Find latest: aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64
}

variable "jump_instance_type" {
  type    = string
  default = "c7i-flex.large"
}

variable "jenkins_instance_type" {
  type    = string
  default = "m7i-flex.large"
}

variable "public_key_path" {
  description = "Path to your SSH public key"
  type        = string
  default     = "../../keys/neocare.pub"
}

variable "allowed_ssh_cidrs" {
  description = "Your office/home IP to allow SSH to jump server"
  type        = list(string)
  default = ["45.118.105.241/32" ]
}

# ── EKS ──
variable "kubernetes_version" {
  type    = string
  default = "1.32"
}

variable "node_instance_type" {
  type    = string
  default = "m7i-flex.large"
}

variable "node_desired_size" {
  type    = number
  default = 2
}

variable "node_min_size" {
  type    = number
  default = 1
}

variable "node_max_size" {
  type    = number
  default = 4
}

variable "eks_public_endpoint" {
  description = "Expose EKS API server publicly (false = private only)"
  type        = bool
  default     = false
}

variable "db_username" {
    type = string
    default = "postgres"
}

variable "db_password" {
  type      = string
  sensitive = true
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