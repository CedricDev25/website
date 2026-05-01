import { GoogleGenAI, Type } from "@google/genai";
import { BudgetData, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemPrompt = `You are a personal finance coach. Analyse the user's budget 
and return ONLY a JSON object with the specified shape.
Be specific with numbers and reference their actual figures.
Provide actionable insights and a motivational savings goal.`;

export async function analyzeBudget(data: BudgetData): Promise<AIAnalysis> {
  const model = "gemini-3-flash-preview";

  const userPrompt = `
    Income: ${data.income}
    Expenses:
    ${data.expenses.map(e => `- ${e.category}: ${e.amount}`).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["savingsRate", "remainingBudget", "biggestSpend", "insights", "savingsGoal"],
        properties: {
          savingsRate: { type: Type.NUMBER },
          remainingBudget: { type: Type.NUMBER },
          biggestSpend: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["type", "text"],
              properties: {
                type: { type: Type.STRING, enum: ["warn", "good", "info"] },
                text: { type: Type.STRING }
              }
            }
          },
          savingsGoal: {
            type: Type.OBJECT,
            required: ["label", "monthlySaving", "yearsToGoal"],
            properties: {
              label: { type: Type.STRING },
              monthlySaving: { type: Type.NUMBER },
              yearsToGoal: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AIAnalysis;
}
