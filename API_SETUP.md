# 🚀 Chizi AI - Free API Setup Guide

This guide will help you set up **FREE** AI APIs for Chizi AI chatbot. The chatbot uses **two free APIs** with automatic fallback - if one fails, it automatically tries the other.

## 📋 Required APIs

The chatbot uses **2 FREE APIs** (you need at least one, but having both is recommended for reliability):

1. **Groq API** (Primary - Recommended) ⭐
2. **Google Gemini API** (Fallback) 🆕

---

## 🔑 Option 1: Groq API (FREE - Recommended)

**Why Groq?**
- ⚡ Super fast responses
- 🆓 Generous free tier (14,400 requests/day, ~30 requests/minute)
- 🎯 Perfect for kid-friendly responses
- ✅ Easy to set up

### Steps to Get Groq API Key:

1. **Visit Groq Console**
   - Go to: https://console.groq.com

2. **Sign Up / Log In**
   - Click "Sign Up" or "Log In"
   - You can use Google/GitHub login for faster setup

3. **Create API Key**
   - Once logged in, go to: https://console.groq.com/keys
   - Click **"Create API Key"**
   - Give it a name (e.g., "Chizi AI")
   - Copy the API key (you'll only see it once!)

4. **Add to Environment Variables**
   - Create a `.env` file in your project root (if it doesn't exist)
   - Add this line:
     ```
     VITE_GROQ_API_KEY=your_groq_api_key_here
     ```
   - Replace `your_groq_api_key_here` with your actual API key

---

## 🔑 Option 2: Google Gemini API (FREE - Fallback)

**Why Gemini?**
- 🆓 Generous free tier (60 requests/minute, 1,500 requests/day)
- 🤖 Google's advanced AI model
- 🚀 Fast and reliable
- ✅ Great for kid-friendly responses

### Steps to Get Gemini API Key:

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey

2. **Sign In with Google Account**
   - Use your Google account to sign in
   - If you don't have one, create a free Google account

3. **Create API Key**
   - Click **"Create API Key"** or **"Get API Key"**
   - Select or create a Google Cloud project (free tier is fine)
   - Copy the API key (starts with `AIza...`)

4. **Add to Environment Variables**
   - Add this line to your `.env` file:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Replace `your_gemini_api_key_here` with your actual API key

---

## 📝 Complete `.env` File Example

Create a `.env` file in your project root with:

```env
# Groq API (Primary - Recommended)
VITE_GROQ_API_KEY=gsk_your_actual_groq_key_here

# Google Gemini API (Fallback - Optional but recommended)
VITE_GEMINI_API_KEY=AIza_your_actual_gemini_key_here
```

**Important Notes:**
- ⚠️ Never commit `.env` file to git (it's already in `.gitignore`)
- ✅ You only need **ONE** API key minimum, but having both provides better reliability
- 🔄 If one API fails, the chatbot automatically uses the other

---

## 🎯 How It Works

1. **First Try**: Groq API (if API key is set)
2. **Second Try**: Google Gemini API (if Groq fails and API key is set)
3. **Final Fallback**: Enhanced smart responses (works even without API keys!)

---

## ✅ Testing Your Setup

1. **Restart your development server** after adding API keys:
   ```bash
   npm run dev
   ```

2. **Open the chatbot** by clicking the floating robot button

3. **Ask a question** like "What is space?" or "Tell me about animals"

4. **Check browser console** (F12) to see which API is being used:
   - `✅ Groq API success` = Groq is working
   - `✅ Gemini API success` = Gemini is working
   - `📝 Using enhanced fallback responses` = Using fallback (no API keys)

---

## 🆘 Troubleshooting

### API not working?
- ✅ Check that API key is correct (no extra spaces)
- ✅ Make sure `.env` file is in project root
- ✅ Restart dev server after adding keys
- ✅ Check browser console for error messages

### Voice input not working?
- ✅ Allow microphone access in browser
- ✅ Use Chrome/Edge for best compatibility
- ✅ Make sure you're on HTTPS (required for microphone)

### Still having issues?
- The chatbot will work with the enhanced fallback responses even without API keys
- Check console logs for specific error messages

---

## 📚 API Limits (Free Tier)

### Groq API
- **14,400 requests per day**
- **~30 requests per minute**
- More than enough for a kid-friendly chatbot!

### Google Gemini API
- **60 requests per minute**
- **1,500 requests per day**
- Generous free tier - perfect for kids' chatbot!

---

## 🎉 You're All Set!

Once you've added at least one API key, the chatbot will use real AI responses. Enjoy your fully functional Chizi AI chatbot! 🚀✨
