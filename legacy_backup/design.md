# System Design: Prachar.ai

## 1. Overview

Prachar.ai is an agentic AI marketing manager for Indian SMBs that autonomously monitors Indian trends and generates localized, brand-aligned marketing assets. The system uses a serverless event-driven architecture on AWS, leveraging Amazon Bedrock for AI capabilities and OpenSearch for RAG-based brand guardrails.

The system operates in an autonomous loop: detecting trends via scheduled jobs, analyzing relevance using AI agents, retrieving brand context from vector storage, generating culturally appropriate content in Hinglish, and ensuring brand compliance through automated validation and regeneration.

## 2. Architecture Style

Serverless Event-Driven Architecture using AWS Lambda and Amazon Bedrock Agents.

**Key Architectural Principles:**
- Event-driven processing for scalability and cost efficiency
- Agentic AI workflow with autonomous decision-making
- RAG pattern for brand consistency enforcement
- Asynchronous processing with queue-based decoupling
- Real-time notifications via WebSocket/AppSync

## 3. Tech Stack (Strict Constraints)

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend Orchestration:** AWS Lambda (Node.js 20.x)
- **AI Model Interface:** AWS Bedrock Runtime SDK
- **Vector Database:** Amazon OpenSearch Serverless (for RAG)
- **Storage:** Amazon S3 (Bucket structure: `/uploads`, `/generated`, `/assets`)
- **Message Queue:** Amazon SQS (for trend event processing)
- **Scheduling:** Amazon EventBridge (for cron-based trend monitoring)
- **Real-time Updates:** AWS AppSync (GraphQL subscriptions) or API Gateway WebSocket
- **API Integration:** External News APIs for trend detection

## 4. AI Model Specifics (Winning Config)

- **Reasoning & Copy:** `anthropic.claude-3-5-sonnet-20240620-v1:0`
    - *Why:* Best performance on Indian vernacular languages and nuance
    - *Use Cases:* Trend analysis, caption generation, brand voice adherence

- **Image Generation:** `amazon.titan-image-generator-v2:0`
    - *Why:* Superior text rendering on images (essential for marketing posters)
    - *Use Cases:* Marketing poster creation, festival post visuals

- **Embeddings:** `amazon.titan-embed-text-v2:0`
    - *Why:* Optimized for semantic search in OpenSearch
    - *Use Cases:* Brand guideline retrieval, logo search, voice guideline matching

## 5. Data Flow (Agentic Loop)

1. **Trigger:** Cron Job (EventBridge) checks Trend API → Pushes event to SQS
2. **Analysis:** Lambda consumes SQS → Calls Bedrock Agent → Decides if trend is relevant
3. **Generation:** If relevant → Retrieve Brand Assets from OpenSearch → Generate Content via Bedrock
4. **Notification:** Push alert to Frontend via WebSocket/AppSync

## 6. Components and Interfaces

### 6.1 Trend Monitor Component

**Responsibilities:**
- Poll external news APIs on scheduled intervals (EventBridge cron)
- Detect high-velocity trends in Indian market
- Calculate relevance scores based on business category
- Create Campaign Opportunity notifications

**Interfaces:**
```typescript
interface TrendMonitor {
  detectTrends(): Promise<RawTrend[]>
  calculateRelevance(trend: RawTrend, businessCategory: string): number
  filterByCategory(trends: RawTrend[], category: string): RawTrend[]
  createCampaignOpportunity(trend: RawTrend, score: number): CampaignOpportunity
}

interface RawTrend {
  id: string
  name: string
  velocity: number
  keywords: string[]
  source: string
  timestamp: Date
}

interface CampaignOpportunity {
  id: string
  trendName: string
  relevanceScore: number
  suggestedAngle: string
  expiresAt: Date
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
}
```

**AWS Services:**
- EventBridge: Schedule trend polling (e.g., every 15 minutes)
- SQS: Queue detected trends for processing
- Lambda: Execute trend detection and relevance scoring

### 6.2 Content Generator Component

**Responsibilities:**
- Generate Hinglish captions using Claude 3.5 Sonnet
- Retrieve brand voice guidelines from OpenSearch
- Produce exactly 3 caption options per campaign
- Handle regeneration requests

**Interfaces:**
```typescript
interface ContentGenerator {
  generateCaptions(
    opportunity: CampaignOpportunity,
    brandGuidelines: BrandVoiceGuidelines
  ): Promise<Caption[]>
  
  regenerateCaptions(
    opportunity: CampaignOpportunity,
    rejectedCaptions: Caption[],
    brandGuidelines: BrandVoiceGuidelines
  ): Promise<Caption[]>
}

interface Caption {
  id: string
  text: string
  language: 'hinglish'
  tone: string
  generatedAt: Date
}

interface BrandVoiceGuidelines {
  tone: string[]
  prohibitedWords: string[]
  preferredPhrases: string[]
  languageMix: { hindi: number, english: number }
}
```

**AWS Services:**
- Bedrock Runtime: Invoke Claude 3.5 Sonnet model
- OpenSearch: Retrieve brand voice guidelines via semantic search
- Lambda: Orchestrate generation workflow

### 6.3 Visual Generator Component

**Responsibilities:**
- Generate marketing posters using Titan Image Generator v2
- Enforce brand color codes (hex values)
- Insert logos for festival posts
- Validate visual output against brand rules

**Interfaces:**
```typescript
interface VisualGenerator {
  generatePoster(
    caption: Caption,
    brandColors: string[],
    postType: 'standard' | 'festival'
  ): Promise<GeneratedImage>
  
  insertLogo(
    image: GeneratedImage,
    logo: Logo,
    position: LogoPosition
  ): Promise<GeneratedImage>
}

interface GeneratedImage {
  id: string
  s3Key: string
  url: string
  dimensions: { width: number, height: number }
  format: 'png' | 'jpg'
  generatedAt: Date
}

interface Logo {
  s3Key: string
  url: string
  dimensions: { width: number, height: number }
}

type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
```

**AWS Services:**
- Bedrock Runtime: Invoke Titan Image Generator v2
- S3: Store generated images and retrieve logos
- OpenSearch: Retrieve brand colors and logo metadata
- Lambda: Orchestrate image generation workflow

### 6.4 Brand Guardrail Component

**Responsibilities:**
- Retrieve brand guidelines from Knowledge Base
- Validate generated content against brand rules
- Detect violations automatically
- Trigger regeneration when violations occur

**Interfaces:**
```typescript
interface BrandGuardrail {
  retrieveGuidelines(businessId: string): Promise<BrandGuidelines>
  
  validateText(
    caption: Caption,
    guidelines: BrandVoiceGuidelines
  ): ValidationResult
  
  validateImage(
    image: GeneratedImage,
    guidelines: BrandSafetyRules
  ): ValidationResult
  
  autoRegenerate(
    violation: Violation,
    originalRequest: GenerationRequest
  ): Promise<RegenerationResult>
}

interface BrandGuidelines {
  voiceGuidelines: BrandVoiceGuidelines
  safetyRules: BrandSafetyRules
  businessId: string
}

interface BrandSafetyRules {
  allowedColors: string[]
  logoPlacement: LogoPosition[]
  prohibitedImagery: string[]
  minimumLogoSize: number
}

interface ValidationResult {
  isValid: boolean
  violations: Violation[]
}

interface Violation {
  type: 'color' | 'logo' | 'text' | 'imagery'
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface RegenerationResult {
  success: boolean
  attempts: number
  finalAsset?: Caption | GeneratedImage
  error?: string
}
```

**AWS Services:**
- OpenSearch: Vector search for brand guidelines
- Lambda: Execute validation logic and orchestrate regeneration

### 6.5 Knowledge Base Component

**Responsibilities:**
- Store and retrieve brand assets (logos, guidelines)
- Perform semantic search on brand documents
- Manage vector embeddings for RAG

**Interfaces:**
```typescript
interface KnowledgeBase {
  storeGuidelines(businessId: string, guidelines: BrandGuidelines): Promise<void>
  
  storeLogo(businessId: string, logo: Logo): Promise<void>
  
  searchGuidelines(query: string, businessId: string): Promise<BrandGuidelines>
  
  retrieveLogo(businessId: string): Promise<Logo>
  
  embedText(text: string): Promise<number[]>
}
```

**AWS Services:**
- OpenSearch Serverless: Vector storage and semantic search
- Bedrock Runtime: Generate embeddings using Titan Embed v2
- S3: Store raw logo files and documents
- Lambda: Manage indexing and retrieval operations

### 6.6 Campaign Manager Component

**Responsibilities:**
- Manage campaign opportunity lifecycle
- Handle user acceptance/rejection
- Track campaign status and expiration
- Coordinate between components

**Interfaces:**
```typescript
interface CampaignManager {
  createOpportunity(trend: RawTrend, score: number): Promise<CampaignOpportunity>
  
  acceptOpportunity(opportunityId: string): Promise<void>
  
  rejectOpportunity(opportunityId: string): Promise<void>
  
  expireOpportunities(): Promise<void>
  
  getOpportunities(businessId: string, status?: string): Promise<CampaignOpportunity[]>
}
```

**AWS Services:**
- DynamoDB: Store campaign opportunities and status
- Lambda: Execute campaign lifecycle operations
- EventBridge: Schedule expiration checks

## 7. Data Models

### 7.1 Business Profile
```typescript
interface BusinessProfile {
  id: string
  name: string
  category: BusinessCategory
  subcategories?: string[]
  location: {
    city: string
    state: string
    region: 'north' | 'south' | 'east' | 'west' | 'central'
  }
  brandGuidelines: BrandGuidelines
  createdAt: Date
  updatedAt: Date
}

type BusinessCategory = 
  | 'Retail' 
  | 'Food' 
  | 'Textile' 
  | 'Healthcare' 
  | 'Education' 
  | 'Technology' 
  | 'Services'
```

### 7.2 Campaign
```typescript
interface Campaign {
  id: string
  businessId: string
  opportunityId: string
  selectedCaption: Caption
  generatedImage: GeneratedImage
  status: 'draft' | 'approved' | 'published' | 'archived'
  createdAt: Date
  publishedAt?: Date
}
```

### 7.3 Generation Request
```typescript
interface GenerationRequest {
  id: string
  businessId: string
  opportunityId: string
  type: 'caption' | 'image'
  parameters: {
    postType?: 'standard' | 'festival'
    rejectedOptions?: string[]
  }
  createdAt: Date
}
```

### 7.4 Audit Log
```typescript
interface AuditLog {
  id: string
  businessId: string
  eventType: 'generation' | 'validation' | 'regeneration' | 'user_action'
  details: {
    component: string
    action: string
    violations?: Violation[]
    attempts?: number
  }
  timestamp: Date
}
```

## 8. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Campaign Opportunity Creation Consistency

*For any* detected high-velocity trend and business category, if the trend is relevant to that category (relevance score > threshold), then a Campaign Opportunity must be created with all required fields populated (trendName, relevanceScore, suggestedAngle, expiresAt).

**Validates: Requirements 1.1, 1.5**

### Property 2: Caption Generation Count Invariant

*For any* accepted Campaign Opportunity and brand guidelines, the Content Generator must produce exactly 3 distinct caption options, and all captions must be in Hinglish format.

**Validates: Requirements 2.1, 2.2**

### Property 3: Brand Color Adherence

*For any* generated marketing poster and set of brand hex color codes, all colors present in the generated image must match the provided hex codes within a tolerance of 5% color distance.

**Validates: Requirements 3.3**

### Property 4: Logo Insertion for Festival Posts

*For any* Festival Post generation request, the final generated image must contain the user's logo retrieved from the Knowledge Base, positioned according to brand safety rules.

**Validates: Requirements 3.4, 3.5**

### Property 5: Brand Guideline Retrieval Before Generation

*For any* content or visual generation request, the system must retrieve brand guidelines from the Knowledge Base before invoking the AI model, ensuring the guidelines are passed to the generation context.

**Validates: Requirements 4.1, 4.2**

### Property 6: Automatic Violation Regeneration

*For any* generated asset that violates brand safety rules, the system must automatically trigger regeneration without user intervention, and the regeneration must include the violation context.

**Validates: Requirements 4.4, 9.2**

### Property 7: Regeneration Attempt Limit

*For any* asset regeneration workflow, if violations persist after 3 regeneration attempts, the system must stop automatic regeneration and notify the user for manual review.

**Validates: Requirements 9.4, 9.5**

### Property 8: Business Category Filtering

*For any* detected trend and business category, if the trend's relevance score for that category is below the threshold, then no Campaign Opportunity should be created for that business.

**Validates: Requirements 1.2, 5.3**

### Property 9: Campaign Opportunity Expiration

*For any* Campaign Opportunity that remains in 'pending' status for 24 hours, the system must automatically update its status to 'expired'.

**Validates: Requirements 6.5**

### Property 10: Caption Uniqueness on Regeneration

*For any* caption regeneration request with a list of rejected captions, all newly generated captions must be semantically different from the rejected ones (similarity score < 0.8).

**Validates: Requirements 8.5**

### Property 11: Knowledge Base Embedding Round-Trip

*For any* brand guideline document stored in the Knowledge Base, embedding the text and then performing a semantic search with the original text should return that document as the top result.

**Validates: Requirements 7.3**

### Property 12: Multi-Category Trend Acceptance

*For any* business configured with multiple categories and any detected trend, if the trend is relevant to at least one of the configured categories, then a Campaign Opportunity must be created.

**Validates: Requirements 5.5**

## 9. Error Handling

### 9.1 External API Failures

**Scenario:** News API is unavailable or returns errors

**Handling:**
- Implement exponential backoff retry (3 attempts)
- Log failure to CloudWatch
- Continue with cached trends if available
- Alert operations team if failures persist > 1 hour

### 9.2 Bedrock Model Invocation Failures

**Scenario:** Claude or Titan model returns error or timeout

**Handling:**
- Retry with exponential backoff (2 attempts)
- If caption generation fails: notify user and allow manual retry
- If image generation fails: fall back to template-based image
- Log all model errors with request context

### 9.3 OpenSearch Unavailability

**Scenario:** Vector database is unreachable

**Handling:**
- Retry connection (3 attempts with backoff)
- If retrieval fails: use default brand guidelines from S3 backup
- Alert operations team immediately
- Degrade gracefully: generate content with default guidelines

### 9.4 Brand Violation Detection Failures

**Scenario:** Validation logic fails or returns inconclusive results

**Handling:**
- Default to manual review (notify user)
- Log validation failure details
- Do not auto-regenerate if validation is uncertain
- Allow user to approve or reject manually

### 9.5 S3 Storage Failures

**Scenario:** Cannot store generated assets to S3

**Handling:**
- Retry upload (3 attempts)
- If persistent failure: store temporarily in DynamoDB
- Alert operations team
- Provide user with download link from temporary storage

### 9.6 Queue Processing Failures

**Scenario:** SQS message processing fails in Lambda

**Handling:**
- Use SQS dead-letter queue for failed messages
- Retry failed messages up to 3 times
- Log failure reason and message content
- Alert if dead-letter queue depth > 10 messages

### 9.7 User Input Validation

**Scenario:** Invalid business category or malformed data

**Handling:**
- Validate all user inputs at API Gateway level
- Return clear error messages with field-specific details
- Log validation failures for monitoring
- Provide suggested corrections where possible

## 10. Testing Strategy

### 10.1 Property-Based Testing

We will use **fast-check** (for TypeScript/Node.js) as our property-based testing library. Each correctness property will be implemented as a property-based test with minimum 100 iterations.

**Configuration:**
```typescript
import fc from 'fast-check'

// Example property test configuration
fc.assert(
  fc.property(
    // Generators here
    async (trend, businessCategory) => {
      // Property assertion
    }
  ),
  { numRuns: 100 } // Minimum iterations
)
```

**Property Test Coverage:**
- Property 1: Campaign Opportunity Creation Consistency
- Property 2: Caption Generation Count Invariant
- Property 3: Brand Color Adherence
- Property 4: Logo Insertion for Festival Posts
- Property 5: Brand Guideline Retrieval Before Generation
- Property 6: Automatic Violation Regeneration
- Property 7: Regeneration Attempt Limit
- Property 8: Business Category Filtering
- Property 9: Campaign Opportunity Expiration
- Property 10: Caption Uniqueness on Regeneration
- Property 11: Knowledge Base Embedding Round-Trip
- Property 12: Multi-Category Trend Acceptance

Each test will be tagged with:
```typescript
// Feature: prachar-ai-marketing-agent, Property 1: Campaign Opportunity Creation Consistency
```

### 10.2 Unit Testing

Unit tests will focus on specific examples, edge cases, and integration points. We will use **Jest** as the testing framework.

**Unit Test Coverage:**

**Trend Monitor:**
- Test relevance score calculation with known trend-category pairs
- Test filtering logic with edge cases (empty trends, null categories)
- Test Campaign Opportunity creation with missing fields
- Test trend velocity threshold edge cases

**Content Generator:**
- Test Hinglish generation with specific cultural phrases
- Test caption count validation (exactly 3)
- Test regeneration with empty rejected list
- Test brand guideline integration with missing guidelines

**Visual Generator:**
- Test color code parsing and validation
- Test logo insertion with various positions
- Test image format handling (PNG vs JPG)
- Test festival post detection and special handling

**Brand Guardrail:**
- Test violation detection with known violations
- Test regeneration trigger logic
- Test attempt counter and limit enforcement
- Test validation with edge cases (empty rules, null guidelines)

**Knowledge Base:**
- Test embedding generation and storage
- Test semantic search with similar queries
- Test logo retrieval with missing logos
- Test guideline storage with large documents

**Campaign Manager:**
- Test opportunity lifecycle state transitions
- Test expiration logic with various timestamps
- Test concurrent acceptance/rejection handling
- Test status filtering and querying

### 10.3 Integration Testing

**End-to-End Workflows:**
- Complete campaign flow: trend detection → opportunity creation → caption generation → image generation → user approval
- Brand violation detection and auto-regeneration flow
- Festival post generation with logo insertion
- Multi-category business trend filtering

**AWS Service Integration:**
- Bedrock model invocation with real API calls (using test models)
- OpenSearch vector search with test data
- S3 upload and retrieval operations
- SQS message processing and DLQ handling
- EventBridge scheduled trigger execution

### 10.4 Testing Best Practices

**Balance:**
- Use property-based tests for universal correctness properties
- Use unit tests for specific examples and edge cases
- Avoid excessive unit tests—property tests handle input coverage
- Focus unit tests on integration points and error conditions

**Mocking Strategy:**
- Mock external APIs (News APIs) in unit tests
- Use real AWS services in integration tests (with test resources)
- Mock Bedrock in unit tests, use real Bedrock in integration tests
- Mock time-dependent functions for expiration testing

**Test Data:**
- Create realistic test fixtures for Indian trends (cricket, festivals, regional events)
- Use actual Hinglish examples in test assertions
- Generate diverse business categories and profiles
- Include edge cases: empty strings, null values, extreme numbers
