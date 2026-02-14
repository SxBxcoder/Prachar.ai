# 🚀 Prachar.ai Backend - Quick Start

## MVP Ready! 🎉

The backend is now fixed and ready for hackathon demo testing.

## What Was Fixed

✅ Agent initialization syntax error
✅ Database mocked for MVP testing
✅ All critical bugs resolved

## Start in 3 Steps

### Step 1: Install Dependencies

```bash
cd Prachar.ai/backend
pip install -r requirements.txt
```

### Step 2: Configure AWS (Minimal)

Create `.env` file:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
```

### Step 3: Run the Server

```bash
python server.py
```

You should see:
```
🚀 Starting Prachar.ai Development Server...
📍 API will be available at: http://localhost:8000
```

## Test It!

### Option 1: Quick Test Script
```bash
python test_agent.py
```

### Option 2: API Call
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"goal": "Hype my college fest", "user_id": "test_123"}'
```

### Option 3: Interactive Docs
Open browser: http://localhost:8000/docs

## Expected Output

```json
{
  "campaign_id": "uuid-here",
  "user_id": "test_123",
  "goal": "Hype my college fest",
  "plan": {
    "hook": "Festival season is here!",
    "offer": "Early bird tickets at 50% off",
    "cta": "Register now"
  },
  "captions": [
    "🔥 Festival season aa gaya! ...",
    "✨ College fest ka time hai! ...",
    "💥 Ekdum mast fest coming! ..."
  ],
  "image_url": "https://s3.amazonaws.com/...",
  "status": "completed"
}
```

## Console Output

You'll see:
```
MOCK DB SAVE: Campaign abc-123-def completed.
```

This confirms the agent is working without needing DynamoDB!

## Troubleshooting

### "Module not found: strands"
```bash
pip install strands-agents strands-agents-tools
```

### "Port 8000 in use"
Change port in `server.py` line 82:
```python
uvicorn.run("server:app", port=8001, reload=True)
```

### "AWS credentials not found"
Add to `.env`:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

## What's Mocked

- ✅ DynamoDB saves (prints to console instead)
- ✅ Campaign storage (returns data without saving)

## What's Real

- ✅ Agent initialization
- ✅ Tool definitions
- ✅ FastAPI server
- ✅ API endpoints
- ⚠️ Bedrock calls (requires AWS credentials)

## Next: Connect Frontend

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
```

## Ready for Hackathon! 🏆

The backend is now MVP-ready. You can:
- ✅ Demo the API
- ✅ Test content generation logic
- ✅ Connect your frontend
- ✅ Show the agent workflow

Good luck with the hackathon! 🚀
