export interface LearningCategory {
  id: string;
  title: string;
  description: string;
  iconName:
    | "Cloud"
    | "Cpu"
    | "Database"
    | "ShieldCheck"
    | "Sparkles"
    | "Workflow"
    | "Award"
    | "Boxes";
  url: string;
}

export interface OfficialResource {
  id: string;
  name: string;
  purpose: string;
  url: string;
  iconName:
    | "Compass"
    | "GraduationCap"
    | "BookOpen"
    | "Hammer"
    | "Layers"
    | "Award"
    | "Lightbulb";
}

export interface RoadmapStage {
  stage: number;
  title: string;
  description: string;
  keyTopics: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty:
    | "Beginner"
    | "Intermediate"
    | "Beginner to Intermediate"
    | "Intermediate to Advanced"
    | "Advanced";
  skillsLearned: string[];
  description: string;
  docUrl: string;
}

export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    id: "fundamentals",
    title: "AWS Cloud Fundamentals",
    description:
      "Understand cloud architecture models, AWS global infrastructure across regions and availability zones, and fundamental shared responsibility security principles.",
    iconName: "Cloud",
    url: "https://aws.amazon.com/getting-started/",
  },
  {
    id: "compute-serverless",
    title: "Compute and Serverless",
    description:
      "Explore elastic compute with Amazon EC2 virtual machines and build modern event-driven architectures with serverless AWS Lambda functions.",
    iconName: "Cpu",
    url: "https://aws.amazon.com/serverless/",
  },
  {
    id: "storage-databases",
    title: "Storage and Databases",
    description:
      "Master object storage with Amazon S3, block storage with EBS, and scalable managed databases including Amazon RDS and Amazon DynamoDB.",
    iconName: "Database",
    url: "https://aws.amazon.com/products/storage/",
  },
  {
    id: "networking-security",
    title: "Networking and Security",
    description:
      "Design isolated virtual networks with Amazon VPC, configure security groups and route tables, and manage access with AWS Identity and Access Management (IAM).",
    iconName: "ShieldCheck",
    url: "https://aws.amazon.com/security/",
  },
  {
    id: "ai-ml",
    title: "AI and Machine Learning",
    description:
      "Leverage generative AI models with Amazon Bedrock, build and train machine learning workflows with Amazon SageMaker, and utilize pre-trained intelligence APIs.",
    iconName: "Sparkles",
    url: "https://aws.amazon.com/ai/",
  },
  {
    id: "devops-infra",
    title: "DevOps and Cloud Infrastructure",
    description:
      "Automate deployment pipelines and manage infrastructure as code with AWS CLI, CloudFormation, AWS CDK, and container orchestration.",
    iconName: "Workflow",
    url: "https://aws.amazon.com/devops/",
  },
  {
    id: "certifications",
    title: "AWS Certifications",
    description:
      "Prepare for validated industry credentials starting with AWS Certified Cloud Practitioner, Solutions Architect, and developer specialties.",
    iconName: "Award",
    url: "https://aws.amazon.com/certification/",
  },
  {
    id: "hands-on",
    title: "Hands-on Projects",
    description:
      "Apply theoretical knowledge through practical step-by-step labs, sandbox environments, and real-world implementation exercises.",
    iconName: "Boxes",
    url: "https://workshops.aws/",
  },
];

export const OFFICIAL_RESOURCES: OfficialResource[] = [
  {
    id: "builder-center",
    name: "AWS Builder Center",
    purpose:
      "Discover AWS builder resources, developer learning opportunities, and community activities.",
    url: "https://builder.aws.com/",
    iconName: "Compass",
  },
  {
    id: "skill-builder",
    name: "AWS Skill Builder",
    purpose:
      "Access structured digital training and certification preparation.",
    url: "https://skillbuilder.aws/",
    iconName: "GraduationCap",
  },
  {
    id: "documentation",
    name: "AWS Documentation",
    purpose: "Learn directly from official AWS technical documentation.",
    url: "https://docs.aws.amazon.com/",
    iconName: "BookOpen",
  },
  {
    id: "workshops",
    name: "AWS Workshops",
    purpose: "Follow hands-on workshops and practical exercises.",
    url: "https://workshops.aws/",
    iconName: "Hammer",
  },
  {
    id: "architecture-center",
    name: "AWS Architecture Center",
    purpose: "Explore cloud architecture guidance and reference designs.",
    url: "https://aws.amazon.com/architecture/",
    iconName: "Layers",
  },
  {
    id: "training-certification",
    name: "AWS Training and Certification",
    purpose: "Discover AWS training programs and certification pathways.",
    url: "https://aws.amazon.com/training/",
    iconName: "Award",
  },
  {
    id: "getting-started",
    name: "AWS Getting Started",
    purpose: "Find introductory resources for learning AWS.",
    url: "https://aws.amazon.com/getting-started/",
    iconName: "Lightbulb",
  },
];

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    stage: 1,
    title: "Cloud Computing Fundamentals",
    description:
      "Understand cloud computing, regions, availability zones, and shared responsibility.",
    keyTopics: [
      "Cloud Deployment & Service Models",
      "AWS Global Infrastructure (Regions, AZs)",
      "Shared Responsibility Model",
      "AWS Billing & Free Tier Cost Controls",
    ],
  },
  {
    stage: 2,
    title: "AWS Core Services",
    description:
      "Explore foundational services such as Amazon EC2, Amazon S3, AWS IAM, and Amazon VPC.",
    keyTopics: [
      "Amazon EC2 Instance Lifecycle & SSH",
      "Amazon S3 Buckets, Policies & Encryption",
      "AWS IAM Users, Roles & Least Privilege",
      "Amazon VPC Subnets, Gateways & Security Groups",
    ],
  },
  {
    stage: 3,
    title: "Practical Cloud Projects",
    description:
      "Build small projects to practice deploying applications, storing data, configuring access, and monitoring resources.",
    keyTopics: [
      "Deploying Static Web Apps on S3 + CloudFront",
      "Configuring Amazon RDS Database Backends",
      "Setting Amazon CloudWatch Alarms & Metrics",
      "Troubleshooting Access Denied & Network Routing",
    ],
  },
  {
    stage: 4,
    title: "Automation and DevOps",
    description:
      "Explore the AWS CLI, infrastructure as code, containers, and CI/CD fundamentals.",
    keyTopics: [
      "AWS CLI Scripting & Automation",
      "Infrastructure as Code with Terraform & AWS CDK",
      "Docker Containers on Amazon ECR & ECS/Fargate",
      "CI/CD Pipelines with GitHub Actions / AWS CodePipeline",
    ],
  },
  {
    stage: 5,
    title: "Certification Preparation",
    description:
      "Explore the AWS Certified Cloud Practitioner certification and other relevant certification pathways.",
    keyTopics: [
      "AWS Certified Cloud Practitioner (CLF-C02) Blueprint",
      "AWS Certified Solutions Architect – Associate (SAA-C03)",
      "Official Practice Exams on AWS Skill Builder",
      "Architectural Well-Architected Framework Reviews",
    ],
  },
  {
    stage: 6,
    title: "Advanced Learning",
    description:
      "Explore serverless applications, cloud architecture, data engineering, and machine learning.",
    keyTopics: [
      "Serverless Architectures with Lambda & API Gateway",
      "Event-Driven Messaging with SQS, SNS & EventBridge",
      "Generative AI & LLMs with Amazon Bedrock",
      "Enterprise Multi-Account Architectures with AWS Organizations",
    ],
  },
];

export const PROJECT_IDEAS: ProjectIdea[] = [
  {
    id: "proj-1",
    title: "Static website hosting using Amazon S3 and CloudFront",
    difficulty: "Beginner",
    skillsLearned: [
      "Amazon S3",
      "Amazon CloudFront",
      "Custom DNS",
      "HTTPS / SSL",
    ],
    description:
      "Host and distribute a fast, secure static website globally using Amazon S3 storage and Amazon CloudFront CDN with SSL termination.",
    docUrl:
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html",
  },
  {
    id: "proj-2",
    title: "Serverless URL shortener using AWS Lambda and API Gateway",
    difficulty: "Intermediate",
    skillsLearned: [
      "AWS Lambda",
      "Amazon API Gateway",
      "Amazon DynamoDB",
      "RESTful APIs",
    ],
    description:
      "Create an on-demand, highly scalable link redirect and analytics microservice using Amazon API Gateway, AWS Lambda, and Amazon DynamoDB.",
    docUrl:
      "https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/",
  },
  {
    id: "proj-3",
    title: "Cloud monitoring dashboard using Amazon CloudWatch",
    difficulty: "Beginner to Intermediate",
    skillsLearned: [
      "Amazon CloudWatch",
      "SNS Notifications",
      "Metric Alarms",
      "Budget Alerts",
    ],
    description:
      "Monitor EC2 instance metrics, track Lambda invocation errors, and configure proactive email alarms to keep resource costs safely inside Free Tier.",
    docUrl:
      "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
  },
  {
    id: "proj-4",
    title: "Event-driven file processing using Amazon S3 and AWS Lambda",
    difficulty: "Intermediate",
    skillsLearned: [
      "S3 Event Notifications",
      "Lambda Triggers",
      "IAM Roles",
      "Asynchronous Processing",
    ],
    description:
      "Automatically trigger serverless compute to resize images or parse JSON data records immediately whenever a file is uploaded to an Amazon S3 bucket.",
    docUrl: "https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html",
  },
  {
    id: "proj-5",
    title: "Containerized application deployment",
    difficulty: "Intermediate to Advanced",
    skillsLearned: [
      "Docker",
      "Amazon ECR",
      "AWS Fargate",
      "Application Load Balancer",
    ],
    description:
      "Package a web microservice with Docker, push the container image to Amazon ECR, and execute scalable containers on AWS Fargate without managing servers.",
    docUrl:
      "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html",
  },
  {
    id: "proj-6",
    title: "Cloud infrastructure automation using Terraform",
    difficulty: "Advanced",
    skillsLearned: [
      "Terraform",
      "Infrastructure as Code",
      "Amazon VPC",
      "State Management",
    ],
    description:
      "Define, version-control, and provision repeatable multi-AZ cloud network infrastructure on AWS using declarative Terraform configurations.",
    docUrl:
      "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
  },
];
