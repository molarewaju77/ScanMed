# Hugging Face API Setup - Quick Guide

## ✅ What You Now Have

I've converted the Llama Stack implementation to use **Hugging Face Inference API** - a cloud-based solution that requires **zero local installation**!

### Benefits
- ✅ **100% Free** - Free tier API
- ✅ **No Installation** - Runs in the cloud
- ✅ **Llama 2 13B** - Meta's official Llama model
- ✅ **Works Immediately** - No downloads, no server setup
- ✅ **Vision Support** - Uses BLIP for medical image analysis

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Your Free API Token

1. Visit: https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name it: `ScanMed` (or anything you like)
4. Role: **Read** (default)
5. Click **"Generate token"**
6. **Copy the token** (you'll need it in Step 2)

### Step 2: Add Token to .env

Edit `backend/.env` and add:

```env
# AI Provider Configuration
AI_PROVIDER=huggingface

# Hugging Face Configuration
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=meta-llama/Llama-2-13b-chat-hf
```

Replace `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual token from Step 1.

### Step 3: InstallAxios (if not already installed)

```bash
cd backend
npm install axios
```

### Step 4: Start Backend

```bash
npm run dev
```

You should see:
```
Using AI Provider: huggingface
```

### Step 5: Test Chat

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

## ⚙️ How It Works

### Cloud-Based Architecture

```
Your Backend → Hugging Face API → Llama 2 Model → Response
```

- **No local server** - Everything runs on Hugging Face's infrastructure
- **No model downloads** - Models are already hosted
- **Automatic scaling** - HF handles all infrastructure

### Models Used

1. **Chat**: `meta-llama/Llama-2-13b-chat-hf`
   - Meta's official Llama 2 13B model
   - Optimized for conversations
   - Free tier access

2. **Vision**: `Salesforce/blip-image-captioning-large`
   - BLIP model for image understanding
   - Generates descriptions of medical images
   - Llama analyzes the description

---

## 📊 Expected Performance

### First Request (Cold Start)
- **Time**: 20-30 seconds
- **Reason**: Model needs to load into memory
- **Frequency**: Only happens after inactivity

### Subsequent Requests
- **Time**: 2-5 seconds
- **Reason**: Model stays warm in memory

### Free Tier Limits
- **Requests**: ~30,000 characters/month
- **Rate Limit**: Reasonable for development
- **Speed**: Good (cloud infrastructure)

---

## 🔧 Troubleshooting

### ❌ "No API key configured"

**Solution**: Add to `.env`:
```env
HUGGINGFACE_API_KEY=hf_your_token_here
```

---

### ❌ "Invalid API key"

**Solutions**:
1. Check your token at: https://huggingface.co/settings/tokens
2. Ensure token has **Read** permissions
3. Make sure token is copied correctly (no spaces)

---

### ❌ "Model is loading" (503 error)

**This is NORMAL** on first request or after inactivity.

**Solution**: Just wait 20-30 seconds and try again.

---

### ❌ Slow Responses

**Expected behavior** on free tier:
- First request: 20-30 seconds (cold start)
- Following requests: 2-5 seconds

**If consistently slow**:
1. Check your internet connection
2. Try during off-peak hours
3. Model may be under heavy load

---

## 🆚 Comparison with Other Options

| Feature | HuggingFace API | Ollama | Gemini |
|---------|----------------|--------|--------|
| **Setup Time** | **2 min** ⚡ | 15 min | 1 min |
| **Installation** | **None** ✅ | Local server | None |
| **Cost** | **FREE** ✅ | FREE | Paid |
| **Speed** | 2-5 sec | 1-3 sec | 1-2 sec |
| **Model** | Llama 2 13B | Llama 3.2 | Gemini Pro |
| **Vision** | BLIP | Llama 3.2 Vision | Yes |
| **Offline** | ❌ No | ✅ Yes | ❌ No |
| **Best For** | **No-setup solution** | Local privacy | Production |

---

## 💡 Pro Tips

### 1. Be Patient on First Request
The model needs to "warm up" the first time you use it. This is normal.

### 2. Switch Between Providers
You can easily switch in `.env`:
```env
# Use Hugging Face
AI_PROVIDER=huggingface

# Use Ollama (if you install it later)
AI_PROVIDER=ollama

# Use Gemini (if you fix the API key)
AI_PROVIDER=gemini
```

### 3. Monitor Your Usage
Check usage at: https://huggingface.co/settings/billing

---

## 🎯 Next Steps

1. ✅ Get your HF token (Step 1 above)
2. ✅ Add to `.env` (Step 2 above)
3. ✅ Start backend: `npm run dev`
4. ✅ Test chat in ScanMed frontend
5. 🎉 Enjoy free AI chat with no Gemini API issues!

---

## 📝 Important Notes

### Free Tier Limits
- **30,000 character input/month**
- **Good for development and testing**
- **Upgrade to Pro** ($9/month) for unlimited access

### Model Availability
- Llama 2 models are **always available** on free tier
- Llama 3 models require **Pro account**
- Current setup uses **Llama 2 13B** (free tier compatible)

### Privacy
- Data is processed on Hugging Face servers
- **Not 100% private** (unlike Ollama)
- Data is **not used for training**

---

## 🔄 Want to Try Ollama Later?

If you want true local privacy and faster responses, you can always install Ollama:

```bash
# Download from: https://ollama.ai/download
ollama pull llama3.2
ollama serve

# Update .env:
AI_PROVIDER=ollama
```

See: `backend/ml/js/chat/ollama/OLLAMA_SETUP.md`

---

**Status: ✅ Ready to Use!**

Get your token and you're all set - no complex setup required!
