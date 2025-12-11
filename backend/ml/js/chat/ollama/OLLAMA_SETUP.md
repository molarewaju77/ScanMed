# Ollama Setup Guide for ScanMed

## What is Ollama?

Ollama is the **easiest way to run Llama models locally** on your computer. It works just like Docker - download and run AI models with simple commands.

### Advantages
✅ **100% Free** - No API costs  
✅ **No Rate Limits** - Unlimited requests  
✅ **Privacy** - All data stays on your machine  
✅ **Fast Setup** - 5 minutes to get started  
✅ **Offline** - Works without internet  

### Requirements
- **Minimum**: 8GB RAM, 10GB disk space
- **Recommended**: 16GB RAM, GPU (optional but faster)
- **OS**: Windows 10/11, macOS, Linux

---

## Installation Steps

### 1. Download and Install Ollama

**For Windows:**
1. Visit: https://ollama.ai/download
2. Download the Windows installer
3. Run the installer
4. Restart your terminal/PowerShell

**Verify installation:**
```powershell
ollama --version
```

### 2. Download Llama Models

Open PowerShell and run these commands:

```powershell
# Download Llama 3.2 for chat (4GB download)
ollama pull llama3.2

# Download Llama 3.2 Vision for medical scan analysis (8GB download)
ollama pull llama3.2-vision

# Optional: Download smaller model for faster responses (2GB)
ollama pull llama3.2:1b
```

**Check installed models:**
```powershell
ollama list
```

### 3. Start Ollama Server

The Ollama server usually starts automatically, but you can manually start it:

```powershell
ollama serve
```

This will start the API server at `http://localhost:11434`

**Keep this terminal window open** while using the chat feature.

### 4. Test Ollama (Optional)

Test in a new terminal:

```powershell
# Quick test chat
ollama run llama3.2 "Hello, how are you?"

# Test vision model
ollama run llama3.2-vision "Describe this image" --image "path/to/image.jpg"
```

---

## Integration with ScanMed Backend

### 1. Install Dependencies

```bash
cd backend
npm install axios
```

### 2. Update Environment Variables

Edit your `backend/.env` file and add:

```env
# AI Provider Configuration
AI_PROVIDER=ollama

# Ollama Settings
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_VISION_MODEL=llama3.2-vision
```

### 3. Update ML Controller

The `ml.controller.js` file needs to be updated to use Ollama instead of Gemini. See the updated controller in this folder.

### 4. Start Backend

```bash
npm run dev
```

---

## Testing Chat Functionality

### Test via API

```bash
# Test chat endpoint
curl -X POST http://localhost:5000/api/ml/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "What are symptoms of high blood pressure?",
    "language": "en"
  }'
```

### Test via Frontend

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Login to ScanMed
4. Use the chat feature
5. Ask health-related questions

---

## Available Models

| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| `llama3.2:1b` | 2GB | Quick responses, testing | ⚡⚡⚡ Fast |
| `llama3.2` | 4GB | **Recommended for chat** | ⚡⚡ Medium |
| `llama3.1:8b` | 8GB | Better quality responses | ⚡ Slower |
| `llama3.2-vision` | 8GB | **Medical scan analysis** | ⚡ Slower |

### Switching Models

```powershell
# Download a different model
ollama pull llama3.1:8b

# Update .env
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b
```

---

## Troubleshooting

### ❌ "Ollama server is not running"

**Solution:**
```powershell
ollama serve
```
Keep this terminal open.

---

### ❌ "Model 'llama3.2' not found"

**Solution:**
```powershell
ollama pull llama3.2
```

---

### ❌ Slow Responses

**Solutions:**
1. **Use smaller model**: Switch to `llama3.2:1b` in `.env`
2. **Add GPU support**: Ollama automatically uses your GPU if available
3. **Increase RAM**: Close other applications
4. **Use CPU optimization**: Ollama automatically optimizes for your hardware

---

### ❌ "ECONNREFUSED" Error

**Cause**: Ollama server not running

**Solution:**
```powershell
# Check if Ollama is running
ollama list

# If not, start it
ollama serve
```

---

### ❌ Out of Memory

**Solution 1** - Use smaller model:
```powershell
ollama pull llama3.2:1b
```

Update `.env`:
```env
OLLAMA_MODEL=llama3.2:1b
```

**Solution 2** - Reduce context:
Edit `ollamaChat.js` and reduce `num_predict` from 1000 to 500.

---

## Performance Tips

### 1. **GPU Acceleration**
Ollama automatically uses your GPU (NVIDIA, AMD, or Apple Silicon) if available. No configuration needed!

### 2. **Keep Ollama Running**
Don't restart the server between requests. It keeps models in memory for faster responses.

### 3. **Model Selection**
- **Development/Testing**: Use `llama3.2:1b` (fastest)
- **Production**: Use `llama3.2` (balanced)
- **Best Quality**: Use `llama3.1:8b` (slowest but best)

---

## Comparison: Ollama vs Gemini

| Feature | Gemini API | Ollama |
|---------|-----------|--------|
| **Cost** | $0.15/million tokens | **FREE** |
| **Setup** | 1 API key | 5-minute install |
| **Speed** | 1-2 seconds | 2-5 seconds (CPU) |
| **Privacy** | Data sent to Google | **Local only** |
| **Offline** | ❌ No | ✅ Yes |
| **Rate Limits** | Yes | ❌ No |
| **Quality** | Excellent | Very Good |

---

## Next Steps

1. ✅ Install Ollama
2. ✅ Download models
3. ✅ Update `.env` with Ollama settings
4. ✅ Start Ollama server
5. ✅ Test chat functionality
6. 🎉 Enjoy unlimited free AI chat!

---

## Additional Resources

- **Ollama Documentation**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Available Models**: https://ollama.ai/library
- **Llama 3.2 Info**: https://ollama.ai/library/llama3.2
- **Discord Community**: https://discord.gg/ollama

---

## Updating Ollama

```powershell
# Update Ollama itself
# Download latest installer from https://ollama.ai/download

# Update models
ollama pull llama3.2
ollama pull llama3.2-vision
```
