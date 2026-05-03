import { GoogleGenAI, Type } from "@google/genai";
import { StudentLevel, PerformanceAnalysis, DoubtResponse, NoteGeneratorResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PERSONALITY = `You are "EduSpark AI" — a highly engaging, intelligent, and fun AI-powered student assistant.
Friendly, energetic, motivating like a great teacher.
Use simple, clear language.
Make learning fun and interactive.
Never say "I am an AI".
Always encourage curiosity and confidence.`;

export const analyzeStudentPerformance = async (data: any): Promise<PerformanceAnalysis> => {
  const prompt = `Analyze this student data for EduSpark AI:
  ${JSON.stringify(data)}

  Output the analysis in the exact JSON structure:
  {
    "student_name": "string",
    "attendance": "string",
    "marks": { "subject": number },
    "performance_analysis": "string",
    "weak_areas": ["string"],
    "suggestions": ["string"]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PERSONALITY,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          student_name: { type: Type.STRING },
          attendance: { type: Type.STRING },
          marks: { type: Type.OBJECT, additionalProperties: { type: Type.NUMBER } },
          performance_analysis: { type: Type.STRING },
          weak_areas: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["student_name", "attendance", "marks", "performance_analysis", "weak_areas", "suggestions"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const solveDoubt = async (
  doubt: string,
  level: StudentLevel = StudentLevel.BEGINNER
): Promise<DoubtResponse> => {
  const prompt = `Student Level: ${level}
  User Doubt: "${doubt}"

  Respond in this EXACT structure:
  1. 🎯 Concept: (Simple explanation)
  2. 🧠 Example: (Relatable real-world example)
  3. 📘 Notes: (Bullet points)
  4. 🔍 Deep Dive: (Optional detailed explanation)
  5. ⚡ Summary: (2-3 line recap)
  6. 🎮 Quick Challenge: (1 small question)`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `${SYSTEM_PERSONALITY}\nWhen a student asks a doubt, choose explanation style according to level. Return the response as JSON.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          example: { type: Type.STRING },
          notes: { type: Type.ARRAY, items: { type: Type.STRING } },
          deepDive: { type: Type.STRING },
          summary: { type: Type.STRING },
          quickChallenge: { type: Type.STRING },
          xpEarned: { type: Type.NUMBER, description: "XP to award for this interaction, usually 10-20" }
        },
        required: ["concept", "example", "notes", "summary", "quickChallenge", "xpEarned"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateNotes = async (topic: string): Promise<NoteGeneratorResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert this topic into structured notes: "${topic}"`,
    config: {
      systemInstruction: SYSTEM_PERSONALITY,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          definitions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
            },
          },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ["title", "keyPoints", "definitions", "examples", "summary"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
