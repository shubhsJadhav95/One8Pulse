module "alb_controller" {
  source = "../../modules/alb-controller"

  cluster_name      = module.eks.cluster_name
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
  vpc_id            = module.vpc.vpc_id
  aws_region        = var.aws_region
  
}

module "secrets_csi" {
  source = "../../modules/secrets-csi"

  cluster_name      = module.eks.cluster_name
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
  app_namespace     = "neocare"
}

# ── 1. VPC ──
module "vpc" {
  source = "../../modules/vpc"

  project              = var.project
  env                  = var.env
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  tags                 = local.common_tags
}

# ── 2. Jump Server (public subnet) ──
module "jump_server" {
  source = "../../modules/ec2-jump"

  project           = var.project
  env               = var.env
  vpc_id            = module.vpc.vpc_id
  public_subnet_id  = module.vpc.public_subnet_ids[0]
  ami_id            = var.ami_id
  instance_type     = var.jump_instance_type
  public_key_path   = var.public_key_path
  allowed_ssh_cidrs = var.allowed_ssh_cidrs
  tags              = local.common_tags

  depends_on = [module.vpc]
}

# ── 3. Jenkins Server (private subnet) ──
module "jenkins" {
  source = "../../modules/ec2-jenkins"

  project           = var.project
  env               = var.env
  vpc_id            = module.vpc.vpc_id
  vpc_cidr          = var.vpc_cidr
  private_subnet_id = module.vpc.private_subnet_ids[0]
  jump_sg_id        = module.jump_server.jump_sg_id
  key_name          = "${var.project}-${var.env}-jump-key"
  ami_id            = var.ami_id
  instance_type     = var.jenkins_instance_type
  tags              = local.common_tags

  depends_on = [module.jump_server]
}

# ── 4. EKS Cluster (private subnets) ──
module "eks" {
  source = "../../modules/eks"

  project                = var.project
  env                    = var.env
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  public_subnet_ids      = module.vpc.public_subnet_ids
  jenkins_sg_id          = module.jenkins.jenkins_sg_id
  jump_sg_id             = module.jump_server.jump_sg_id
  kubernetes_version     = var.kubernetes_version
  node_instance_type     = var.node_instance_type
  node_desired_size      = var.node_desired_size
  node_min_size          = var.node_min_size
  node_max_size          = var.node_max_size
  enable_public_endpoint = var.eks_public_endpoint
  tags                   = local.common_tags

  depends_on = [module.vpc]
}


# ── 6. RDS ──
module "rds" {
  source = "../../modules/rds"

  project            = var.project
  env                = var.env
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.vpc.private_subnet_ids
  db_password        = var.db_password
  eks_node_sg_id     = module.eks.node_security_group_id
  tags               = local.common_tags

  depends_on = [module.vpc, module.eks]
}

# ── Local values ──
locals {
  common_tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "terraform"
  }
}