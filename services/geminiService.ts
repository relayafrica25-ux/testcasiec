
import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingChunk, ChatMessage } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateArticleImage = async (prompt: string): Promise<string | null> => {
  try {
    if (!process.env.API_KEY) return null;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, modern, and minimalist financial editorial illustration for an article titled: "${prompt}". Use a sophisticated color palette suitable for a corporate financial portal. No text in the image.`,
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Transmission Error:", error);
    return null;
  }
};

export const fetchFinancialNews = async (): Promise<NewsItem[]> => {
  try {
    if (!process.env.API_KEY) return getMockNews();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a high-level scan of top-tier financial markets.
      
      OBJECTIVES:
      1. PRIORITY: African Financial Markets (Nigeria, South Africa, Kenya, Egypt). Focus on Fintech, Forex (NGN/ZAR), and Central Bank shifts.
      2. SECONDARY: Global Economic shifts impacting Emerging Markets.
      
      Output format (plain text, separate by "---"):
      Title: [Headline]
      Summary: [2-sentence economic impact analysis]
      Impact: [Bullish, Bearish, or Neutral]
      Image: [Direct source URL if available]
      ---
      `,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    const stories = text.split('---').map(block => block.trim()).filter(block => block.length > 0);
    
    const parsedNews: NewsItem[] = stories.map((story, index) => {
      const titleMatch = story.match(/Title:\s*(.+)/);
      const summaryMatch = story.match(/Summary:\s*(.+)/);
      const impactMatch = story.match(/Impact:\s*(.+)/);
      const imageMatch = story.match(/Image:\s*(.+)/);

      let imageUrl = imageMatch ? imageMatch[1].trim() : undefined;
      
      return {
        id: generateId(),
        title: titleMatch ? titleMatch[1].trim() : "Market Update",
        summary: summaryMatch ? summaryMatch[1].trim() : "Strategic movement in the continental financial sector.",
        impact: (impactMatch ? impactMatch[1].trim() : "Neutral") as 'Bullish' | 'Bearish' | 'Neutral',
        imageUrl: imageUrl,
        sources: index < groundingChunks.length && groundingChunks[index]?.web 
          ? [groundingChunks[index].web!] 
          : []
      };
    }).slice(0, 6); 

    return parsedNews;

  } catch (error) {
    return getMockNews();
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) return "The support terminal is currently in maintenance mode.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are the 'CASIEC Financial Specialist', the Proprietary Digital Interface for CASIEC FINANCIALS & GSI STRATEGIC ALLIANCES (Broastreet DyDX). 
        Your persona is institutional, elite, and highly efficient.
        
        Identity & Values:
        - Vision: Leading benchmark in finance & business support.
        - Mission: Delivering credit and enterprise architecture.
        - Core Values: Growth, Professionalism, Integrity.
        
        Capabilities:
        - Explaining Asset Finance, CFRA, and Supply Chain services.
        - Providing Direct Line contacts for GSI (+234 818-398-7171) and CASIEC (+234 810-326-0048).
        
        Guidelines:
        - Concise responses (under 50 words).
        - No specific financial advice.
        - Refer to human specialists for complex deals.
        `,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Transmission interrupted. Please reconnect.";
  } catch (error) {
    return "The uplink is currently offline.";
  }
};

const getMockNews = (): NewsItem[] => [
  {
    id: "1",
    title: "Financial Intermediation Expansion in Sub-Saharan Africa",
    summary: "New credit initiatives are targeting high-growth sectors to drive NMSE inclusion across the region.",
    impact: "Bullish",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
    sources: [{ uri: "#", title: "Institutional Review" }]
  }
];
