# 🚀 Quick Start: AWS Credentials Setup

## Current Status
✅ All credential loading code is fixed and ready
⏳ Waiting for you to add your AWS credentials

---

## 3-Step Setup

### Step 1: Copy Template
```bash
cp .env.example .env
```

### Step 2: Edit .env File
Open `.env` and add your AWS credentials:
```bash
AWS_ACCESS_KEY_ID=AKIA...your_key_here
AWS_SECRET_ACCESS_KEY=wJalr...your_secret_here
AWS_REGION=us-east-1
```

### Step 3: Verify
```bash
python check_keys.py
```

You should see:
```
✅ CREDENTIALS STATUS: FOUND
```

---

## Get AWS Credentials

### Option A: Use Existing Credentials
If you already have AWS credentials, just copy them to `.env`

### Option B: Create New IAM User
1. Go to https://console.aws.amazon.com/iam/
2. Click "Users" → "Create user"
3. Attach policy: `AmazonBedrockFullAccess`
4. Create access key
5. Copy to `.env`

### Option C: Use AWS CLI
If you have AWS CLI configured:
```bash
cat ~/.aws/credentials
```
Copy the values to `.env`

---

## Enable Bedrock Models

1. Go to https://console.aws.amazon.com/bedrock/
2. Click "Model access"
3. Enable:
   - ✅ Amazon Nova Lite
   - ✅ Amazon Titan Image Generator
4. Wait for "Access granted"

---

## Test Everything

```bash
# 1. Verify credentials
python check_keys.py

# 2. Test agent
python test_agent.py

# 3. Start server
python server.py
```

---

## Files Created

| File | Purpose |
|------|---------|
| `.env.example` | Template with all variables |
| `check_keys.py` | Credential verification script |
| `SETUP_CREDENTIALS.md` | Detailed setup guide |
| `CREDENTIALS_FIXED.md` | Technical details of fixes |

---

## Need Help?

See `SETUP_CREDENTIALS.md` for:
- Detailed IAM setup instructions
- Troubleshooting common errors
- Security best practices

---

**Next:** Add your credentials to `.env` and run `python check_keys.py`
