# Prachar.ai Backend

FastAPI server for the Creative Director Agent.

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

Create a `.env` file in the `backend` directory:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_KB_ID=your_knowledge_base_id
GUARDRAIL_ID=your_guardrail_id
GUARDRAIL_VERSION=DRAFT
S3_BUCKET=prachar-ai-assets
DYNAMODB_TABLE=prachar-campaigns
```

### 3. Run the Server

```bash
python server.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Generate Campaign

**POST** `/api/generate`

Request:
```json
{
  "goal": "Hype my college tech fest",
  "user_id": "test_user_123"
}
```

Response:
```json
{
  "campaign_id": "uuid",
  "user_id": "test_user_123",
  "goal": "Hype my college tech fest",
  "plan": {
    "hook": "Festival season is here!",
    "offer": "Early bird tickets at 50% off",
    "cta": "Register now"
  },
  "captions": [
    "🔥 Festival season aa gaya! Early bird tickets pe 50% off - Register now! 💯",
    "✨ College fest ka time hai! Limited seats, 50% discount - Don't miss! 🎉",
    "💥 Ekdum mast fest coming! Book karo abhi with 50% off - Full on fun! 🚀"
  ],
  "image_url": "https://s3.amazonaws.com/...",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Health Check

**GET** `/health`

Returns server status.

## API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

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

## Frontend Integration

Your Next.js frontend should call:

```typescript
const response = await fetch('http://localhost:8000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    goal: 'Hype my college fest',
    user_id: 'user_123'
  })
});

const campaign = await response.json();
```

## Development

The server runs with auto-reload enabled. Any changes to `agent.py` or `server.py` will automatically restart the server.

## Troubleshooting

### Port Already in Use

If port 8000 is busy, change the port in `server.py`:

```python
uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
```

### CORS Issues

If you get CORS errors, ensure your Next.js app is running on `http://localhost:3000`. If using a different port, add it to the `allow_origins` list in `server.py`.

### AWS Credentials

Ensure your AWS credentials have permissions for:
- Bedrock Runtime (InvokeModel)
- Bedrock Agent Runtime (Retrieve)
- S3 (PutObject, GetObject)
- DynamoDB (PutItem, GetItem, Query)
