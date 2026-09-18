# ── Required — no defaults, must be set per cluster ──

# Get with:
#   aws eks describe-cluster --name <your-cluster-name> --query "cluster.identity.oidc.issuer" --output text
# then strip the leading "https://"
oidc_provider_url = "oidc.eks.us-east-1.amazonaws.com/id/3C36F47C8CD8B88F11A8034469FCD5C0"

# Get with:
#   aws iam list-open-id-connect-providers
oidc_provider_arn = "arn:aws:iam::658548981947:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/3C36F47C8CD8B88F11A8034469FCD5C0"

# ── Optional — shown here with the values matching your current setup ──

aws_account_id        = "658548981947"
aws_region             = "us-east-1"
app_namespace           = "one8pulse"
service_account_name    = "aws-csi-secret-manager"
name_suffix             = "stage-one8pulse"

# Tighten this to your actual secret prefix for least privilege, e.g. "stage/*"
secrets_manager_arn_pattern = "*"
