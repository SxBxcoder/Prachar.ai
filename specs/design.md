# System Design: Prachar.ai - The AI Creative Director

## 1. Overview

Prachar.ai is an autonomous AI Creative Director for Indian students and creators, built using serverless AWS architecture and agentic AI workflows. The system uses the Strands SDK to orchestrate a multi-step reasoning agent that autonomously plans campaigns, retrieves brand context via RAG, generates Hinglish copy using Claude 3.5 Sonnet, and creates posters using Titan Image Generator—all while enforcing responsible AI guardrails.

The core innovation is the **agentic workflow**: users provide a high-level goal, and the Creative Director Agent autonomously decomposes it into tasks, retrieves brand context, executes generation tools, and validates outputs—without requiring step-by-step user guidance.

## 2. Architecture Style

**Serverless Event-Driven Agentic Architecture** using AWS Lambda, Bedrock, and Strands SDK.

**Key Architectural Principles:**
- **Agentic Autonomy**: Agent reasons about goals and autonomously plans execution steps
- **RAG-First Generation**: All content generation is grounded in retrieved brand guidelines
- **Serverless Execution**: Zero infrastructure management, pay-per-use pricing
- **Responsible AI**: Guardrails applied at every generation step
- **Stateless Functions**: Lambda functions are stateless; state stored in DynamoDB

## 3. Tech Stack (Strict Constraints)

### Backend
- **Orchestration**: Strands SDK (Python) for agentic workflow management
- **Compute**: AWS Lambda (Python 3.11 runtime)
- **AI Reasoning**: Amazon Bedrock - `anthropic.claude-3-5-sonnet-20240620-v1:0`
- **AI Vision**: Amazon Bedrock - `amazon.titan-image-generator-v1`
- **RAG**: Amazon Bedrock Knowledge Bases (OpenSearch Serverless backend)
- **Guardrails**: Amazon Bedrock Guardrails (hate speech, PII filtering)
- **Database**: Amazon DynamoDB (campaign storage)
- **Storage**: Amazon S3 (generated images, brand PDFs)
- **Auth**: Amazon Cognito (user authentication)

### Frontend
- **Framework**: Next.js 14 (React) with App Router
- **Styling**: Tailwind CSS
- **Hosting**: AWS Amplify
- **API**: REST API via API Gateway + Lambda

### Infrastructure
- **IaC**: AWS CDK (Python) or CloudFormation
- **Monitoring**: CloudWatch Logs and Metrics
- **CI/CD**: AWS Amplify (frontend), Lambda deployment via CDK

## 4. AI Model Specifics

### Claude 3.5 Sonnet (Text Generation)
- **Model ID**: `anthropic.claude-3-5-sonnet-20240620-v1:0`
- **Use Cases**: 
  - Campaign planning and reasoning
  - Hinglish copywriting
  - Brand guideline interpretation
- **Why**: Best-in-class reasoning, excellent with Indian languages and cultural nuance
- **Configuration**:
  - Max tokens: 1024
  - Temperature: 0.7 (creative but controlled)
  - Top-p: 0.9

### Titan Image Generator v1 (Visual Generation)
- **Model ID**: `amazon.titan-image-generator-v1`
- **Use Cases**:
  - Campaign poster creation
  - Brand-aligned visual assets
- **Why**: Native AWS integration, good text rendering on images
- **Configuration**:
  - Image size: 1024x1024
  - Quality: premium
  - Negative prompts: "blurry, low quality, distorted text"

### Titan Embeddings (RAG)
- **Model ID**: `amazon.titan-embed-text-v1`
- **Use Cases**:
  - Embedding brand guideline PDFs
  - Semantic search for relevant brand context
- **Why**: Optimized for Bedrock Knowledge Bases

## 5. Agentic Workflow Architecture

### 5.1 Strands Agent Structure

```
Creative_Director_Agent (Supervisor)
├── Reasoning Loop (Claude 3.5 Sonnet)
│   ├── Analyze user goal
│   ├── Retrieve brand context (RAG)
│   └── Generate campaign plan
├── Tool: generate_copy
│   ├── Input: campaign_plan, brand_context
│   ├── Model: Claude 3.5 Sonnet
│   ├── Guardrails: Applied
│   └── Output: 3 Hinglish captions
├── Tool: generate_image
│   ├── Input: selected_caption, brand_colors
│   ├── Model: Titan Image Generator v1
│   └── Output: S3 URL
└── Validation Loop
    ├── Check guardrail compliance
    ├── Verify brand alignment
    └── Return final campaign
```

### 5.2 Execution Flow

1. **User Input**: User submits `campaign_goal` (e.g., "Hype my college fest")
2. **Agent Initialization**: Lambda invokes `CreativeDirector` agent with Strands SDK
3. **Reasoning Phase**:
   - Agent uses Claude to analyze goal
   - Agent queries Bedrock Knowledge Base for brand guidelines
   - Agent generates structured `Campaign_Plan` (hook, offer, CTA)
4. **Execution Phase**:
   - Agent calls `generate_copy` tool with plan + brand context
   - Claude generates 3 Hinglish caption variations
   - Guardrails filter outputs
5. **Visual Phase**:
   - Agent calls `generate_image` tool with selected caption
   - Titan generates poster with brand colors
   - Image uploaded to S3, URL returned
6. **Storage Phase**:
   - Agent stores campaign in DynamoDB
   - Returns final result to user

## 6. Component Design

### 6.1 Creative Director Agent (Strands SDK)

**File**: `backend/agent.py`

**Responsibilities**:
- Orchestrate multi-step campaign generation workflow
- Reason about user goals and plan execution
- Call tools autonomously based on plan
- Validate outputs against brand guidelines

**Strands Configuration**:
```python
from strands import Agent, Tool

agent = Agent(
    name="CreativeDirector",
    model="anthropic.claude-3-5-sonnet-20240620-v1:0",
    instructions="""You are Prachar.ai, an expert Indian marketing creative director.
    Your job is to autonomously plan and execute social media campaigns for Indian students.
    Always retrieve brand guidelines before generating content.
    Generate copy in Hinglish (Hindi-English mix) with cultural relevance.""",
    tools=[generate_copy_tool, generate_image_tool],
    knowledge_base_id="<BEDROCK_KB_ID>"
)
```

**Key Methods**:
- `plan_campaign(goal: str) -> CampaignPlan`
- `execute_plan(plan: CampaignPlan) -> Campaign`
- `validate_output(campaign: Campaign) -> bool`

### 6.2 RAG Integration (Bedrock Knowledge Base)

**Responsibilities**:
- Store user-uploaded brand guideline PDFs
- Embed documents using Titan Embeddings
- Perform semantic search during generation
- Return top-k relevant chunks to agent

**Architecture**:
```
User uploads PDF → S3 Bucket → Bedrock KB ingestion
                                    ↓
                            OpenSearch Serverless (vectors)
                                    ↓
Agent query → Bedrock KB API → Semantic search → Top 3 chunks
```

**API Integration**:
```python
import boto3

bedrock_agent = boto3.client('bedrock-agent-runtime')

def retrieve_brand_context(query: str, kb_id: str) -> list[str]:
    response = bedrock_agent.retrieve(
        knowledgeBaseId=kb_id,
        retrievalQuery={'text': query},
        retrievalConfiguration={
            'vectorSearchConfiguration': {
                'numberOfResults': 3
            }
        }
    )
    return [r['content']['text'] for r in response['retrievalResults']]
```

### 6.3 Content Generation Tool

**Tool Name**: `generate_copy`

**Inputs**:
- `campaign_plan`: Structured plan with hook, offer, CTA
- `brand_context`: Retrieved brand guidelines (RAG)
- `language`: Target language (default: "hinglish")

**Process**:
1. Construct prompt with plan + brand context
2. Call Bedrock Claude with guardrails enabled
3. Parse response to extract 3 caption variations
4. Return captions as structured JSON

**Implementation**:
```python
def generate_copy(campaign_plan: dict, brand_context: str) -> list[str]:
    prompt = f"""You are Prachar.ai. Generate 3 Hinglish social media captions.
    
    Campaign Plan:
    - Hook: {campaign_plan['hook']}
    - Offer: {campaign_plan['offer']}
    - CTA: {campaign_plan['cta']}
    
    Brand Guidelines:
    {brand_context}
    
    Requirements:
    - Mix Hindi and English naturally
    - Use emojis suitable for Indian youth
    - Keep each caption under 280 characters
    - Make it energetic and culturally relevant
    
    Output format: Return exactly 3 captions, numbered 1-3."""
    
    response = bedrock_runtime.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "temperature": 0.7,
            "messages": [{"role": "user", "content": prompt}]
        }),
        guardrailIdentifier="<GUARDRAIL_ID>",
        guardrailVersion="DRAFT"
    )
    
    result = json.loads(response['body'].read())
    return parse_captions(result['content'][0]['text'])
```

### 6.4 Visual Generation Tool

**Tool Name**: `generate_image`

**Inputs**:
- `caption`: Selected caption text
- `brand_colors`: Hex color codes from brand guidelines
- `style`: Visual style (default: "modern poster")

**Process**:
1. Construct image prompt with caption + brand colors
2. Call Bedrock Titan Image Generator
3. Decode base64 image response
4. Upload to S3 with public-read ACL
5. Return S3 URL

**Implementation**:
```python
def generate_image(caption: str, brand_colors: list[str]) -> str:
    prompt = f"""Create a vibrant social media poster for Indian audience.
    
    Text to include: "{caption}"
    Brand colors: {', '.join(brand_colors)}
    Style: Modern, energetic, youth-focused
    
    Requirements:
    - Use specified brand colors prominently
    - Make text readable and bold
    - Include subtle Indian cultural elements
    - High quality, professional design"""
    
    response = bedrock_runtime.invoke_model(
        modelId="amazon.titan-image-generator-v1",
        body=json.dumps({
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": prompt,
                "negativeText": "blurry, low quality, distorted text"
            },
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "quality": "premium",
                "height": 1024,
                "width": 1024,
                "cfgScale": 8.0
            }
        })
    )
    
    result = json.loads(response['body'].read())
    image_data = base64.b64decode(result['images'][0])
    
    # Upload to S3
    s3_key = f"campaigns/{uuid.uuid4()}.png"
    s3.put_object(Bucket=BUCKET_NAME, Key=s3_key, Body=image_data)
    
    return f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
```

### 6.5 Guardrails Integration

**Configuration**:
```python
# Guardrail policies
guardrail_config = {
    "name": "PracharAIGuardrail",
    "contentPolicyConfig": {
        "filtersConfig": [
            {"type": "HATE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            {"type": "VIOLENCE", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM"},
            {"type": "SEXUAL", "inputStrength": "HIGH", "outputStrength": "HIGH"}
        ]
    },
    "sensitiveInformationPolicyConfig": {
        "piiEntitiesConfig": [
            {"type": "EMAIL", "action": "BLOCK"},
            {"type": "PHONE", "action": "BLOCK"},
            {"type": "NAME", "action": "ANONYMIZE"}
        ]
    }
}
```

**Application**:
- Applied to all Claude invocations via `guardrailIdentifier` parameter
- Violations logged to CloudWatch
- Blocked outputs trigger automatic regeneration with safer prompts

## 7. Data Models

### 7.1 Campaign (DynamoDB)

```python
{
    "campaign_id": "uuid",
    "user_id": "cognito_user_id",
    "goal": "Hype my college fest",
    "plan": {
        "hook": "Festival season is here!",
        "offer": "Early bird tickets at 50% off",
        "cta": "Register now at link.com"
    },
    "captions": [
        "Caption 1 in Hinglish...",
        "Caption 2 in Hinglish...",
        "Caption 3 in Hinglish..."
    ],
    "selected_caption": "Caption 1 in Hinglish...",
    "image_url": "https://s3.amazonaws.com/...",
    "brand_context": "Retrieved brand guidelines...",
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "guardrail_logs": [
        {"step": "copy_generation", "action": "ALLOWED", "confidence": 0.95}
    ]
}
```

### 7.2 Brand Profile (DynamoDB)

```python
{
    "user_id": "cognito_user_id",
    "brand_name": "TechFest IIT Delhi",
    "brand_colors": ["#FF5733", "#3498DB"],
    "tone": "energetic, youthful, tech-savvy",
    "guidelines_s3_key": "brands/user123/guidelines.pdf",
    "kb_ingestion_status": "completed",
    "created_at": "2024-01-10T08:00:00Z"
}
```

### 7.3 Audit Log (DynamoDB)

```python
{
    "log_id": "uuid",
    "user_id": "cognito_user_id",
    "campaign_id": "uuid",
    "event_type": "guardrail_violation",
    "details": {
        "violation_type": "PII_DETECTED",
        "blocked_content": "[REDACTED]",
        "action_taken": "regenerate"
    },
    "timestamp": "2024-01-15T10:32:15Z"
}
```

## 8. API Design

### 8.1 Generate Campaign

**Endpoint**: `POST /api/campaigns/generate`

**Request**:
```json
{
    "goal": "Hype my college fest",
    "user_id": "cognito_user_id"
}
```

**Response**:
```json
{
    "campaign_id": "uuid",
    "plan": {
        "hook": "Festival season is here!",
        "offer": "Early bird tickets at 50% off",
        "cta": "Register now"
    },
    "captions": ["Caption 1...", "Caption 2...", "Caption 3..."],
    "image_url": "https://s3.amazonaws.com/...",
    "status": "completed"
}
```

### 8.2 Upload Brand Guidelines

**Endpoint**: `POST /api/brands/upload`

**Request**: Multipart form data with PDF file

**Response**:
```json
{
    "brand_id": "uuid",
    "kb_ingestion_status": "processing",
    "estimated_completion": "2024-01-15T10:35:00Z"
}
```

### 8.3 Get Campaign History

**Endpoint**: `GET /api/campaigns?user_id={user_id}`

**Response**:
```json
{
    "campaigns": [
        {
            "campaign_id": "uuid",
            "goal": "Hype my college fest",
            "image_url": "https://s3.amazonaws.com/...",
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

## 9. Deployment Architecture

```
User (Browser)
    ↓
AWS Amplify (Next.js Frontend)
    ↓
API Gateway (REST API)
    ↓
Lambda (agent.py with Strands SDK)
    ↓
├── Amazon Bedrock (Claude + Titan)
├── Bedrock Knowledge Base (RAG)
├── Bedrock Guardrails
├── DynamoDB (campaigns, brands, logs)
└── S3 (images, PDFs)
```

### Lambda Configuration
- **Runtime**: Python 3.11
- **Memory**: 1024 MB
- **Timeout**: 5 minutes
- **Environment Variables**:
  - `BEDROCK_KB_ID`: Knowledge Base ID
  - `GUARDRAIL_ID`: Guardrail ID
  - `S3_BUCKET`: Image storage bucket
  - `DYNAMODB_TABLE`: Campaign table name

### IAM Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:Retrieve",
                "bedrock:ApplyGuardrail"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::prachar-ai-assets/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/prachar-campaigns"
        }
    ]
}
```

## 10. Error Handling

### 10.1 Bedrock Model Errors
- **Scenario**: Claude or Titan returns error
- **Handling**: Retry with exponential backoff (3 attempts), fallback to cached templates

### 10.2 Guardrail Violations
- **Scenario**: Content blocked by guardrails
- **Handling**: Regenerate with safer prompts, log violation, notify user if persistent

### 10.3 RAG Retrieval Failures
- **Scenario**: Knowledge Base unavailable
- **Handling**: Use default brand guidelines, degrade gracefully

### 10.4 Lambda Timeout
- **Scenario**: Agent execution exceeds 5 minutes
- **Handling**: Return partial results, allow user to retry

## 11. Testing Strategy

### 11.1 Unit Tests
- Test individual tools (`generate_copy`, `generate_image`)
- Mock Bedrock API responses
- Validate guardrail integration

### 11.2 Integration Tests
- Test end-to-end campaign generation with real Bedrock calls
- Validate RAG retrieval accuracy
- Test Lambda deployment

### 11.3 Property-Based Tests
- **Property 1**: All generated captions must be in Hinglish format
- **Property 2**: All images must include brand colors
- **Property 3**: Guardrails must block PII in 100% of test cases

## 12. Success Metrics

### Hackathon Judging Criteria
- **Creativity**: Autonomous agentic workflow, Hinglish generation
- **Technical Excellence**: Strands SDK orchestration, RAG integration, guardrails
- **Usability**: One-click campaign generation, mobile-responsive UI
- **AWS Service Usage**: Bedrock (Claude + Titan), Knowledge Bases, Guardrails, Lambda, DynamoDB

### Performance Targets
- Campaign generation: < 60 seconds
- Guardrail compliance: 100%
- User satisfaction: > 4.5/5 stars
