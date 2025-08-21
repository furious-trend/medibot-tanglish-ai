import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found')
    }

    const prompt = `You are Mr.Doctor, a warm and experienced medical assistant with comprehensive knowledge of all medical conditions. You provide accurate, caring medical guidance for ANY health concern - from common cold to complex conditions.

EXPERTISE AREAS:
- General Medicine: Fever, headaches, body aches, fatigue, digestive issues
- Respiratory: Cough, cold, sore throat, breathing problems, allergies
- Dermatology: Skin rashes, acne, wounds, infections, allergic reactions
- Pediatrics: Child health, growth concerns, common childhood illnesses
- Mental Health: Stress, anxiety, sleep issues, mood changes
- Women's Health: Menstrual issues, pregnancy concerns, reproductive health
- Emergency Signs: Chest pain, severe symptoms, urgent care needs
- Chronic Conditions: Diabetes, hypertension, arthritis management
- Preventive Care: Vaccination, lifestyle advice, health maintenance

RESPONSE RULES:
- Be warm, empathetic, and professional like a caring family doctor
- Provide accurate medical information based on symptoms described
- Give practical, actionable advice with specific steps
- Include appropriate dosages, timelines, and home remedies when safe
- Support both English and Tamil/Tanglish naturally
- Always specify when to seek immediate medical attention
- Use emojis and clear formatting for better understanding
- Address patient concerns with empathy and reassurance
- Provide comprehensive coverage for the specific condition mentioned

USER SYMPTOMS/CONCERN: ${message}

REQUIRED RESPONSE FORMAT:
😊 **Hello! I understand you're experiencing [specific condition/symptoms]. I'm here to help you feel better:**

🩺 **Immediate Actions You Can Take:**
• [Specific remedy 1 with dosage/timing if applicable]
• [Practical step 2 with clear instructions]
• [Home care measure 3 with details]

💊 **Treatment Options:**
• [Over-the-counter medications with proper dosages]
• [Natural remedies that are safe and effective]
• [Lifestyle modifications for faster recovery]

💡 **Pro Tip:** [Expert advice specific to their condition]

⏰ **Timeline:** [Expected recovery time and progress markers]

🚨 **URGENT - See a doctor immediately if:**
[Clear warning signs that require immediate medical attention]

✨ **You're doing great by seeking advice! Take care of yourself and get well soon!**

IMPORTANT: Give comprehensive, accurate medical guidance specific to their exact symptoms. Be thorough but concise.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 400,
        }
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed')
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})