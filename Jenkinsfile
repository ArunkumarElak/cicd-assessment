pipeline {
    agent any

    environment {
        IMAGE_NAME = "cicd-app:${BUILD_NUMBER}"
        LATEST_IMAGE = "cicd-app:latest"
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Build & Test') {
            steps {
                echo 'Running unit tests...'
                sh 'cd app && npm test'
            }
        }

        stage('3. Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                sh "docker build -t ${IMAGE_NAME} -t ${LATEST_IMAGE} ."
            }
        }

        stage('4. Trivy Security Scan') {
            steps {
                echo 'Scanning Docker image for vulnerabilities...'
                sh "trivy image --severity HIGH,CRITICAL --output trivy-report.txt ${LATEST_IMAGE} || true"
            }
        }

        stage('5. Deploy via Docker Compose') {
            steps {
                echo 'Deploying application...'
                sh "docker compose down"
                sh "docker compose up -d"
            }
        }

        stage('6. Health Check') {
            steps {
                script {
                    echo 'Verifying application health...'
                    sleep 10
                    def healthStatus = sh(
                        script: "docker inspect --format='{{.State.Health.Status}}' production_app",
                        returnStdout: true
                    ).trim()

                    if (healthStatus != "healthy") {
                        error("Health check failed! App status: ${healthStatus}")
                    } else {
                        echo "Application is healthy and running!"
                    }
                }
            }
        }

        stage('7. Image Cleanup') {
            steps {
                echo 'Cleaning up old unused images...'
                sh "docker image prune -f"
            }
        }
    }

    post {
        failure {
            echo 'Deployment Failed! Rolling back...'
            sh "docker compose down"
            sh "docker compose up -d"
        }
        always {
            archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
        }
    }
}