# Requirements Document: Prachar.ai - The AI Creative Director

## Project Overview

**Prachar.ai** is an autonomous AI Creative Director designed for Indian students, creators, and college clubs competing in the AWS "AI for Bharat" Hackathon (Student Track: Media, Content & Creativity). The system uses agentic AI to autonomously plan, draft, and design culturally relevant social media campaigns in Hinglish, leveraging AWS Bedrock for reasoning and generation, with RAG-based brand consistency.

## Glossary

- **Creative_Director_Agent**: The autonomous Strands-based supervisor agent that plans and executes campaign workflows
- **Strands_SDK**: Python orchestration framework for building multi-step agentic workflows
- **Bedrock_Claude**: Amazon Bedrock's Claude 3.5 Sonnet model for reasoning and Hinglish copywriting
- **Bedrock_Titan**: Amazon Bedrock's Titan Image Generator v1 for poster creation
- **Brand_Knowledge_Base**: Bedrock Knowledge Base storing user-uploaded brand style PDFs for RAG retrieval
- **Hinglish**: Hindi-English linguistic mix commonly used in Indian social media
- **Campaign_Goal**: User's high-level objective (e.g., "Hype my college fest", "Promote my startup")
- **Agentic_Workflow**: Autonomous multi-step process: Reason → Plan → Act → Validate
- **Bedrock_Guardrails**: AWS service for filtering hate speech, PII, and harmful content
- **Campaign_Plan**: Agent-generated structured plan with hooks, offers, and CTAs
- **Brand_Style_Guidelines**: User-uploaded PDF defining tone, voice, and visual preferences

## Requirements

### Requirement 1: Autonomous Campaign Planning

**User Story:** As a student club organizer, I want to provide a high-level goal and have the AI autonomously create a complete campaign plan, so I don't need to manually specify every detail.

#### Acceptance Criteria

1. WHEN the user submits a Campaign_Goal, THE Creative_Director_Agent SHALL analyze the goal and generate a structured Campaign_Plan
2. WHEN planning, THE Creative_Director_Agent SHALL use Bedrock_Claude to reason about the target audience and cultural context
3. WHEN the plan is created, THE Creative_Director_Agent SHALL include at least 3 components: hook, offer, and call-to-action
4. WHEN planning completes, THE Creative_Director_Agent SHALL autonomously proceed to content generation without user intervention
5. WHEN the agent encounters ambiguity, THE Creative_Director_Agent SHALL make reasonable assumptions based on Indian student context

### Requirement 2: Brand-Aware Content Generation

**User Story:** As a creator with a specific brand voice, I want the AI to read my brand guidelines before generating content, so all outputs match my established style.

#### Acceptance Criteria

1. WHEN generating any content, THE Creative_Director_Agent SHALL first retrieve Brand_Style_Guidelines from the Brand_Knowledge_Base
2. WHEN brand guidelines exist, THE Creative_Director_Agent SHALL incorporate tone, voice, and style preferences into generation prompts
3. WHEN no brand guidelines are found, THE Creative_Director_Agent SHALL use default Indian youth-friendly tone
4. WHEN retrieving guidelines, THE system SHALL use Bedrock Knowledge Base RAG with semantic search
5. WHEN brand context is retrieved, THE Creative_Director_Agent SHALL log the retrieved chunks for transparency

### Requirement 3: Hinglish Copywriting

**User Story:** As an Indian student marketer, I want campaign copy in Hinglish that resonates with my peers, so my content feels authentic and culturally relevant.

#### Acceptance Criteria

1. WHEN generating text content, THE Creative_Director_Agent SHALL use Bedrock_Claude to produce Hinglish copy
2. WHEN writing copy, THE system SHALL mix Hindi and English words naturally (40-60% Hindi, 60-40% English)
3. WHEN generating copy, THE system SHALL include culturally appropriate emojis and slang
4. WHEN the Campaign_Goal mentions festivals or events, THE system SHALL incorporate relevant cultural references
5. WHEN copy is generated, THE system SHALL produce exactly 3 caption variations for user selection

### Requirement 4: Autonomous Visual Generation

**User Story:** As a busy student, I want the AI to automatically create campaign posters that match my brand colors, so I don't need design skills.

#### Acceptance Criteria

1. WHEN the Campaign_Plan includes visual requirements, THE Creative_Director_Agent SHALL autonomously call the image generation tool
2. WHEN generating images, THE system SHALL use Bedrock_Titan Image Generator v1
3. WHEN brand colors are specified in Brand_Style_Guidelines, THE system SHALL enforce those colors in the image prompt
4. WHEN generating posters, THE system SHALL include the campaign hook text as overlay
5. WHEN image generation completes, THE system SHALL return a publicly accessible S3 URL

### Requirement 5: Responsible AI with Guardrails

**User Story:** As a platform administrator, I want all generated content to be filtered for hate speech and PII, so we maintain a safe and compliant platform.

#### Acceptance Criteria

1. WHEN generating any text content, THE system SHALL apply Bedrock_Guardrails before returning output
2. WHEN guardrails detect policy violations, THE system SHALL block the output and regenerate with safer prompts
3. WHEN PII is detected, THE system SHALL redact or reject the content
4. WHEN hate speech is detected, THE system SHALL log the incident and notify administrators
5. WHEN guardrails are applied, THE system SHALL record the guardrail decision in DynamoDB audit logs

### Requirement 6: Serverless Execution

**User Story:** As a hackathon participant with limited budget, I want the system to run serverlessly, so I only pay for actual usage.

#### Acceptance Criteria

1. WHEN a user triggers campaign generation, THE system SHALL execute the Creative_Director_Agent on AWS Lambda
2. WHEN Lambda executes, THE function SHALL complete within 5 minutes (Lambda timeout limit)
3. WHEN the agent runs, THE system SHALL use Python 3.11 runtime with Strands SDK
4. WHEN execution completes, THE system SHALL store results in DynamoDB
5. WHEN errors occur, THE system SHALL log to CloudWatch and return user-friendly error messages

### Requirement 7: Campaign History and Retrieval

**User Story:** As a creator, I want to view my past campaigns and reuse successful strategies, so I can iterate and improve over time.

#### Acceptance Criteria

1. WHEN a campaign is generated, THE system SHALL store the Campaign_Plan, copy, and image URL in DynamoDB
2. WHEN storing campaigns, THE system SHALL include metadata: timestamp, user_id, goal, and status
3. WHEN the user requests history, THE system SHALL retrieve campaigns sorted by creation date
4. WHEN displaying history, THE system SHALL show campaign thumbnails and key metrics
5. WHEN a user selects a past campaign, THE system SHALL allow them to regenerate variations

### Requirement 8: Secure User Authentication

**User Story:** As a user, I want secure login so my campaigns and brand guidelines remain private.

#### Acceptance Criteria

1. WHEN a user accesses the platform, THE system SHALL require authentication via Amazon Cognito
2. WHEN authenticating, THE system SHALL support email/password and social login (Google)
3. WHEN a user logs in, THE system SHALL issue JWT tokens for API access
4. WHEN accessing resources, THE system SHALL validate user_id matches the resource owner
5. WHEN sessions expire, THE system SHALL prompt re-authentication

### Requirement 9: Real-Time Progress Updates

**User Story:** As a user waiting for campaign generation, I want to see real-time progress updates, so I know the agent is working.

#### Acceptance Criteria

1. WHEN the Creative_Director_Agent starts execution, THE system SHALL emit progress events
2. WHEN each tool executes, THE system SHALL update the frontend with the current step (e.g., "Planning...", "Generating copy...", "Creating poster...")
3. WHEN using WebSocket or polling, THE system SHALL deliver updates within 2 seconds
4. WHEN generation completes, THE system SHALL display the final campaign immediately
5. WHEN errors occur, THE system SHALL show user-friendly error messages with retry options

### Requirement 10: Multi-Language Support (Future)

**User Story:** As a creator targeting regional audiences, I want to generate campaigns in regional languages beyond Hinglish, so I can reach diverse audiences.

#### Acceptance Criteria

1. WHEN the user selects a target language, THE Creative_Director_Agent SHALL generate copy in that language
2. WHEN supported languages include: Hinglish, Tamil, Telugu, Bengali, Marathi
3. WHEN generating regional content, THE system SHALL use culturally appropriate references
4. WHEN brand guidelines specify language preferences, THE system SHALL honor them
5. WHEN language is not specified, THE system SHALL default to Hinglish

## Non-Functional Requirements

### Performance
- Campaign generation SHALL complete within 60 seconds for 90% of requests
- Lambda cold start SHALL not exceed 10 seconds
- DynamoDB queries SHALL return results within 500ms

### Scalability
- System SHALL support 100 concurrent users during hackathon demo
- S3 SHALL store up to 10,000 generated images
- DynamoDB SHALL handle 1,000 writes per second

### Security
- All API endpoints SHALL require valid JWT tokens
- S3 objects SHALL use pre-signed URLs with 1-hour expiration
- Bedrock API calls SHALL use IAM roles with least privilege

### Usability
- Frontend SHALL be mobile-responsive
- Campaign generation SHALL require maximum 3 user inputs
- Error messages SHALL be in plain English with actionable guidance

### Compliance
- System SHALL comply with AWS Acceptable Use Policy
- Generated content SHALL be filtered for GDPR-sensitive PII
- Audit logs SHALL be retained for 90 days
