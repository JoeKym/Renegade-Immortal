import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET /conversations - List all conversations for user
    if (action === "list" || req.method === "GET" && !action) {
      const { data, error } = await supabaseClient
        .from("voidy_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify({ conversations: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /conversations - Create new conversation
    if (action === "create" || req.method === "POST" && !action) {
      const { title = "New Chat" } = await req.json().catch(() => ({}));
      
      const { data, error } = await supabaseClient
        .from("voidy_conversations")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ conversation: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /messages?conversation_id=xxx - Get messages for a conversation
    if (action === "messages") {
      const conversationId = url.searchParams.get("conversation_id");
      if (!conversationId) {
        return new Response(JSON.stringify({ error: "Missing conversation_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseClient
        .from("voidy_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /messages - Save a message
    if (action === "save_message") {
      const { conversation_id, role, content } = await req.json();
      
      if (!conversation_id || !role || !content) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseClient
        .from("voidy_messages")
        .insert({ conversation_id, role, content })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ message: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /conversations?id=xxx - Delete conversation
    if (action === "delete" || req.method === "DELETE") {
      const id = url.searchParams.get("id") || (await req.json().catch(() => ({}))).id;
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseClient
        .from("voidy_conversations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH /conversations - Update title
    if (action === "update" || req.method === "PATCH") {
      const { id, title } = await req.json();
      if (!id || !title) {
        return new Response(JSON.stringify({ error: "Missing id or title" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseClient
        .from("voidy_conversations")
        .update({ title })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ conversation: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("voidy-history error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
