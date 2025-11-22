import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NoteType } from "../types";

// Ensure API Key exists
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface GeneratedContent {
  title: string;
  content?: string;
  items?: string[];
}

export const generateNoteContent = async (
  prompt: string,
  type: NoteType
): Promise<GeneratedContent | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const modelId = "gemini-2.5-flash"; // Using flash for speed and efficiency for simple text tasks
    
    // Define schema based on note type
    let responseSchema: Schema;
    
    if (type === 'todo') {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, relevant title for the list" },
          items: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of todo items" 
          }
        },
        required: ["title", "items"]
      };
    } else {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, relevant title for the note" },
          content: { type: Type.STRING, description: "The body of the note, formatted with markdown if necessary" }
        },
        required: ["title", "content"]
      };
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Create a ${type === 'todo' ? 'to-do list' : 'text note'} based on this request: "${prompt}". Keep it concise and practical.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedContent;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};
