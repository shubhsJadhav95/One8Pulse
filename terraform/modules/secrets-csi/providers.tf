# ── Provider Configuration ──
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.14"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.14"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.0"
    }
  }
}

# ── AWS Provider ──
provider "aws" {
  region = var.aws_region
}

# ── Kubernetes Provider ──
provider "kubernetes" {
  config_path = "~/.kube/config"
}

# ── Helm Provider ──
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

# ── Kubectl Provider ──
provider "kubectl" {
  config_path = "~/.kube/config"
}

#ADDED