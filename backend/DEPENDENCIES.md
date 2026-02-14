# 📦 Prachar.ai Backend Dependencies

## ✅ Dependency Audit Complete

**Last Checked:** 2026-02-14
**Status:** All dependencies verified and working

---

## 🎯 Core Dependencies

### Web Framework
| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | ≥0.115.0 | Modern web framework for building APIs |
| `uvicorn[standard]` | ≥0.32.0 | ASGI server for running FastAPI |
| `pydantic` | ≥2.10.0 | Data validation and settings management |

### AWS SDK
| Package | Version | Purpose |
|---------|---------|---------|
| `boto3` | ≥1.35.0 | AWS SDK for Python (Bedrock, S3, DynamoDB) |
| `botocore` | ≥1.35.0 | Low-level AWS service access |

### Agentic AI Framework
| Package | Version | Purpose |
|---------|---------|---------|
| `strands-agents` | ≥1.26.0 | AI agent framework for AWS Bedrock |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| `python-dotenv` | ≥1.0.1 | Load environment variables from .env files |
| `python-multipart` | ≥0.0.12 | Parse multipart form data |

---

## 📋 Auto-Installed Dependencies

These are installed automatically with the core packages:

| Package | Purpose |
|---------|---------|
| `httpx` | HTTP client for API calls |
| `anyio` | Async I/O support |
| `starlette` | FastAPI's underlying framework |
| `typing-extensions` | Extended type hints |
| `pydantic-core` | Pydantic's core validation |
| `annotated-types` | Type annotation support |
| `opentelemetry-api` | Observability and tracing |
| `mcp` | Model Context Protocol |

---

## 🔧 Installation

### Quick Install (Recommended)
```bash
pip install -r requirements.txt
```

### Manual Install
```bash
# Web Framework
pip install fastapi>=0.115.0
pip install uvicorn[standard]>=0.32.0
pip install pydantic>=2.10.0

# AWS SDK
pip install boto3>=1.35.0
pip install botocore>=1.35.0

# Agentic AI Framework
pip install strands-agents>=1.26.0

# Utilities
pip install python-dotenv>=1.0.1
pip install python-multipart>=0.0.12
```

### Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Unix/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## ✅ Verification

### Check All Dependencies
```bash
python check_env.py
```

**Expected Output:**
```
🔍 PRACHAR.AI ENVIRONMENT DEPENDENCY CHECKER
============================================================

📋 Python Version Check:
✅ [PYTHON] Version 3.11+

📦 Required Modules:
✅ [FASTAPI] LOADED
✅ [UVICORN] LOADED
✅ [PYDANTIC] LOADED
✅ [BOTO3] LOADED
✅ [BOTOCORE] LOADED
✅ [STRANDS] LOADED
✅ [DOTENV] LOADED
✅ [HTTPX] LOADED
✅ [STARLETTE] LOADED
✅ [ANYIO] LOADED

📊 SUMMARY
Required Modules: 10/10 ✅

✅ ALL REQUIRED DEPENDENCIES INSTALLED!
🎉 Your environment is ready to run Prachar.ai!
```

### Check Specific Module
```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
python -c "import boto3; print(f'Boto3 {boto3.__version__}')"
python -c "import strands; print('Strands Agents installed')"
```

---

## 🐛 Troubleshooting

### Issue: Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Fix:**
```bash
pip install fastapi>=0.115.0
```

### Issue: Import Error

**Error:**
```
ImportError: cannot import name 'Agent' from 'strands'
```

**Fix:**
```bash
pip uninstall strands-sdk  # Remove wrong package
pip install strands-agents>=1.26.0  # Install correct package
```

### Issue: Version Conflict

**Error:**
```
ERROR: pip's dependency resolver does not currently take into account all the packages that are installed.
```

**Fix:**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Clean install
pip uninstall -y fastapi uvicorn pydantic boto3 strands-agents
pip install -r requirements.txt
```

### Issue: Permission Denied

**Error:**
```
ERROR: Could not install packages due to an OSError: [Errno 13] Permission denied
```

**Fix (Windows):**
```bash
# Install for current user only
pip install --user -r requirements.txt
```

**Fix (Unix/Mac):**
```bash
# Use virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Issue: SSL Certificate Error

**Error:**
```
SSLError: [SSL: CERTIFICATE_VERIFY_FAILED]
```

**Fix:**
```bash
# Temporary workaround (not recommended for production)
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Better: Update certificates
pip install --upgrade certifi
```

---

## 📊 Dependency Tree

```
prachar-ai-backend
├── fastapi (Web Framework)
│   ├── starlette (ASGI framework)
│   ├── pydantic (Data validation)
│   └── typing-extensions (Type hints)
├── uvicorn (ASGI Server)
│   ├── httpx (HTTP client)
│   └── anyio (Async I/O)
├── boto3 (AWS SDK)
│   └── botocore (AWS core)
├── strands-agents (AI Framework)
│   ├── opentelemetry-api (Tracing)
│   ├── mcp (Model Context Protocol)
│   └── pydantic (Data validation)
└── python-dotenv (Environment variables)
```

---

## 🔄 Updating Dependencies

### Check for Updates
```bash
pip list --outdated
```

### Update Specific Package
```bash
pip install --upgrade fastapi
pip install --upgrade boto3
pip install --upgrade strands-agents
```

### Update All Packages
```bash
pip install --upgrade -r requirements.txt
```

### Freeze Current Versions
```bash
pip freeze > requirements-lock.txt
```

---

## 🎯 Python Version Requirements

**Minimum:** Python 3.11
**Recommended:** Python 3.11 or 3.12
**Tested:** Python 3.11, 3.12, 3.13, 3.14

### Check Python Version
```bash
python --version
```

### Install Python 3.11+
- **Windows:** https://www.python.org/downloads/
- **Mac:** `brew install python@3.11`
- **Linux:** `sudo apt install python3.11`

---

## 📝 Development Dependencies (Optional)

For development and testing:

```bash
# Testing
pip install pytest>=7.0.0
pip install pytest-asyncio>=0.21.0

# Code Quality
pip install black>=23.0.0
pip install flake8>=6.0.0
pip install mypy>=1.0.0

# Documentation
pip install mkdocs>=1.5.0
pip install mkdocs-material>=9.0.0
```

---

## 🚀 Quick Start Checklist

- [x] Python 3.11+ installed
- [x] Virtual environment created
- [x] Dependencies installed (`pip install -r requirements.txt`)
- [x] Environment verified (`python check_env.py`)
- [ ] AWS credentials configured (`python check_keys.py`)
- [ ] Agent tested (`python test_agent.py`)
- [ ] Server started (`python server.py`)

---

## 📚 Additional Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- Boto3: https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
- Strands Agents: https://strandsagents.com/
- Pydantic: https://docs.pydantic.dev/

### Support
- FastAPI Issues: https://github.com/tiangolo/fastapi/issues
- Boto3 Issues: https://github.com/boto/boto3/issues
- Strands Issues: https://github.com/awslabs/strands-agents/issues

---

## ✅ Status

**Environment Check:** ✅ PASSED
**All Dependencies:** ✅ INSTALLED
**Import Tests:** ✅ WORKING
**Ready for Development:** ✅ YES

---

**Last Updated:** 2026-02-14
**Verified By:** check_env.py
**Status:** 🎉 Production Ready
