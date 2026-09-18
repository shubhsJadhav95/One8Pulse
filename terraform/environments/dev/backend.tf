terraform {
  backend "s3" {
    bucket       = "samlondhe95-terraform-s3-1"
    key          = "backend-locking"
    region       = "us-east-1"
    use_lockfile = true
  }
}