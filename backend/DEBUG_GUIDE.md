# Debug Guide - Frontend Empty Issue

## Problem
Frontend is empty because Nova response parsing may be failing.

## Fixes Applied

### ✅ Fix 1: Enhanced Response Debugging

**File**: `backend/agent.py`

**Added Debug Logging**:
```python
def extract_plan_from_response(response) -> Dict[str, str]:
    # DEBUG: Print full response structure
    print(f"\n{'='*60}")
    print(f"DEBUG - Full Agent Response Type: {type(response)}")
    print(f"DEBUG - Full Agent Response: {response}")
    print(f"{'='*60}\n")
    
    # ... extraction logic ...
    
    print(f"DEBUG - Extracted Plan: {plan}\n")
    return plan
```

**What to Look For**:
- Response type (should be `str` from Strands agent)
- Full response content
- Extracted plan values

---

### ✅ Fix 2: Strict Token Management

**File**: `backend/agent.py` (Line ~38)

**Configuration**:
```python
MAX_TOKENS = 300  # Hard cap
TEMPERATURE = 0.7  # Creative variety
```

**In generate_copy** (Line ~155):
```python
"inferenceConfig": {
    "maxTokens": MAX_TOKENS,  # Exactly 300
    "temperature": TEMPERATURE,  # 0.7
    "topP": 0.9
}
```

**Why This Matters**:
- AWS reserves full `maxTokens` from quota immediately
- 300 tokens prevents "Token Reservation" throttling
- New accounts have limited quotas

---

### ✅ Fix 3: Response Validation in FastAPI

**File**: `backend/server.py` (Line ~110)

**Added Validation**:
```python
# DEBUG: Verify response structure
print(f"\n{'='*60}")
print(f"DEBUG - Lambda Response Status: {status_code}")
print(f"DEBUG - Lambda Response Body Keys: {body.keys()}")
print(f"DEBUG - Plan present: {'plan' in body}")
print(f"DEBUG - Captions present: {'captions' in body}")
print(f"DEBUG - Image URL present: {'image_url' in body}")
print(f"{'='*60}\n")

# Validate required keys
required_keys = ['plan', 'captions', 'image_url']
missing_keys = [key for key in required_keys if key not in body]
if missing_keys:
    print(f"⚠️ WARNING: Missing keys in response: {missing_keys}")
    # Add defaults for missing keys
    if 'plan' not in body:
        body['plan'] = {'hook': 'Campaign ready!', 'offer': 'Special offer', 'cta': 'Join now'}
    if 'captions' not in body:
        body['captions'] = ['🔥 Caption 1', '✨ Caption 2', '💥 Caption 3']
    if 'image_url' not in body:
        body['image_url'] = 'https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=Campaign+Poster'
```

**Benefits**:
- Validates all required keys are present
- Provides fallback values if keys are missing
- Frontend never receives incomplete data

---

## How to Debug

### Step 1: Run Test Script

```bash
cd Prachar.ai/backend
python test_agent.py
```

### Step 2: Check Console Output

Look for these debug sections:

#### Agent Response Debug
```
============================================================
DEBUG - Full Agent Response Type: <class 'str'>
DEBUG - Full Agent Response: [Full text here]
============================================================
```

#### Plan Extraction Debug
```
DEBUG - Extracted Plan: {'hook': '...', 'offer': '...', 'cta': '...'}
```

#### Captions Extraction Debug
```
DEBUG - Extracting captions from: [First 200 chars]...
DEBUG - Extracted Captions: ['Caption 1', 'Caption 2', 'Caption 3']
```

#### Server Response Debug
```
============================================================
DEBUG - Lambda Response Status: 200
DEBUG - Lambda Response Body Keys: dict_keys(['campaign_id', 'user_id', 'goal', 'plan', 'captions', 'image_url', 'status', 'created_at'])
DEBUG - Plan present: True
DEBUG - Captions present: True
DEBUG - Image URL present: True
============================================================
```

---

## Common Issues & Solutions

### Issue 1: Empty Response from Agent

**Symptom**:
```
DEBUG - Full Agent Response: 
DEBUG - Extracted Plan: {'hook': 'Exciting campaign ahead!', ...}
```

**Cause**: Agent not returning data (Strands SDK issue or AWS credentials)

**Solution**:
1. Check AWS credentials in `.env`
2. Verify Bedrock model access
3. Check for throttling errors in logs

---

### Issue 2: Missing Keys in Response

**Symptom**:
```
⚠️ WARNING: Missing keys in response: ['captions']
```

**Cause**: Extraction functions not finding data in agent response

**Solution**:
1. Check agent response format in debug logs
2. Verify extraction patterns match response format
3. Fallback values will be used automatically

---

### Issue 3: Frontend Still Empty

**Symptom**: Console shows success but frontend is blank

**Possible Causes**:
1. **CORS issue**: Check browser console for CORS errors
2. **Frontend API call**: Verify frontend is calling `http://localhost:8000/api/generate`
3. **Response format**: Check browser Network tab for response structure

**Solution**:
```bash
# Check server logs
python server.py

# In browser console (F12):
# Look for errors in Console tab
# Check Network tab for API response
```

---

## Expected Console Output (Success)

```
🧪 Testing Prachar.ai Agent...
============================================================
📝 Test Goal: 'Create a campaign for a Tech Club focusing on Hackathon Registration'
👤 Test User: 'test_user_hackathon'

🚀 Calling lambda_handler...

============================================================
Agent Reasoning Input: Campaign Goal: Create a campaign for...
============================================================

[Attempt 1/3] Calling Nova Lite...
✅ Nova Lite succeeded on attempt 1

============================================================
Agent Final Output: [Agent response text]
============================================================

============================================================
DEBUG - Full Agent Response Type: <class 'str'>
DEBUG - Full Agent Response: [Full response]
============================================================

DEBUG - Extracted Plan: {'hook': 'Join the Hackathon!', 'offer': 'Win prizes', 'cta': 'Register now'}

DEBUG - Extracting captions from: [Response preview]...
DEBUG - Extracted Captions: ['🔥 Caption 1...', '✨ Caption 2...', '💥 Caption 3...']

MOCK DB SAVE: Campaign abc-123-def completed.

============================================================
DEBUG - Lambda Response Status: 200
DEBUG - Lambda Response Body Keys: dict_keys(['campaign_id', 'user_id', 'goal', 'plan', 'captions', 'image_url', 'status', 'created_at'])
DEBUG - Plan present: True
DEBUG - Captions present: True
DEBUG - Image URL present: True
============================================================

✅ SUCCESS! Agent generated campaign successfully!
```

---

## Verification Checklist

Before testing with frontend:

- [ ] `maxTokens` is exactly 300
- [ ] Debug logging is enabled
- [ ] Test script runs successfully
- [ ] All required keys present in response
- [ ] No missing key warnings
- [ ] Server starts without errors
- [ ] CORS is configured for localhost:3000

---

## Quick Test Commands

### Test Backend Only
```bash
cd Prachar.ai/backend
python test_agent.py
```

### Test Full Stack
```bash
# Terminal 1: Start backend
cd Prachar.ai/backend
python server.py

# Terminal 2: Start frontend
cd Prachar.ai/prachar-ai
npm run dev

# Browser: http://localhost:3000
```

### Test API Directly
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"goal": "Create a campaign for Tech Club focusing on Hackathon", "user_id": "test_123"}'
```

---

## Response Structure Guarantee

The backend now **guarantees** this structure:

```json
{
  "campaign_id": "uuid",
  "user_id": "test_123",
  "goal": "Create a campaign for...",
  "plan": {
    "hook": "...",
    "offer": "...",
    "cta": "..."
  },
  "captions": ["...", "...", "..."],
  "image_url": "https://...",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z"
}
```

Even if extraction fails, fallback values ensure all keys are present.

---

## Next Steps

1. Run `python test_agent.py`
2. Check console for debug output
3. Verify all keys are present
4. Start server: `python server.py`
5. Test frontend integration

If issues persist, check the debug logs for specific error messages.
