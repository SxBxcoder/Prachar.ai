# Error Diagnosis Guide - Silent Killer Catcher

## Overview
The backend now catches ALL errors including "silent killers" like region mismatch and credential errors.

---

## New Error Logging

### Connection Logging (Before API Call)
```
[Attempt 1/3] Calling Nova Lite...
📡 CONNECTION: Attempting to reach Amazon Nova Lite in us-east-1...
📋 Model ID: amazon.nova-lite-v1:0
⚙️  Config: maxTokens=300, temperature=0.7
```

### Success Logging
```
✅ Connection successful! Parsing response...
✅ Nova Lite succeeded on attempt 1
```

### Critical Error Logging (The "Silent Killer" Catcher)
```
============================================================
❌ CRITICAL ERROR IN GENERATE_COPY
============================================================
Error Type: NoCredentialsError
Error Message: Unable to locate credentials
============================================================

🔑 DIAGNOSIS: AWS Credentials issue detected!
   - Check AWS_ACCESS_KEY_ID in .env
   - Check AWS_SECRET_ACCESS_KEY in .env
   - Verify credentials are valid

============================================================
🔄 Returning Demo Mode fallback captions...
============================================================
```

---

## Common Errors & Diagnosis

### Error 1: AWS Credentials Missing

**Symptom**:
```
❌ CRITICAL ERROR IN GENERATE_COPY
Error Type: NoCredentialsError
Error Message: Unable to locate credentials

🔑 DIAGNOSIS: AWS Credentials issue detected!
```

**Cause**: Missing or invalid AWS credentials

**Solution**:
1. Create `.env` file in `backend/` directory:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

2. Verify credentials are valid:
```bash
aws sts get-caller-identity
```

3. Restart the server:
```bash
python server.py
```

---

### Error 2: Region Mismatch

**Symptom**:
```
❌ CRITICAL ERROR IN GENERATE_COPY
Error Type: ClientError
Error Message: Could not connect to the endpoint URL

🌍 DIAGNOSIS: Region mismatch detected!
   - Current region: us-west-1
   - Verify Nova Lite is available in us-west-1
   - Try changing AWS_REGION to us-east-1 or us-west-2
```

**Cause**: Nova Lite not available in specified region

**Solution**:
1. Update `.env` file:
```env
AWS_REGION=us-east-1
```

2. Verify Nova Lite availability:
   - us-east-1 ✅ (Recommended)
   - us-west-2 ✅
   - Other regions: Check AWS Console

3. Restart the server

---

### Error 3: Model Access Not Enabled

**Symptom**:
```
❌ CRITICAL ERROR IN GENERATE_COPY
Error Type: AccessDeniedException
Error Message: Model access not granted

🤖 DIAGNOSIS: Model access issue detected!
   - Model ID: amazon.nova-lite-v1:0
   - Verify model access is enabled in AWS Console
   - Check Bedrock model permissions
```

**Cause**: Bedrock model access not enabled in AWS account

**Solution**:
1. Go to AWS Console → Bedrock → Model Access
2. Request access to "Amazon Nova Lite"
3. Wait for approval (usually instant)
4. Restart the server

---

### Error 4: Throttling (429)

**Symptom**:
```
[Attempt 1/3] Calling Nova Lite...
📡 CONNECTION: Attempting to reach Amazon Nova Lite in us-east-1...
⚠️ Throttled (429). Retrying in 2s...
[Attempt 2/3] Calling Nova Lite...
⚠️ Throttled (429). Retrying in 4s...
❌ Throttled after 3 attempts. Using Demo Mode.
```

**Cause**: Too many requests or quota exceeded

**Solution**:
1. Wait a few minutes
2. Reduce request frequency
3. Check AWS quota limits
4. Demo Mode fallback will work automatically

---

### Error 5: Invalid Request Format

**Symptom**:
```
❌ Bedrock Error (ValidationException): Invalid request format
Error Details: {'Code': 'ValidationException', 'Message': '...'}
```

**Cause**: Request body format incorrect

**Solution**:
1. Verify Nova Lite API format is correct
2. Check `inferenceConfig` structure
3. Ensure `maxTokens` is an integer
4. Check model ID spelling

---

## Error Logging Levels

### Level 1: Connection Attempt
```
📡 CONNECTION: Attempting to reach Amazon Nova Lite in us-east-1...
```
**What it means**: About to make API call

### Level 2: Success
```
✅ Connection successful! Parsing response...
```
**What it means**: API call succeeded

### Level 3: Retry Warning
```
⚠️ Throttled (429). Retrying in 2s...
```
**What it means**: Temporary issue, retrying

### Level 4: Critical Error
```
❌ CRITICAL ERROR IN GENERATE_COPY
```
**What it means**: Fatal error, using fallback

---

## Diagnostic Checklist

When you see a critical error, check:

- [ ] AWS credentials are in `.env` file
- [ ] AWS_ACCESS_KEY_ID is not empty
- [ ] AWS_SECRET_ACCESS_KEY is not empty
- [ ] AWS_REGION is set (default: us-east-1)
- [ ] Nova Lite access is enabled in AWS Console
- [ ] Region supports Nova Lite model
- [ ] Internet connection is working
- [ ] AWS account is active

---

## Testing Error Handling

### Test 1: Missing Credentials
```bash
# Remove credentials from .env
# Run test
python test_agent.py

# Expected: Credentials error with diagnosis
```

### Test 2: Wrong Region
```bash
# Set AWS_REGION=ap-south-1 in .env
# Run test
python test_agent.py

# Expected: Region error with diagnosis
```

### Test 3: Invalid Model ID
```python
# In agent.py, temporarily change:
NOVA_MODEL_ID = "invalid-model-id"

# Run test
python test_agent.py

# Expected: Model error with diagnosis
```

---

## Console Output Examples

### Successful Run
```
============================================================
🚀 GENERATE_COPY STARTED
============================================================
Campaign Plan: {'hook': '...', 'offer': '...', 'cta': '...'}
User ID: test_user_hackathon
AWS Region: us-east-1
============================================================

[Attempt 1/3] Calling Nova Lite...
📡 CONNECTION: Attempting to reach Amazon Nova Lite in us-east-1...
📋 Model ID: amazon.nova-lite-v1:0
⚙️  Config: maxTokens=300, temperature=0.7
✅ Connection successful! Parsing response...
✅ Nova Lite succeeded on attempt 1
```

### Credentials Error
```
============================================================
🚀 GENERATE_COPY STARTED
============================================================
Campaign Plan: {'hook': '...', 'offer': '...', 'cta': '...'}
User ID: test_user_hackathon
AWS Region: us-east-1
============================================================

[Attempt 1/3] Calling Nova Lite...
📡 CONNECTION: Attempting to reach Amazon Nova Lite in us-east-1...

============================================================
❌ CRITICAL ERROR IN GENERATE_COPY
============================================================
Error Type: NoCredentialsError
Error Message: Unable to locate credentials
============================================================

🔑 DIAGNOSIS: AWS Credentials issue detected!
   - Check AWS_ACCESS_KEY_ID in .env
   - Check AWS_SECRET_ACCESS_KEY in .env
   - Verify credentials are valid

[Full traceback printed here]

============================================================
🔄 Returning Demo Mode fallback captions...
============================================================
```

### Region Error
```
============================================================
🚀 GENERATE_COPY STARTED
============================================================
Campaign Plan: {'hook': '...', 'offer': '...', 'cta': '...'}
User ID: test_user_hackathon
AWS Region: ap-south-1
============================================================

[Attempt 1/3] Calling Nova Lite...
📡 CONNECTION: Attempting to reach Amazon Nova Lite in ap-south-1...

============================================================
❌ CRITICAL ERROR IN GENERATE_COPY
============================================================
Error Type: EndpointConnectionError
Error Message: Could not connect to the endpoint URL
============================================================

🌍 DIAGNOSIS: Region mismatch detected!
   - Current region: ap-south-1
   - Verify Nova Lite is available in ap-south-1
   - Try changing AWS_REGION to us-east-1 or us-west-2

============================================================
🔄 Returning Demo Mode fallback captions...
============================================================
```

---

## Benefits of New Error Handling

### Before
- ❌ Silent failures
- ❌ Blank frontend
- ❌ No error messages
- ❌ Hard to debug

### After
- ✅ Detailed error logging
- ✅ Automatic diagnosis
- ✅ Fallback captions (frontend works)
- ✅ Easy to debug
- ✅ Specific fix suggestions

---

## Quick Fix Commands

### Fix Credentials
```bash
# Create .env file
cat > backend/.env << EOF
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
EOF
```

### Fix Region
```bash
# Update .env
sed -i 's/AWS_REGION=.*/AWS_REGION=us-east-1/' backend/.env
```

### Verify Setup
```bash
# Test credentials
aws sts get-caller-identity

# Test Bedrock access
aws bedrock list-foundation-models --region us-east-1
```

---

## Production Readiness

The backend now:
- ✅ Catches ALL errors (no silent failures)
- ✅ Provides detailed diagnostics
- ✅ Suggests specific fixes
- ✅ Returns fallback data (frontend never crashes)
- ✅ Logs connection attempts
- ✅ Shows full error context
- ✅ Prints stack traces for debugging

**No more blank screens!** 🎉
