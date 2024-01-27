pipeline {
  agent any
  tools {
  maven 'Maven'
  }
    
	stages {

      stage ('Checkout SCM'){
        steps {
          checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git', url: 'https://github.com/rkrishn4/devops_bootcacamp.git']]])
        }
      }
	  
	  stage ('Build')  {
	      steps {
            dir('webapp'){
            sh "pwd"
            sh "ls -lah"
            sh "mvn package"
          }
        }   
      }
   
     stage ('SonarQube Analysis') {
        steps {
              withSonarQubeEnv('sonar') {
				dir('webapp'){
                 sh 'mvn -U clean install sonar:sonar'
                }		
              }
            }
      }

    stage ('Artifactory configuration') {
            steps {
                rtServer (
                    id: "jfrog",
                    url: "http://18.191.122.78:8082/artifactory",
                    credentialsId: "jfrog"
                )

                rtMavenDeployer (
                    id: "MAVEN_DEPLOYER",
                    serverId: "jfrog",
                    releaseRepo: "devops_bootcampnew-libs-release-local",
                    snapshotRepo: "devops_bootcampnew-libs-release-local"
                )

                rtMavenResolver (
                    id: "MAVEN_RESOLVER",
                    serverId: "jfrog", // credential ID from Jenkins global credentials
                    releaseRepo: "devops_bootcampnew-libs-release-local",
                    snapshotRepo: "devops_bootcampnew-libs-release-local"
                )
            }
    }

    stage ('Deploy Artifacts') {
            steps {
                rtMavenRun (
                    tool: "Maven", // Tool name from Jenkins configuration
                    pom: 'webapp/pom.xml',
                    goals: 'clean install',
                    deployerId: "MAVEN_DEPLOYER",
                    resolverId: "MAVEN_RESOLVER"
                )
         }
    }

    stage ('Publish build info') {
            steps {
                rtPublishBuildInfo (
                    serverId: "jfrog"
             )
        }
    }

    stage('Copy Dockerfile & Playbook to Staging Server') {
            
            steps {
                  sshagent(['ssh_agent']) {
                       sh "chmod 400  new_aws_dec_keypair.pem"
                       sh "ls -lah"
                      //sh "scp -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no dockerfile ubuntu@18.191.28.4:/home/ubuntu"
                        sh "scp -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no dockerfile ubuntu@18.191.28.4:/home/ubuntu"
                        sh "scp -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no deploy2-dockerhub.yaml ubuntu@18.191.28.4:/home/ubuntu"
                    }
                }
        } 

    stage('Build Container Image') {
            
            steps {
                  sshagent(['ssh_key']) {
                        sh "ssh -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no ubuntu@50.112.54.226 -C \"ansible-playbook  -vvv -e build_number=${BUILD_NUMBER} deploy2-dockerhub.yaml\""       
                    }
                }
        } 

    stage('Copy Deployment & Service Defination to K8s Master') {
            
            steps {
                  sshagent(['ssh_key']) {
                        sh "scp -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no k8s-deployment.yaml ubuntu@3.15.233.142:/home/ubuntu"
                        }
                }
        } 

    stage('Waiting for Approvals') {
            
        steps{
		input('Test Completed ? Please provide  Approvals for Prod Release ?')
			 }
    }     
    stage('Deploy Artifacts to Production') {
            
            steps {
                  sshagent(['ssh_key']) {
                        //sh "ssh -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no ubuntu@3.15.233.142 -C \"kubectl set image deployment/deploy2-dockerhub.yaml=mobanntechnologies/july-set:${BUILD_NUMBER}\""
                        //sh "ssh -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no ubuntu@3.15.233.142 -C \"kubectl delete deployment ranty && kubectl delete service ranty\""
                        sh "ssh -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no ubuntu@3.15.233.142-C \"kubectl apply -f k8s-deployment.yaml\""
                        //sh "ssh -i new_aws_dec_keypair.pem -o StrictHostKeyChecking=no ubuntu@3.15.233.142 -C \"kubectl apply -f service.yaml\""
                    }
                }  
        } 
   } 
}



