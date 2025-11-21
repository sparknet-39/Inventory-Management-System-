import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, AiItemSuggestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const suggestItemDetails = async (itemName: string): Promise<AiItemSuggestion | null> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the product name "${itemName}" and suggest realistic inventory details. Return JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Best fit category from: Electronics, Office Supplies, Furniture, Peripherals, Networking, Accessories" },
            estimatedPrice: { type: Type.NUMBER, description: "Estimated market unit price in USD" },
            description: { type: Type.STRING, description: "Short, professional product description (max 15 words)" },
            suggestedThreshold: { type: Type.NUMBER, description: "Recommended low stock alert threshold (e.g. 5, 10)" }
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AiItemSuggestion;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return null;
  }
};

export const generateInventoryInsights = async (items: InventoryItem[]): Promise<string> => {
  if (!apiKey) return "AI Insights unavailable. Please check your API Key.";

  try {
    // Only send essential data to save tokens and ensure privacy
    const summary = items.map(i => ({ name: i.name, qty: i.quantity, price: i.unitPrice, cat: i.category }));
    const summaryJson = JSON.stringify(summary);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as an inventory manager assistant. Analyze this inventory list: ${summaryJson}. 
      Provide 3 short, bulleted insights focusing on: 
      1. Stock risks (low/overstock). 
      2. Value distribution anomalies. 
      3. A concise actionable tip. 
      Keep it under 100 words total. No markdown formatting, just plain text with bullet points.`,
    });

    return response.text || "Could not generate insights.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Failed to analyze inventory.";
  }
};