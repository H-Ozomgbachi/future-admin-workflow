import { GoogleGenAI } from "@google/genai";
import { LoanApplication, Customer } from "../types";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
// Only initialize if key exists to avoid crash, though we should handle it gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeLoanWithAI(loan: LoanApplication, customer: Customer) {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning mock analysis.");
    return {
      riskScore: loan.riskScore,
      analysis: loan.aiReasoning,
      recommendation: loan.aiRecommendation
    };
  }

  try {
    const prompt = `
      Act as a Senior Fintech Risk Analyst AI. Analyze the following loan application:
      
      Customer: ${customer.name} (Segment: ${customer.segment}, Risk Score: ${customer.riskScore})
      Loan Amount: $${loan.amount}
      Purpose: ${loan.purpose}
      Term: ${loan.termMonths} months
      
      Provide a concise risk analysis (max 3 sentences) and a final recommendation (Approve, Reject, or Escalate).
      Format the output as JSON: { "analysis": "...", "recommendation": "..." }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text || "";
    
    // Simple parsing - in production use structured output or more robust parsing
    try {
      // Find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { analysis: text, recommendation: "Escalate" };
    } catch (e) {
      return { analysis: text, recommendation: "Escalate" };
    }
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      riskScore: loan.riskScore,
      analysis: "AI Service unavailable. Using cached risk data: " + loan.aiReasoning,
      recommendation: loan.aiRecommendation
    };
  }
}

export async function chatWithAI(message: string, context: string) {
  if (!ai) {
    return "I'm sorry, I can't process that right now because the AI service is not configured.";
  }

  try {
    const prompt = `
      You are Wema SmartAdmin AI, an advanced assistant for Wema Bank's admin platform.
      
      Context:
      ${context}
      
      User Query: "${message}"
      
      Answer concisely and professionally. If asked to perform an action (like "freeze account"), confirm you have flagged it for the Super Admin.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "I encountered an empty response.";
  } catch (error) {
    console.error("AI Chat failed:", error);
    return "I encountered an error processing your request.";
  }
}
