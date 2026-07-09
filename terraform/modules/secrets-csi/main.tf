
resource "helm_release" "secrets_store_csi" {
  name       = "csi-secrets-store"
  repository = "https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts"        
  chart      = "secrets-store-csi-driver"
  namespace  = "kube-system"

  set {
    name  = "syncSecret.enabled"
    value = "true"
  }
  set {
    name  = "enableSecretRotation"
    value = "true"
  }
}


data "http" "aws_provider_installer" {
  url = "https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml"
}

data "kubectl_file_documents" "aws_provider_docs" {
  content = data.http.aws_provider_installer.response_body
}

resource "kubectl_manifest" "aws_provider" {
  for_each  = data.kubectl_file_documents.aws_provider_docs.manifests
  yaml_body = each.value

  depends_on = [helm_release.secrets_store_csi]
}

# ── 3. Patch CSIDriver for token audiences ──
# Terraform has no native "patch" verb for a resource it doesn't own.
# The chart already creates the CSIDriver object, so we manage the patch
# via kubectl_manifest with force_new / server-side apply merge instead
# of a raw kubectl patch (keeps it idempotent + in state).
resource "kubectl_manifest" "csidriver_patch" {
  yaml_body = <<-YAML
    apiVersion: storage.k8s.io/v1
    kind: CSIDriver
    metadata:
      name: secrets-store.csi.k8s.io
    spec:
      tokenRequests:
        - audience: sts.amazonaws.com
        - audience: pods.eks.amazonaws.com
      attachRequired: false
      podInfoOnMount: true
      volumeLifecycleModes:
        - Ephemeral
  YAML

  depends_on = [helm_release.secrets_store_csi]
}

# ── 4. IAM policy for Secrets Manager access ──
resource "aws_iam_policy" "secrets_manager" {
  name = "EksSecretManagerPolicy-"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "VisualEditor0"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:797111435256:secret:*"
      }
    ]
  })
}

# ── 5. IRSA role trusted by OIDC for the service account ──
data "aws_iam_policy_document" "secrets_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [var.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = ":sub"
      values   = ["system:serviceaccount::"]
    }

    condition {
      test     = "StringEquals"
      variable = ":aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "secrets_manager" {
  name               = "EksSecretManagerRole-"
  assume_role_policy = data.aws_iam_policy_document.secrets_trust.json
}

resource "aws_iam_role_policy_attachment" "secrets_manager" {
  role       = aws_iam_role.secrets_manager.name
  policy_arn = aws_iam_policy.secrets_manager.arn
}

# ── 6. Kubernetes Namespace ──
resource "kubernetes_namespace_v1" "app" {
  metadata {
    name = var.app_namespace
  }
}

# ── 7. Kubernetes ServiceAccount (replaces ksctl create iamserviceaccount) ──
resource "kubernetes_service_account_v1" "secrets_manager" {
  metadata {
    name      = var.service_account_name
    namespace = kubernetes_namespace_v1.app.metadata[0].name
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.secrets_manager.arn
    }
  }
}
