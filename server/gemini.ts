import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Blueprint: javascript_gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ProductAnalysis {
  title: string;
  category: string;
  price: number;
  description: string;
  sentiment: string;
  keywords: string[];
  prediction: string;
}

export async function analyzeProductImage(imagePath: string): Promise<ProductAnalysis> {
  try {
    const imageBytes = fs.readFileSync(imagePath);

    const systemPrompt = `Siz professional mahsulot tahlilchisisiz. 
Rasmni tahlil qilib, quyidagi ma'lumotlarni JSON formatida qaytaring:
- title: Mahsulot nomi (o'zbek tilida)
- category: Mahsulot toifasi (o'zbek tilida)
- price: Taxminiy narx (dollar)
- description: Batafsil tavsif (o'zbek tilida, 2-3 jumla)
- sentiment: His-tuyg'u tahlili (masalan: "Ijobiy (95%)")
- keywords: Asosiy kalit so'zlar massivi (o'zbek tilida, 3-5 ta)
- prediction: Bozor bashorati (o'zbek tilida, 1 jumla)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            category: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            sentiment: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            prediction: { type: "string" },
          },
          required: ["title", "category", "price", "description", "sentiment", "keywords", "prediction"],
        },
      },
      contents: [
        {
          inlineData: {
            data: imageBytes.toString("base64"),
            mimeType: "image/jpeg",
          },
        },
        "Ushbu mahsulot rasmini tahlil qiling va JSON formatida ma'lumot bering.",
      ],
    });

    const rawJson = response.text;
    console.log(`Gemini AI Response: ${rawJson}`);

    if (rawJson) {
      const data: ProductAnalysis = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Gemini AI dan javob yo'q");
    }
  } catch (error) {
    console.error("Gemini AI xatosi:", error);
    // Fallback data
    return {
      title: "Yangi Mahsulot",
      category: "Umumiy",
      price: 100,
      description: "AI tahlili muvaffaqiyatsiz bo'ldi. Iltimos, qo'lda to'ldiring.",
      sentiment: "Neytral (50%)",
      keywords: ["mahsulot", "yangi"],
      prediction: "Ma'lumot yo'q",
    };
  }
}
