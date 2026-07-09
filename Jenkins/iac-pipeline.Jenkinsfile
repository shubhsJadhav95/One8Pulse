pipeline {
    agent any {

        parameters{
            string(name:'Terraform Directory',defaultValue:'terraform/environments/dev',description:'directory for an terraform')
        }


        stages {
            stage('1.Git Checkout') {
                git branch: 'devops',
                    url: 'https://github.com/shubhsJadhav95/One8Pulse.git'
            }

            stage('2.Terraform Initilization'){
                steps {
                      dir("${params.SERVICE_DIR}") {
                       sh '''
                       terraform init 
                       terraform plan
                       '''
                    }
                }
            }
            stage('3. Terraform Deploy')
            {
                steps {
                    sh '''
                    terraform apply --auto-approve
                    '''
                }
            }
          }
        }
    }
