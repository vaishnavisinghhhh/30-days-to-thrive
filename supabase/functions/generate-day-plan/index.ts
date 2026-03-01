import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a world-class travel planner and life-experience advisor. The user has a bucket-list goal they want to accomplish in ONE day.

Your job is to provide a COMPREHENSIVE, ACTIONABLE day plan. Analyze the goal and determine if it's travel/place-related or an activity/experience.

**If it's travel/place-related**, provide:
1. **Getting There** — Real transport options: flights, trains, buses, driving. Mention popular airlines/routes if applicable. Estimated costs.
2. **Where to Stay** — Hotel/hostel/Airbnb recommendations with price ranges (budget, mid-range, luxury). Mention actual hotel names or neighborhoods.
3. **Must-Visit Hotspots** — Top 5-7 specific places, landmarks, restaurants, hidden gems. Include brief descriptions.
4. **Logistics & Tips** — Best time to visit, local currency, language tips, safety notes, what to pack, local transport (metro, tuk-tuk, etc.)
5. **Hour-by-Hour Itinerary** — A realistic morning-to-evening schedule.
6. **Budget Estimate** — Rough total cost breakdown.

**If it's NOT travel-related** (e.g., "learn to cook pasta", "start a podcast", "run a marathon"), provide:
1. **Research & Insights** — Key knowledge, background, and interesting facts about this goal.
2. **What You'll Need** — Equipment, materials, tools, apps, or resources. Include specific product names and estimated costs.
3. **Step-by-Step Guide** — Detailed actionable steps to accomplish this in one day.
4. **Expert Tips** — Pro tips, common mistakes to avoid, best practices.
5. **Hour-by-Hour Schedule** — Realistic timeline from start to finish.
6. **Inspiration** — Success stories, motivational insights, or interesting facts.

Respond ONLY with valid JSON in this exact format:
{
  "sections": [
    {
      "title": "Section Title",
      "icon": "emoji",
      "items": ["Detailed point 1", "Detailed point 2", "Detailed point 3", "Detailed point 4"]
    }
  ]
}

Be SPECIFIC. Use real names, real prices, real places. No generic filler. Make it feel like a personal concierge wrote this.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `My bucket-list goal for today: "${goal}"\n\nGive me a comprehensive, detailed, actionable plan.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        sections: [
          {
            title: "Your Plan",
            icon: "📋",
            items: [content.slice(0, 500)],
          },
        ],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-day-plan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
