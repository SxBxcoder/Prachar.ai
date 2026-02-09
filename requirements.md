# Requirements Document

## Introduction

Prachar.ai is an agentic AI marketing manager designed specifically for Indian Small and Medium Businesses (SMBs). The system autonomously monitors trending topics relevant to the Indian market, generates culturally appropriate marketing content in Hinglish (Hindi-English mix), and creates brand-aligned visual assets. By leveraging AWS Bedrock's generative AI capabilities and Retrieval-Augmented Generation (RAG) with brand guidelines, Prachar.ai ensures all marketing materials maintain brand consistency while capitalizing on timely cultural moments and trends.

## Glossary

- **Prachar_System**: The complete Prachar.ai agentic marketing platform
- **Trend_Monitor**: The component responsible for detecting and analyzing Indian market trends
- **Content_Generator**: The component that creates text captions using AWS Bedrock Claude
- **Visual_Generator**: The component that creates marketing images using AWS Bedrock Titan
- **Brand_Guardrail**: The RAG-based system that enforces brand consistency
- **Knowledge_Base**: The OpenSearch Vector Store containing brand guidelines, logos, and voice guidelines
- **Campaign_Opportunity**: A detected trend that matches the user's business category
- **Hinglish**: A linguistic blend of Hindi and English commonly used in Indian marketing
- **Brand_Voice_Guidelines**: Stored rules defining tone, language style, and brand personality
- **Brand_Safety_Rules**: Constraints on logo placement, color usage, and content restrictions
- **High_Velocity_Trend**: A rapidly growing topic in Indian news/social media (e.g., cricket events, festivals)
- **Business_Category**: The user's industry classification (e.g., Retail, Food, Textile, Healthcare)

## Requirements

### Requirement 1: Trend Detection and Monitoring

**User Story:** As an Indian SMB owner, I want the system to automatically detect relevant trending topics in the Indian market, so that I can capitalize on timely marketing opportunities without manual research.

#### Acceptance Criteria

1. WHEN the Trend_Monitor detects a high-velocity Indian trend via news APIs, THE Prachar_System SHALL trigger a Campaign_Opportunity notification
2. WHEN analyzing trends, THE Trend_Monitor SHALL filter trends for relevance to the user's Business_Category
3. WHEN a trend velocity exceeds the threshold, THE Trend_Monitor SHALL calculate a relevance score between 0 and 100 for the user's business
4. WHEN multiple trends are detected simultaneously, THE Prachar_System SHALL rank Campaign_Opportunities by relevance score in descending order
5. WHEN a Campaign_Opportunity is created, THE Prachar_System SHALL include the trend name, relevance score, and suggested campaign angle

### Requirement 2: Hinglish Caption Generation

**User Story:** As an Indian SMB marketer, I want AI-generated captions in Hinglish that resonate with my local audience, so that my marketing feels authentic and culturally appropriate.

#### Acceptance Criteria

1. WHEN the user accepts a Campaign_Opportunity, THE Content_Generator SHALL use AWS Bedrock Claude 3.5 Sonnet to generate exactly 3 caption options
2. WHEN generating captions, THE Content_Generator SHALL produce text in Hinglish format mixing Hindi and English words
3. WHEN generating captions, THE Content_Generator SHALL retrieve Brand_Voice_Guidelines from the Knowledge_Base before generation
4. WHEN all captions are generated, THE Prachar_System SHALL present them to the user for selection
5. WHEN the user selects a caption, THE Prachar_System SHALL store the selection for campaign execution

### Requirement 3: Brand-Aligned Visual Generation

**User Story:** As a brand-conscious business owner, I want generated marketing visuals to strictly follow my brand colors and logo placement, so that all materials maintain professional consistency.

#### Acceptance Criteria

1. WHEN generating visuals, THE Visual_Generator SHALL use AWS Bedrock Titan Image Generator v2 to create marketing posters
2. WHEN generating visuals, THE Visual_Generator SHALL retrieve the brand's hex color codes from the Knowledge_Base
3. WHEN generating visuals, THE Visual_Generator SHALL enforce strict adherence to the retrieved hex color codes in the generated image
4. WHEN the user requests a Festival_Post, THE Visual_Generator SHALL retrieve the user's logo from the Knowledge_Base
5. WHEN the user requests a Festival_Post, THE Visual_Generator SHALL automatically insert the logo into the generated image at the designated position

### Requirement 4: Brand Guardrail Enforcement

**User Story:** As a business owner with established brand guidelines, I want the system to automatically ensure all generated content follows my brand rules, so that I don't have to manually review every detail.

#### Acceptance Criteria

1. WHEN generating any text content, THE Brand_Guardrail SHALL first retrieve Brand_Voice_Guidelines from the Knowledge_Base
2. WHEN generating any visual content, THE Brand_Guardrail SHALL first retrieve Brand_Safety_Rules from the Knowledge_Base
3. WHEN a generated output violates Brand_Safety_Rules, THE Brand_Guardrail SHALL detect the violation automatically
4. WHEN a brand safety violation is detected, THE Prachar_System SHALL auto-regenerate the asset without user intervention
5. WHEN auto-regeneration occurs, THE Prachar_System SHALL log the violation type and regeneration attempt

### Requirement 5: Business Category Filtering

**User Story:** As a business owner in a specific industry, I want to see only trends relevant to my business type, so that I don't waste time on irrelevant marketing opportunities.

#### Acceptance Criteria

1. WHEN the user first configures the system, THE Prachar_System SHALL prompt for Business_Category selection
2. WHEN analyzing any trend, THE Trend_Monitor SHALL compare the trend topic against the user's Business_Category
3. WHEN a trend has low relevance to the Business_Category, THE Trend_Monitor SHALL filter it out and not create a Campaign_Opportunity
4. WHEN calculating relevance, THE Trend_Monitor SHALL consider industry-specific keywords and context
5. WHERE the user operates in multiple categories, THE Trend_Monitor SHALL accept trends relevant to any of the configured categories

### Requirement 6: Campaign Opportunity Management

**User Story:** As a busy SMB owner, I want to quickly review and accept or reject campaign opportunities, so that I can make fast decisions on timely marketing moments.

#### Acceptance Criteria

1. WHEN a Campaign_Opportunity is triggered, THE Prachar_System SHALL display the trend name, relevance score, and suggested campaign angle
2. WHEN displaying a Campaign_Opportunity, THE Prachar_System SHALL provide "Accept" and "Reject" actions
3. WHEN the user accepts a Campaign_Opportunity, THE Prachar_System SHALL initiate the Content_Generator workflow
4. WHEN the user rejects a Campaign_Opportunity, THE Prachar_System SHALL mark it as dismissed and not show it again
5. WHEN a Campaign_Opportunity remains unactioned for 24 hours, THE Prachar_System SHALL mark it as expired

### Requirement 7: Knowledge Base Integration

**User Story:** As a system administrator, I want all brand assets and guidelines stored in a searchable vector database, so that the AI can quickly retrieve relevant context for generation.

#### Acceptance Criteria

1. WHEN the system initializes, THE Prachar_System SHALL connect to the OpenSearch Vector Store Knowledge_Base
2. WHEN storing brand guidelines, THE Prachar_System SHALL embed them as vectors in the Knowledge_Base
3. WHEN retrieving guidelines, THE Brand_Guardrail SHALL perform semantic search on the Knowledge_Base
4. WHEN the user uploads a logo, THE Prachar_System SHALL store it in the Knowledge_Base with metadata tags
5. WHEN retrieving a logo, THE Visual_Generator SHALL query the Knowledge_Base by business identifier

### Requirement 8: Multi-Option Content Selection

**User Story:** As a marketer, I want multiple caption options to choose from, so that I can select the one that best fits my current campaign tone.

#### Acceptance Criteria

1. WHEN generating captions, THE Content_Generator SHALL produce exactly 3 distinct options
2. WHEN presenting options, THE Prachar_System SHALL display all 3 captions simultaneously for comparison
3. WHEN the user selects an option, THE Prachar_System SHALL proceed with that caption for visual generation
4. WHEN the user rejects all options, THE Prachar_System SHALL offer to regenerate 3 new caption options
5. WHEN regenerating, THE Content_Generator SHALL produce captions different from the previously rejected ones

### Requirement 9: Automated Asset Regeneration

**User Story:** As a user who values efficiency, I want the system to automatically fix brand violations without my involvement, so that I receive compliant assets faster.

#### Acceptance Criteria

1. WHEN a brand violation is detected, THE Brand_Guardrail SHALL identify the specific rule violated
2. WHEN auto-regenerating, THE Prachar_System SHALL pass the violation context to the generator for correction
3. WHEN auto-regeneration completes, THE Prachar_System SHALL re-validate the new asset against Brand_Safety_Rules
4. IF the regenerated asset still violates rules, THEN THE Prachar_System SHALL attempt regeneration up to 3 times total
5. IF all regeneration attempts fail, THEN THE Prachar_System SHALL notify the user and request manual review

### Requirement 10: Festival and Cultural Event Support

**User Story:** As an Indian business owner, I want special support for major festivals and cultural events, so that my marketing aligns with important cultural moments.

#### Acceptance Criteria

1. WHEN the user requests a Festival_Post, THE Prachar_System SHALL recognize it as a special content type
2. WHEN generating a Festival_Post, THE Visual_Generator SHALL use festival-specific visual themes and motifs
3. WHEN generating a Festival_Post, THE Visual_Generator SHALL automatically include the user's logo without explicit request
4. WHEN generating Festival_Post captions, THE Content_Generator SHALL incorporate culturally appropriate greetings and phrases
5. WHERE the festival has regional variations, THE Content_Generator SHALL adapt content based on the user's geographic location
