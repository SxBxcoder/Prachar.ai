# -*- coding: utf-8 -*-
"""
Prachar.ai - Creative Director Agent
Built with Strands SDK and AWS Bedrock for the AI for Bharat Hackathon

This module implements an autonomous Creative Director agent that:
1. Analyzes campaign goals and plans execution
2. Retrieves brand context via RAG (Bedrock Knowledge Base)
3. Generates Hinglish copy using Claude 3.5 Sonnet
4. Creates campaign posters using Titan Image Generator
5. Applies Bedrock Guardrails for responsible AI
"""

import json
import os
import uuid
import base64
from typing import Dict, List, Optional
from datetime import datetime

import boto3
from strands import Agent, tool

# AWS Clients
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
bedrock_runtime = boto3.client('bedrock-runtime', region_name=AWS_REGION)
bedrock_agent = boto3.client('bedrock-agent-runtime', region_name=AWS_REGION)
s3 = boto3.client('s3', region_name=AWS_REGION)
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)

# Environment Configuration
KNOWLEDGE_BASE_ID = os.getenv('BEDROCK_KB_ID')
GUARDRAIL_ID = os.getenv('GUARDRAIL_ID', 'default')
GUARDRAIL_VERSION = os.getenv('GUARDRAIL_VERSION', 'DRAFT')
S3_BUCKET = os.getenv('S3_BUCKET', 'prachar-ai-assets')
DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'prachar-campaigns')

# Model IDs (Cost-Optimized for Hackathon)
NOVA_MODEL_ID = "amazon.nova-lite-v1:0"  # Cost-effective model for demo
TITAN_IMAGE_MODEL_ID = "amazon.titan-image-generator-v1"

# Model Configuration (Resource Capping)
MAX_TOKENS = 300  # Hard cap - AWS deducts full max_tokens from quota immediately
TEMPERATURE = 0.7  # Creative variety for Hinglish without wasting tokens

# DynamoDB Table (MOCKED for MVP)
# campaigns_table = dynamodb.Table(DYNAMODB_TABLE)
campaigns_table = None  # Bypassing DynamoDB for MVP testing


# ============================================================================
# RAG: Brand Context Retrieval
# ============================================================================

def retrieve_brand_context(user_id: str, query: str) -> str:
    """
    Retrieve brand style guidelines from Bedrock Knowledge Base using RAG.
    
    Args:
        user_id: User identifier for filtering brand documents
        query: Semantic search query (e.g., "brand tone and voice")
    
    Returns:
        Concatenated text from top 3 relevant chunks
    """
    try:
        response = bedrock_agent.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={'text': query},
            retrievalConfiguration={
                'vectorSearchConfiguration': {
                    'numberOfResults': 3,
                    'overrideSearchType': 'HYBRID'
                }
            }
        )
        
        chunks = [r['content']['text'] for r in response.get('retrievalResults', [])]
        
        if not chunks:
            return "No brand guidelines found. Use default Indian youth-friendly tone."
        
        return "\n\n".join(chunks)
    
    except Exception as e:
        print(f"RAG retrieval error: {e}")
        return "No brand guidelines found. Use default Indian youth-friendly tone."
