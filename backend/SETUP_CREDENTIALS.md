# 🔐 AWS Credentials Setup Guide

## Quick Start

1. **Copy the template file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your AWS credentials:**
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Create a new user or use existing credentials
   - Ensure the user has Bedrock permissions

3. **Edit the .env file:**
   ```bash
   # Open .env in your editor and fill in:
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=wJalr...
   AWS_REGION=us-east-1
   ```

4. **Verify credentials:**
   ```bash
   python check_keys.py
   ```

5. **Test the agent:**
   ```bash
   python test_agent.py
   ```

---

## Detailed Instructions

### Step 1: Create IAM User (if needed)

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Enter username: `prachar-ai-dev`
4. Click "Next"

### Step 2: Attach Permissions

Attach these policies to your user:
- `AmazonBedrockFullAccess` (for model access)
- `AmazonS3FullAccess` (for image storage)
- `AmazonDynamoDBFullAccess` (for campaign storage)

Or create a custom policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream",
                "bedrock-agent-runtime:Retrieve"
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

### Step 3: Create Access Keys

1. Select your user in IAM
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Choose "Application running outside AWS"
5. Click "Next" → "Create access key"
6. **IMPORTANT:** Copy both keys immediately (you won't see the secret key again!)

### Step 4: Enable Bedrock Models

1. Go to [Amazon Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Click "Model access" in the left sidebar
3. Click "Manage model access"
4. Enable these models:
   - ✅ Amazon Nova Lite (`amazon.nova-lite-v1:0`)
   - ✅ Amazon Titan Image Generator (`amazon.titan-image-generator-v1`)
5. Click "Save changes"
6. Wait for status to change to "Access granted" (may take a few minutes)

### Step 5: Configure .env File

Create a `.env` file in the `backend` folder:

```bash
# Required
AWS_ACCESS_KEY_ID=AKIA...your_key_here
AWS_SECRET_ACCESS_KEY=wJalr...your_secret_here
AWS_REGION=us-east-1

# Optional (for temporary credentials)
# AWS_SESSION_TOKEN=your_token_here
```

### Step 6: Verify Setup

Run the credential checker:
```bash
python check_keys.py
```

Expected output:
```
============================================================
🔐 AWS CREDENTIALS VERIFICATION
============================================================

✅ .env file found at: /path/to/backend/.env

📋 Required Credentials:
------------------------------------------------------------
✅ AWS_ACCESS_KEY_ID: AKIA1234...5678
✅ AWS_SECRET_ACCESS_KEY: wJalrXUt...abcd
✅ AWS_REGION: us-east-1

============================================================
✅ CREDENTIALS STATUS: FOUND
============================================================

🎉 All required AWS credentials are properly configured!
🚀 You can now run the agent with: python test_agent.py
```

---

## Troubleshooting

### ❌ "Unable to locate credentials"

**Cause:** .env file not found or not loaded properly

**Fix:**
1. Ensure `.env` file exists in `backend/` folder
2. Check file is named exactly `.env` (not `.env.txt`)
3. Verify `python-dotenv` is installed: `pip install python-dotenv`

### ❌ "The security token included in the request is invalid"

**Cause:** Invalid or expired credentials

**Fix:**
1. Verify credentials are correct in .env file
2. Check for extra spaces or newlines
3. Regenerate access keys in IAM console

### ❌ "Could not connect to the endpoint URL"

**Cause:** Wrong region or network issue

**Fix:**
1. Verify `AWS_REGION=us-east-1` in .env
2. Check internet connection
3. Try a different region (us-west-2)

### ❌ "AccessDeniedException: User is not authorized"

**Cause:** Missing IAM permissions

**Fix:**
1. Go to IAM Console
2. Add `AmazonBedrockFullAccess` policy to your user
3. Wait 1-2 minutes for permissions to propagate

### ❌ "ValidationException: The provided model identifier is invalid"

**Cause:** Model not enabled in Bedrock

**Fix:**
1. Go to [Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Click "Model access"
3. Enable "Amazon Nova Lite" and "Titan Image Generator"
4. Wait for "Access granted" status

---

## Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore` (already configured)
- Use IAM users with minimal required permissions
- Rotate access keys regularly (every 90 days)
- Use AWS Secrets Manager for production

### ❌ DON'T:
- Commit `.env` file to Git
- Share credentials in chat/email
- Use root account credentials
- Hard-code credentials in source files

---

## Next Steps

Once credentials are verified:

1. **Test the agent:**
   ```bash
   python test_agent.py
   ```

2. **Start the development server:**
   ```bash
   python server.py
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs

---

## Need Help?

- AWS IAM Guide: https://docs.aws.amazon.com/IAM/latest/UserGuide/
- Bedrock Setup: https://docs.aws.amazon.com/bedrock/latest/userguide/
- Strands Agents: https://strandsagents.com/

---

**Status:** ✅ Credentials setup complete!
