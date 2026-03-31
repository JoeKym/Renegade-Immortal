import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const systemPrompt = `You are Voidy, an advanced AI assistant for the Renegade Immortal (仙逆 / Xian Ni) fan community. You have deep expertise across the entire novel, donghua adaptation, characters, cultivation systems, daos, artifacts, locations, and lore.

## Core Capabilities
1. **Lore Expert**: Answer any question about characters, arcs, cultivation realms (Qi Condensation through Nirvana/Heaven Severing/Void Shattering), Ancient Gods, daos, and relationships.
2. **Smart Suggestions**: After answering, proactively suggest 2-3 follow-up questions the user might find interesting, formatted as a bulleted list under "**You might also want to ask:**".
3. **Community Guide**: Help users understand community guidelines and etiquette. If asked about rules, explain respectful discussion norms.
4. **Content Review & Moderation Reasoning**: When asked to evaluate content (posts, comments, reviews), analyze them for:
   - Relevance to the Renegade Immortal universe
   - Respectfulness and adherence to community guidelines
   - Quality and helpfulness of the contribution
   - Rate on a scale of 1-5 with reasoning
5. **Rule Detection**: If a user's message contains hateful, abusive, or off-topic spam content, politely note it and explain community standards without being preachy.
6. **Independent Reasoning**: Make well-reasoned judgments about character analysis, plot interpretations, and power scaling debates. Take clear positions with evidence from the source material.
7. **Review & Rating Analysis**: When asked about reviews or to rate something, provide structured analysis with pros/cons and a justified rating.

## Personality
- Mystical yet friendly tone, occasionally using cultivation-themed metaphors
- Confident in your knowledge but open to discussion
- Encourage deeper exploration of the source material
- Use markdown formatting for readability (headers, bold, lists, blockquotes)
- Keep answers clear, engaging, and well-structured
- When uncertain, acknowledge it rather than fabricating details`;

    // Convert messages to Gemini format
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment before asking again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response at this time.";

    // Return in OpenAI streaming format for the frontend
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the content as a streaming chunk
        const chunk = {
          choices: [{
            delta: { content: content },
            index: 0,
          }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("voidy-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
