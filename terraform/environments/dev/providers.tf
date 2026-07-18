  terraform {
    required_version = ">= 1.6.0"

    required_providers {
      aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
      }
      tls = {
        source  = "hashicorp/tls"
        version = "~> 4.0"
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
        version = "~> 3.4"
      }
    }
  }

  # ── AWS Provider ──
  provider "aws" {
    region = var.aws_region

    default_tags {
      tags = {
        Project     = var.project
        Environment = var.env
        ManagedBy   = "terraform"
        Team        = "devops"
      }
    }
  }

  # ── Kubernetes Provider (used by alb_controller's SA, secrets_csi's SA/resources) ──
  provider "kubernetes" {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name, "--region", var.aws_region]
    }
  }

  # ── Helm Provider (used by alb_controller's helm_release, secrets_csi's helm_release) ──
  provider "helm" {
    kubernetes {
      host                   = module.eks.cluster_endpoint
      cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
      exec {
        api_version = "client.authentication.k8s.io/v1beta1"
        command     = "aws"
        args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name, "--region", var.aws_region]
      }
    }
  }

  # ── Kubectl Provider (used by secrets_csi's kubectl_manifest, e.g. SecretProviderClass/CSIDriver patch) ──
  provider "kubectl" {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
    load_config_file       = false
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name, "--region", var.aws_region]
    }
  }