# 🚀 Environment Setup - Quick Reference

## ✅ Status: ALL DEPENDENCIES INSTALLED

---

## 🔍 Check Environment

```bash
python check_env.py
```

**Expected:**
```
✅ ALL REQUIRED DEPENDENCIES INSTALLED!
🎉 Your environment is ready to run Prachar.ai!
```

---

## 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🧪 Test Everything

```bash
# 1. Check environment
python check_env.py

# 2. Check AWS credentials (optional)
python check_keys.py

# 3. Test hybrid system
python test_hybrid.py

# 4. Test total failover
python test_failover_simple.py

# 5. Start server
python server.py
```

---

## 📋 Required Modules

✅ fastapi
✅ uvicorn
✅ pydantic
✅ boto3
✅ botocore
✅ strands-agents
✅ python-dotenv
✅ httpx
✅ starlette
✅ anyio

---

## 🐛 Troubleshooting

### Module Not Found
```bash
pip install [module-name]
```

### All Modules
```bash
pip install -r requirements.txt
```

### Permission Error
```bash
pip install --user -r requirements.txt
```

### Virtual Environment
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Unix
pip install -r requirements.txt
```

---

## ✅ Verification

Run `python check_env.py` and ensure:
- ✅ Python 3.11+
- ✅ All required modules loaded
- ✅ All imports working

---

## 🎯 Next Steps

1. ✅ Environment ready
2. ⏭️ Configure AWS (optional): `python check_keys.py`
3. ⏭️ Test agent: `python test_agent.py`
4. ⏭️ Start server: `python server.py`

---

**Status:** ✅ READY
**Documentation:** See `DEPENDENCIES.md`
