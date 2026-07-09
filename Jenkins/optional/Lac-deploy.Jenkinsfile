pipeline {
    agent any
    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS Region (ECR Public is ONLY in us-east-1)')
        string(name: 'AWS_ACCOUNT_ID', defaultValue: '797111435256', description: 'AWS Account ID')
        string(name: 'CLUSTER_NAME', defaultValue: 'one8pulse-stage-eks', description: 'cluster name')
        string(name: 'VPC_ID', defaultValue: 'vpc-0c2ef465b10ec3ad7', description: 'vpc-id')
        string(name: 'NAMESPACE', defaultValue: 'one8pulse', description: 'create namespace')
        string(name: 'SERVICE_DIR', defaultValue: 'configserver', description: 'spring boot services')
    }
    environment {
        KUBECONFIG   = "${WORKSPACE}/.kube/config"
        AWS_REGION   = "${params.AWS_REGION}"
        CLUSTER_NAME = "${params.CLUSTER_NAME}"
        NAMESPACE    = "${params.NAMESPACE}"
        VPC_ID       = "${params.VPC_ID}"
    }
    stages {

        stage('1. Checkout Source Code') {
            steps {
                git branch: 'devops',
                    url: 'https://github.com/shubhsJadhav95/One8Pulse.git'
            }
        }

        stage('2. Verify AWS Identity') {
            steps {
                sh '''
                    set -e
                    aws --version
                    aws sts get-caller-identity
                '''
            }
        }

        stage('3. Verify Docker') {
            steps {
                sh '''
                    set -e
                    docker --version
                '''
            }
        }

        stage('4. Configure EKS Cluster') {
            steps {
                sh '''
                    set -e
                    rm -rf ${WORKSPACE}/.kube
                    mkdir -p ${WORKSPACE}/.kube
                    aws eks update-kubeconfig \
                      --region ${AWS_REGION} \
                      --name ${CLUSTER_NAME} \
                      --kubeconfig ${KUBECONFIG}
                '''
            }
        }

        stage('5. Verify Cluster Access') {
            steps {
                sh '''
                    set -e
                    kubectl config current-context
                    kubectl get ns
                '''
            }
        }

        stage('6. Create Namespace') {
            steps {
                sh '''
                    set -e
                    NS="${NAMESPACE:-one8pulse}"
                    kubectl create namespace "$NS" --dry-run=client -o yaml | kubectl apply -f -
                '''
            }
        }

        stage('7. ADD APPLICATION LOAD BALANCER') {
            steps {
                sh '''
                    set -e
                    curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.14.1/docs/install/iam_policy.json

                    aws iam delete-policy --policy-arn arn:aws:iam::797111435256:policy/AWSLoadBalancerControllerIAMPolicy || true

                    aws iam create-policy \
                        --policy-name AWSLoadBalancerControllerIAMPolicy \
                        --policy-document file://iam_policy.json

                    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

                    eksctl utils associate-iam-oidc-provider --region=${AWS_REGION} --cluster=${CLUSTER_NAME} --approve

                    eksctl create iamserviceaccount \
                        --cluster=${CLUSTER_NAME} \
                        --namespace=kube-system \
                        --name=aws-load-balancer-controller \
                        --attach-policy-arn=arn:aws:iam::797111435256:policy/AWSLoadBalancerControllerIAMPolicy \
                        --override-existing-serviceaccounts \
                        --region ${AWS_REGION} \
                        --approve

                    helm repo add eks https://aws.github.io/eks-charts
                    helm repo update eks

                    helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
                        -n kube-system \
                        --set clusterName=${CLUSTER_NAME} \
                        --set serviceAccount.create=false \
                        --set serviceAccount.name=aws-load-balancer-controller \
                        --set region=${AWS_REGION} \
                        --set vpcId=${VPC_ID} \
                        --version 1.14.0

                    kubectl rollout status deployment/aws-load-balancer-controller -n kube-system --timeout=120s
                '''
            }
        }

        stage('8. ADD SECRET MANAGER') {
            steps {
                sh '''
                    set -e

                    helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
                    helm repo update

                    helm upgrade --install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
                        --namespace kube-system \
                        --set syncSecret.enabled=true \
                        --set enableSecretRotation=true

                    kubectl patch csidriver secrets-store.csi.k8s.io --type=merge -p '{
                        "spec": {
                            "tokenRequests": [
                                {"audience": "sts.amazonaws.com"},
                                {"audience": "pods.eks.amazonaws.com"}
                            ]
                        }
                    }'

                    kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml

                    cat > secrets-manager-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Resource": "arn:aws:secretsmanager:*:797111435256:secret:*"
        }
    ]
}
EOF

                    aws iam delete-policy --policy-arn arn:aws:iam::797111435256:policy/EksSecretManagerPolicy || true

                    aws iam create-policy \
                        --policy-name EksSecretManagerPolicy \
                        --policy-document file://secrets-manager-policy.json

                    eksctl utils associate-iam-oidc-provider --region=${AWS_REGION} --cluster=${CLUSTER_NAME} --approve
                   

                    eksctl create iamserviceaccount \
                        --cluster=${CLUSTER_NAME} \
                        --namespace=${NAMESPACE} \
                        --name=aws-csi-secret-manager \
                        --attach-policy-arn=arn:aws:iam::797111435256:policy/EksSecretManagerPolicy \
                        --override-existing-serviceaccounts \
                        --region ${AWS_REGION} \
                        --approve

                    kubectl get sa -n ${NAMESPACE}
                '''
            }
        }

    }
}