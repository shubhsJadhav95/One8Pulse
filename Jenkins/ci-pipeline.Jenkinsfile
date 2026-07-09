pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS Region (ECR Public is ONLY in us-east-1)')
        string(name: 'AWS_ACCOUNT_ID', defaultValue: '797111435256', description: 'AWS Account ID')
        string(name: 'ECR_PUBLIC_ALIAS', defaultValue: 't3q3l4n7', description: 'ECR Public registry alias (from aws ecr-public create-repository)')
        string(name: 'ECR_REPO_NAME', defaultValue: 'backend/configserver', description: 'ECR Repository Name')
        string(name: 'VERSION', defaultValue: 'latest', description: 'Docker Image Version')
        string(name: 'SERVICE_DIR', defaultValue: 'configserver', description: 'spring boot services')
    }

    tools {
        jdk 'jdk21'
        maven 'maven3'
    }

    environment {
        // Public ECR always lives under public.ecr.aws, not <account>.dkr.ecr.<region>.amazonaws.com
        IMAGE_URI = "public.ecr.aws/${params.ECR_PUBLIC_ALIAS}/${params.ECR_REPO_NAME}"
    }

    stages {

        stage('1.Checkout Source Code') {
            steps {
                git branch: 'devops',
                    url: 'https://github.com/shubhsJadhav95/One8Pulse.git'
            }
        }

        stage('2.Build Application') {
            steps {
                dir("${params.SERVICE_DIR}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage("3.Test Application") {
            steps {
                dir("${params.SERVICE_DIR}") {
                    sh "mvn test || true"
                }
            }
        }

        stage('4.SonarQube Analysis') {
            steps {
                dir("${params.SERVICE_DIR}") {
                    withSonarQubeEnv('sonar-server') {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }

        stage('5.Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false,
                    credentialsId: 'sonar-token'
                }
            }
        }

        stage('6.Trivy Filesystem Scan') {
            steps {
                dir("${params.SERVICE_DIR}") {
                    sh 'trivy fs --format table -o trivy-report.txt .'
                }
            }
        }

        stage('7.Build Docker Image') {
            steps {
                dir("${params.SERVICE_DIR}") {
                    sh "docker build -t ${params.ECR_REPO_NAME} ."
                }
            }
        }

        stage('8.Create ECR Public Repository') {
            steps {
                withCredentials([string(credentialsId: 'AWS_ACCESS_KEY', variable: 'AWS_ACCESS_KEY_ID'),
                                 string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                    # ECR Public API calls MUST target us-east-1 regardless of workload region
                    aws ecr-public describe-repositories --repository-names "$ECR_REPO_NAME" --region us-east-1 || \
                    aws ecr-public create-repository --repository-name "$ECR_REPO_NAME" --region us-east-1
                    '''
                }
            }
        }

        stage('9.Login to ECR Public & tag image') {
            steps {
                withCredentials([string(credentialsId: 'AWS_ACCESS_KEY', variable: 'AWS_ACCESS_KEY_ID'),
                                 string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                    aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
                    docker tag "$ECR_REPO_NAME" "$IMAGE_URI:$BUILD_NUMBER"
                    docker tag "$ECR_REPO_NAME" "$IMAGE_URI:latest"
                    '''
                }
            }
        }

        stage('10.Push image to ECR Public') {
            steps {
                withCredentials([string(credentialsId: 'AWS_ACCESS_KEY', variable: 'AWS_ACCESS_KEY'),
                                 string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_KEY')]) {
                    sh """
                    docker push ${IMAGE_URI}:${BUILD_NUMBER}
                    docker push ${IMAGE_URI}:latest
                    """
                }
            }
        }

        stage('11.Cleanup Images') {
            steps {
                sh """
                docker rmi ${IMAGE_URI}:${BUILD_NUMBER}
                docker rmi ${IMAGE_URI}:latest
                docker images
                """
            }
        }
    }
}