pipeline {
    agent any

    environment {
        PATH = "/Users/atharvaranjan/.docker/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
        IMAGE_NAME = "url-shortener"
        CONTAINER_NAME = "url-shortener"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                sh 'whoami'
                sh 'which docker'
                sh 'docker --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p 3000:3000 \
                        -v url-data:/data \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    for i in $(seq 1 15)
                    do
                        if curl -fsS http://localhost:3000/health
                        then
                            exit 0
                        fi
                        sleep 2
                    done

                    echo "Application health check failed"
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline completed successfully."
        }

        failure {
            echo "CI/CD pipeline failed."
        }
    }
}