
import { GoogleGenAI, Type } from "@google/genai";
import { Material, CostRecord, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeStockCosts = async (
  materials: Material[],
  costs: CostRecord[],
  transactions: Transaction[]
) => {
  const prompt = `
    作為一名 ERP 顧問，請分析以下 CO（管理會計）和 MM（物料管理）數據：
    
    物料數據: ${JSON.stringify(materials)}
    成本數據: ${JSON.stringify(costs)}
    交易紀錄: ${JSON.stringify(transactions)}

    請識別：
    1. 關鍵成本差異（規劃值 vs 實際值）。
    2. 超額庫存或缺貨風險。
    3. 存貨計價優化建議。
    
    請以簡潔、專業的繁體中文（Traditional Chinese）提供您的分析報告。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "無法取得 AI 分析報告。請檢查您的系統配置。";
  }
};
