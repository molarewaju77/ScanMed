# Meta Llama 4 Scout Setup Guide

## What is Llama Stack?

**Llama Stack** is Meta's official framework for building LLM applications. You've been approved to access **Llama 4 Scout** - Meta's latest and most powerful model!

### Your Approved Model
✅ **Llama 4 Scout 17B Instruct** - Latest model with improved reasoning  
✅ **Valid for 48 hours** - Your download URL expires soon!  
✅ **5 downloads allowed** - You can download up to 5 times  

### Advantages Over Ollama
- 🚀 **Latest Model** - Llama 4 is newer than Llama 3.2
- 🎯 **Official Support** - Direct from Meta
- 📈 **Better Performance** - More capable reasoning
- 🔒 **Safety Models** - Includes Llama Guard for content filtering

---

## Prerequisites

### System Requirements
- **Python 3.10+** required
- **16GB RAM minimum** (32GB recommended)
- **20GB free disk space**
- **GPU recommended** (but CPU works)

### Check Python Version
```powershell
python --version
# Should show Python 3.10 or higher
```

If you don't have Python 3.10+:
- Download from: https://www.python.org/downloads/
- ✅ Check "Add Python to PATH" during installation

---

## Installation Steps

### 1. Install Llama Stack CLI

Open PowerShell and run:

```powershell
# Install Llama Stack
pip install llama-stack -U

# Verify installation
llama --version
```

### 2. View Available Models

```powershell
# See all Llama models
llama model list
```

You should see models like:
- `Llama-4-Scout-17B-16E-Instruct` (Your approved model!)
- `Llama-3.2-11B-Vision-Instruct`
- And others...

### 3. Download Llama 4 Scout

⚠️ **IMPORTANT**: Your download URL expires in 48 hours from approval!

```powershell
# Start the download process
llama model download --source meta --model-id Llama-4-Scout-17B-16E-Instruct
```

**When prompted for your unique custom URL, paste this:**

```
https://llama4.llamameta.net/*?Policy=eyJTdGF0ZW1lbnQiOlt7InVuaXF1ZV9oYXNoIjoidGRidWdiOTF5dnZ5MWN5dmRzZXdha3JsIiwiUmVzb3VyY2UiOiJodHRwczpcL1wvbGxhbWE0LmxsYW1hbWV0YS5uZXRcLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3NjU2NjMyOTR9fX1dfQ__&Signature=TwAlM4W8OUMZSLLX6dtNJueG2hcODc8A-bHU%7EGogNGVYdVpU-ewMLnFOuBNmxLncc29PQbeO6VkKOmcdf7BQDD%7EcpgRBvYY%7EMlStvZHUsmgsD59Itj0Ji6zXbPBh1vJ3veYSx913snJOnZpAlT7oVa1RBA%7EGBC3UhebnaiaeSbJyzdZj81LbwbBY9RMdw-4HLT-UnOx5lWMKWBVmkINZx93-c2REJ1jT-mifzNOsU5zlRqiAqYqsVXZp42oG%7EN0zZDFFyS%7EnLMvQOsAfRNtgS1ZEQuh-WYoi7JcDdFmwHKII2iyv6CbZY2ctETG70RiE-Dfb88L0ZelWvHmeMkf6PA__&Key-Pair-Id=K15QRJLYKIFSLZ&Download-Request-ID=3206922806133963
```

This will download ~17GB. Be patient!

### 4. (Optional) Download Safety Models

```powershell
# Download Llama Guard for content safety
llama model download --source meta --model-id Llama-Guard-4-12B

# Download Prompt Guard (lightweight)
llama model download --source meta --model-id Llama-Prompt-Guard-2-86M
```

---

## Running Llama Stack Server

### Option A: Quick Start

```powershell
# Start server on default port (5001)
llama stack run --port 5001
```

Keep this terminal window open!

### Option B: Advanced Configuration

Create a configuration file `llama-config.yaml`:

```yaml
inference_model: Llama-4-Scout-17B-16E-Instruct
host: localhost
port: 5001
max_tokens: 2048
temperature: 0.7
```

Then run:

```powershell
llama stack run --config llama-config.yaml
```

### Verify Server is Running

In a new terminal:

```powershell
curl http://localhost:5001/health
```

Should return status 200.

---

## Integration with ScanMed Backend

### 1. Update Environment Variables

Edit `backend/.env`:

```env
# AI Provider Configuration
AI_PROVIDER=llama-stack

# Llama Stack Settings
LLAMA_STACK_BASE_URL=http://localhost:5001
LLAMA_STACK_MODEL=Llama-4-Scout-17B-16E-Instruct
```

### 2. (Optional) Update ML Controller

If you want to use Llama Stack, the controller needs to import it. See the updated `ml.controller.js` in the main implementation.

### 3. Start Backend

```bash
cd backend
npm run dev
```

---

## Testing Llama 4 Scout

### Test via Command Line

```powershell
# Interactive chat
llama model chat --model-id Llama-4-Scout-17B-16E-Instruct

# Ask a question
> What are the symptoms of diabetes?
```

### Test via API

```bash
curl -X POST http://localhost:5001/inference/chat_completion \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Llama-4-Scout-17B-16E-Instruct",
    "messages": [
      {"role": "user", "content": "What are symptoms of high blood pressure?"}
    ],
    "max_tokens": 1000
  }'
```

### Test via ScanMed

1. Ensure Llama Stack server is running: `llama stack run --port 5001`
2. Start backend: `npm run dev`
3. Start frontend: `npm run dev`
4. Login and use chat feature

---

## Troubleshooting

### ❌ "Python version too old"

**Solution:**
- Download Python 3.10+ from https://www.python.org/downloads/
- Reinstall with "Add to PATH" checked
- Restart terminal

---

### ❌ "pip: command not found"

**Solution:**
```powershell
# Use python -m pip instead
python -m pip install llama-stack -U
```

---

### ❌ "Download URL expired"

**Cause**: Your unique URL is valid for 48 hours only

**Solution:**
1. Go to https://www.llama.com/llama-downloads/
2. Request access again
3. Get a new download URL
4. Use the new URL with the download command

---

### ❌ "Model not found" Error

**Solution:**
```powershell
# Check installed models
llama model list

# If model missing, download again
llama model download --source meta --model-id Llama-4-Scout-17B-16E-Instruct
```

---

### ❌ Out of Memory

**Cause**: Llama 4 Scout requires significant RAM

**Solutions:**
1. **Close other applications**
2. **Use CPU instead of trying GPU** (enabled by default)
3. **Consider Ollama with smaller model** (Llama 3.2:1b)

---

### ❌ Slow Responses

**Expected Behavior**:
- First response: 10-30 seconds (model loads)
- Subsequent responses: 2-10 seconds depending on hardware

**Solutions:**
1. **Keep server running** - Don't restart between requests
2. **Use GPU** if available (automatic)
3. **Reduce max_tokens** in config (set to 500 instead of 2048)

---

## Model Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| **Llama 4 Scout Instruct** | 17B | Medium | Excellent | Complex queries, latest features |
| Llama 3.2 (Ollama) | 3B | Fast | Very Good | General chat, faster responses |
| Llama 3.2:1b (Ollama) | 1B | Very Fast | Good | Quick responses, testing |

---

## Security Features

### Llama Guard (Optional)

Download and enable content safety:

```powershell
# Download Llama Guard
llama model download --source meta --model-id Llama-Guard-4-12B

# Configure in llama-config.yaml
safety_model: Llama-Guard-4-12B
```

Benefits:
- Filters harmful content
- Detects policy violations
- Medical content safety checks

---

## Performance Optimization

### 1. Keep Server Running
Don't restart the Llama Stack server. It caches the model in memory.

### 2. Adjust Token Limits
```yaml
# In llama-config.yaml
max_tokens: 500  # Reduce for faster responses
```

### 3. Temperature Settings
```yaml
temperature: 0.7  # Default (creative)
temperature: 0.3  # More deterministic (medical use)
temperature: 1.0  # More creative (general chat)
```

---

## Updating Llama Stack

```powershell
# Update Llama Stack CLI
pip install llama-stack -U

# Check for new models
llama model list --show-all
```

---

## Comparison: Llama Stack vs Ollama

| Feature | Ollama | Llama Stack |
|---------|--------|-------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Moderate |
| **Latest Models** | Llama 3.2 | ⭐ **Llama 4 Scout** |
| **Performance** | Very Good | Excellent |
| **Vision Support** | ✅ Yes (3.2-vision) | ❌ Limited |
| **Official Support** | Community | ⭐ **Meta Official** |
| **Best For** | Quick start, vision | Latest models, production |

---

## Recommendation

### Use Ollama if:
- You need vision/image analysis (medical scans)
- You want fastest setup (5 minutes)
- You prioritize speed over latest features

### Use Llama Stack if:
- You want the absolute latest model (Llama 4)
- You need official Meta support
- Text chat quality is top priority

### Best Approach:
**Use both!** 
- **Ollama** for image analysis (`llama3.2-vision`)
- **Llama Stack** for chat (`Llama-4-Scout`)

---

## Next Steps

1. ✅ Install Python 3.10+
2. ✅ Install Llama Stack: `pip install llama-stack -U`
3. ✅ Download Llama 4 Scout with your unique URL
4. ✅ Start server: `llama stack run --port 5001`
5. ✅ Update `.env` with Llama Stack settings
6. ✅ Test chat functionality
7. 🎉 Enjoy Llama 4 Scout!

---

## Additional Resources

- **Llama Stack Docs**: https://llama-stack.readthedocs.io/
- **GitHub Repo**: https://github.com/meta-llama/llama-stack
- **Model Cards**: https://github.com/meta-llama/llama-models
- **Discord Community**: https://discord.gg/llama

---

## Important Notes

⚠️ **Your download URL expires**: December 23, 2025  
⚠️ **5 download limit**: Use it wisely  
⚠️ **48-hour validity**: Download soon!  
✅ **Free forever after download**: No ongoing costs  
✅ **Commercial use allowed**: Check Llama Community License
