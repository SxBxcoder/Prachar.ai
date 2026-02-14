# Backend Installation Guide

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- AWS credentials configured

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd Prachar.ai/backend
```

### 2. Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Boto3** - AWS SDK for Python
- **Strands Agents** - Agentic AI framework
- **Strands Agents Tools** - Pre-built tools
- **Pydantic** - Data validation
- **Python-dotenv** - Environment variable management

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Bedrock Configuration
BEDROCK_KB_ID=your_knowledge_base_id
GUARDRAIL_ID=your_guardrail_id
GUARDRAIL_VERSION=DRAFT

# Storage Configuration
S3_BUCKET=prachar-ai-assets
DYNAMODB_TABLE=prachar-campaigns
```

### 5. Verify Installation

```bash
python -c "import strands; print('Strands Agents installed successfully!')"
python -c "import fastapi; print('FastAPI installed successfully!')"
python -c "import boto3; print('Boto3 installed successfully!')"
```

### 6. Run the Server

```bash
python server.py
```

You should see:
```
🚀 Starting Prachar.ai Development Server...
📍 API will be available at: http://localhost:8000
📚 API docs available at: http://localhost:8000/docs
🔗 Frontend should connect to: http://localhost:8000/api/generate

✨ Ready to generate campaigns!
```

## Troubleshooting

### Issue: `strands-agents` not found

**Solution**: Ensure you're using Python 3.11+ and pip is up to date:
```bash
python --version  # Should be 3.11 or higher
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: AWS credentials error

**Solution**: Configure AWS credentials using one of these methods:

1. **AWS CLI** (Recommended):
```bash
aws configure
```

2. **Environment Variables**:
Add to `.env` file:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

3. **AWS Credentials File**:
Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your_key
aws_secret_access_key = your_secret
```

### Issue: Port 8000 already in use

**Solution**: Change the port in `server.py`:
```python
uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
```

### Issue: Module import errors

**Solution**: Ensure virtual environment is activated:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

## Testing the API

### Using curl

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"goal": "Hype my college fest", "user_id": "test_123"}'
```

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/api/generate",
    json={
        "goal": "Hype my college tech fest",
        "user_id": "test_user_123"
    }
)

print(response.json())
```

### Using the Interactive Docs

Open your browser and go to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Next Steps

1. Configure your AWS Bedrock models and Knowledge Base
2. Set up DynamoDB table for campaign storage
3. Create S3 bucket for image storage
4. Connect your Next.js frontend to the API

## Support

For issues or questions:
- Check the [Strands Agents Documentation](https://strandsagents.com)
- Review AWS Bedrock setup guides
- Check the main README.md file
