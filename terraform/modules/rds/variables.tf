variable "project"             { type = string }
variable "env"                 { type = string }
variable "vpc_id"              { type = string }
variable "private_subnet_ids"  { type = list(string) }


variable "db_username" {
    type = string
    default = "postgres"
}

variable "db_password" {
  type        = string
  description = "Master password for the database"
  sensitive   = true
  # No default — should be supplied via TF_VAR_db_password, tfvars, or a secret manager
}

variable "db_name" {
    type = string
    default = "one8pulse"
}

variable "db_identifier" {
    type = string
    default = "my-postgres-db"
}


variable "db_engine" {
    type = string
    default = "postgres"
}


variable "engine_version" {
    type = string
    default = "16.3"
}


variable "instance_class" {
    type = string
    default = "db.t3.micro"
}


variable "storage_type" {
    type = string
    default = "gp3"
}


variable "publicly_accessible" {
  type        = bool
  description = "Whether the RDS instance is publicly accessible"
  default     = false
}

variable "skip_final_snapshot" {
  type        = bool
  description = "Whether to skip the final snapshot on deletion"
  default     = true
}


variable "allocated_storage" {
  type        = number
  description = "Allocated storage in GB"
  default     = 20
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block of the VPC"
}

variable "eks_node_sg_id" {
  type        = string
  description = "Security group ID of the EKS nodes"
}

variable "tags" {
  type        = map(string)
  description = "Common tags"
  default     = {}
}