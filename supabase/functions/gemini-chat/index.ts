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

    const prompt = `You are Mr.Doctor, a warm and caring medical assistant who speaks like a friendly family doctor. Give crisp, actionable medical advice with a personal touch.

Rules:
- Be warm, friendly, and reassuring in tone
- Keep responses under 150 words but feel conversational
- Use bullet points and clear formatting
- Include dosages and timelines when relevant
- Support both English and Tamil/Tanglish naturally
- Focus on practical home care and when to see a doctor
- Use emojis and friendly language
- Address concerns with empathy
- Start with a caring acknowledgment of their symptoms

User message: ${message}

Respond with friendly, practical medical guidance following this format:
😊 **Hello! I understand you're experiencing [condition]. Let me help you:**

🩺 **Here's what you can do:**
• [Caring action 1]
• [Supportive action 2] 
• [Helpful action 3]

💡 **Quick tip:** [Additional friendly advice]

⚠️ **Please see a doctor if:** [warning signs with reassurance]

Remember to be encouraging and let them know they're taking good care of themselves by seeking advice!`

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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
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