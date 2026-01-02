
import { GoogleGenAI } from "@google/genai";
import { Goal } from "./types";
import { getDaysRemaining } from "./lib/calculations";

export const getFinancialAdvice = async (goal: Goal, userName: string, partnerName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const daysLeft = getDaysRemaining(goal.target_date);
  const percent = (goal.current_amount / goal.target_amount) * 100;
  
  const prompt = `
    Context: A couple named ${userName} and ${partnerName} are saving together for: ${goal.emoji} ${goal.name}.
    Target: ${goal.target_amount} (Current: ${goal.current_amount}, ${percent.toFixed(1)}% complete).
    Timeline: ${daysLeft} days remaining until ${goal.target_date}.
    
    Task: Provide a short, motivating, and playful 2-3 sentence financial tip for this couple to reach their goal. Speak in a friendly, supportive tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "Keep saving together! Every contribution brings you closer to your dreams. 💖";
  }
};
