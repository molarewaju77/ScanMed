# ScanMed AI Provider Setup

## 🎉 You Now Have 3 AI Options!

Your ScanMed backend now supports **three AI providers** for chat and image analysis:

1. **Ollama** - Free, local, easy setup (5 minutes) ⭐ **RECOMMENDED**
2. **Llama Stack** - Free, Meta's official Llama 4 Scout
3. **Gemini** - Google's API (your current problematic setup)

---

## 🚀 Quick Start: Choose Your Provider

### Option 1: Ollama (Easiest - 5 Minutes)

```bash
# 1. Download and install Ollama
# Visit: https://ollama.ai/download (Windows installer)

# 2. Download models
ollama pull llama3.2
ollama pull llama3.2-vision

# 3. Start Ollama (usually auto-starts)
ollama serve

# 4. Update your .env file
cd backend
# Add this line:
AI_PROVIDER=ollama
```

✅ **Done!** Your chat will now use Ollama instead of Gemini.

**Full setup guide**: [`backend/ml/js/chat/ollama/OLLAMA_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/ollama/OLLAMA_SETUP.md)

---

### Option 2: Llama Stack (Meta's Official Llama 4 Scout)

```bash
# 1. Install Llama Stack
pip install llama-stack -U

# 2. Download Llama 4 Scout (you have been approved!)
llama model download --source meta --model-id Llama-4-Scout-17B-16E-Instruct
# Paste your unique URL when prompted (see LLAMA_STACK_SETUP.md)

# 3. Start Llama Stack server
llama stack run --port 5001

# 4. Update your .env file
cd backend
# Add this line:
AI_PROVIDER=llama-stack
```

✅ **Done!** Your chat will now use Llama 4 Scout.

**Full setup guide**: [`backend/ml/js/chat/llama-stack/LLAMA_STACK_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/llama-stack/LLAMA_STACK_SETUP.md)

---

### Option 3: Keep Gemini (Fix API Issues)

If you want to stick with Gemini, try:

```bash
# Get a fresh API key from:
# https://makersuite.google.com/app/apikey

# Update .env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_new_api_key_here
```

---

## 📁 Folder Structure

```
backend/ml/js/chat/
├── geminiChat.js          # Original Gemini implementation
├── ollama/
│   ├── ollamaChat.js      # Ollama client
│   └── OLLAMA_SETUP.md    # Complete Ollama setup guide
└── llama-stack/
    ├── llamaStackChat.js   # Llama Stack client
    └── LLAMA_STACK_SETUP.md # Complete Llama Stack guide
```

---

## 🔧 How It Works

### Multi-Provider Support

The ML controller (`backend/controllers/ml.controller.js`) now:

1. **Reads `AI_PROVIDER` from .env** (options: `ollama`, `llama-stack`, `gemini`)
2. **Uses selected provider** for chat and image analysis
3. **Falls back automatically** if primary provider fails:
   - Ollama → Llama Stack → Gemini → Heuristics

### Environment Variables

Edit `backend/.env`:

```env
# Choose your provider
AI_PROVIDER=ollama  # or llama-stack or gemini

# Ollama settings (if using Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_VISION_MODEL=llama3.2-vision

# Llama Stack settings (if using Llama Stack)
LLAMA_STACK_BASE_URL=http://localhost:5001
LLAMA_STACK_MODEL=Llama-4-Scout-17B-16E-Instruct

# Gemini settings (if using Gemini)
GEMINI_API_KEY=your_api_key_here
```

---

## ✅ Testing Your Setup

### 1. Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
Using AI Provider: ollama
```
or
```
Using AI Provider: llama-stack
```

### 2. Test Chat Feature

Use your ScanMed frontend chat or test via API:

```bash
curl -X POST http://localhost:5000/api/ml/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "What are symptoms of diabetes?",
    "language": "en"
  }'
```

---

## 🆚 Provider Comparison

| Feature | Ollama | Llama Stack | Gemini |
|---------|--------|-------------|--------|
| **Cost** | FREE | FREE | Pay-per-use |
| **Setup Time** | 5 min | 15 min | 1 min (API key) |
| **Model** | Llama 3.2 | **Llama 4 Scout** | Gemini Pro |
| **Vision** | ✅ Yes | ❌ Limited | ✅ Yes |
| **Speed** | Fast (local) | Medium (local) | Very Fast (cloud) |
| **Privacy** | ✅ 100% local | ✅ 100% local | ❌ Cloud-based |
| **Offline** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | **Development, Vision** | Latest model, Text | Production, No setup |

---

## 🎯 My Recommendation

### For You (Based on Your Frustration with Gemini):

**Use Ollama!**

**Why?**
- ✅ **5-minute setup** - Easiest option
- ✅ **No API issues** - Runs locally
- ✅ **Vision support** - Works for medical scans
- ✅ **Free forever** - Zero costs
- ✅ **Fast** - Good performance on most machines

**Steps:**
1. Install Ollama from https://ollama.ai/download
2. Run: `ollama pull llama3.2 && ollama pull llama3.2-vision`
3. Edit `.env`: `AI_PROVIDER=ollama`
4. Restart backend: `npm run dev`
5. **Done!** No more Gemini API issues 🎉

---

## 🐛 Troubleshooting

### "Ollama server is not running"
```bash
ollama serve
```

### "Llama Stack server not running"
```bash
llama stack run --port 5001
```

### "No AI provider available"
- Check your `.env` file has `AI_PROVIDER` set
- Ensure the server for your chosen provider is running
- Check backend logs for specific errors

### "Model not found"
```bash
# For Ollama
ollama pull llama3.2

# For Llama Stack
llama model download --source meta --model-id Llama-4-Scout-17B-16E-Instruct
```

---

## 📚 Additional Resources

- **Ollama Full Guide**: [`OLLAMA_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/ollama/OLLAMA_SETUP.md)
- **Llama Stack Full Guide**: [`LLAMA_STACK_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/llama-stack/LLAMA_STACK_SETUP.md)
- **Environment Config**: [`.env.example`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/.env.example)
- **ML Controller**: [`ml.controller.js`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/controllers/ml.controller.js)

---

## 🔄 Switching Between Providers

You can easily switch providers by changing one line in `.env`:

```env
# Use Ollama
AI_PROVIDER=ollama

# Use Llama Stack
AI_PROVIDER=llama-stack

# Use Gemini
AI_PROVIDER=gemini
```

Then restart your backend: `npm run dev`

---

## 💡 Pro Tips

1. **Best of Both Worlds**: Use Ollama for image analysis (vision model) and Llama Stack for chat (better text quality)
2. **Testing**: Keep Gemini as a fallback while you test Ollama/Llama Stack
3. **Production**: Consider Llama Stack for production (more stable than Ollama dev server)
4. **Development**: Use Ollama for fastest development iteration

---

## ❓ Questions?

Check the setup guides or let me know if you need help:
- Issues with Ollama? See [`OLLAMA_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/ollama/OLLAMA_SETUP.md)
- Issues with Llama Stack? See [`LLAMA_STACK_SETUP.md`](file:///c:/Users/makin/Desktop/projects/ScanMed/backend/ml/js/chat/llama-stack/LLAMA_STACK_SETUP.md)
- Performance issues? Check the troubleshooting sections in the guides

---

**Ready to say goodbye to Gemini API issues? Start with Ollama now!** 🚀
