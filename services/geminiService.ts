
import { GoogleGenAI, Type } from "@google/genai";
import type { FiveWhysAnalysis, GeneratedRiskData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fiveWhysSchema = {
  type: Type.OBJECT,
  properties: {
    whys: {
      type: Type.ARRAY,
      description: "A list of 5 'why' questions and their corresponding answers, drilling down to the root cause.",
      items: {
        type: Type.OBJECT,
        properties: {
          why: { type: Type.STRING, description: "The 'why' question." },
          answer: { type: Type.STRING, description: "The answer to the 'why' question." },
        },
        required: ["why", "answer"],
      },
    },
    rootCause: {
      type: Type.STRING,
      description: "The final, fundamental root cause identified after the 5 whys. This should be a process or condition, not a solution.",
    },
  },
  required: ["whys", "rootCause"],
};

export const performFiveWhys = async (concern: string): Promise<FiveWhysAnalysis> => {
  const prompt = `
    You are an expert in root cause analysis specializing in risk management. A user has provided a risk concern.
    Your task is to perform a '5 Whys' analysis to uncover the fundamental root cause. The final root cause should be a process, system, or human factor that, if resolved, would prevent the problem from recurring. It must NOT be a solution or a lack of a solution.
    
    IMPORTANT: All your output, including the 'why' questions, their answers, and the final root cause, must be written in simple, clear English, easy for anyone to understand (around an 8th-grade reading level). Avoid technical or business jargon.

    User's concern: "${concern}"

    Perform the analysis and return the result in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: fiveWhysSchema,
    },
  });
  
  const jsonText = response.text;
  if (!jsonText) {
    throw new Error('API returned an empty response for 5 Whys analysis.');
  }

  try {
    return JSON.parse(jsonText) as FiveWhysAnalysis;
  } catch (e) {
    console.error("Failed to parse 5 Whys JSON:", jsonText);
    throw new Error("The AI returned an invalid format for the analysis. Please try again.");
  }
};

const riskDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A detailed, narrative description of the risk, explaining the context, cause, and potential impact."
    },
    objective: {
      type: Type.STRING,
      description: "A clear, concise risk objective stating the desired outcome if the risk is managed. It should be aspirational and measurable if possible (e.g., 'Ensure 99.9% data accuracy in quarterly reports')."
    },
    statements: {
      type: Type.ARRAY,
      description: "An array of 3-5 distinct risk statements in 'If [cause], then [effect]' format.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["description", "objective", "statements"],
};

export const generateRiskDetails = async (rootCause: string, originalConcern: string): Promise<GeneratedRiskData> => {
  const prompt = `
    You are an expert in risk management authoring. Based on the provided root cause and the original risk concern, generate a comprehensive risk profile. This includes a detailed risk description, a clear risk objective, and 3 to 5 high-quality risk statements.

    IMPORTANT: All parts of the generated profile (description, objective, and statements) MUST be written in simple, clear English, at an 8th-grade reading level. Avoid jargon and complex sentences so that anyone can understand the risk.

    Rules for risk statements:
    1.  Format: Each statement MUST strictly follow the 'If [cause], then [effect]' format.
    2.  Cause: The '[cause]' part must be a restatement of the identified root cause.
    3.  Effect: The '[effect]' part should describe a potential negative impact on business goals, projects, or the company (e.g., losing money, project delays, unhappy customers, bad data).
    4.  Focus: The statement MUST be focused on the problem (root cause), not on a solution. Do not mention the absence of a control or a solution.
    5.  Objectivity: Statements must be factual and objective.

    Rules for Risk Description:
    - Provide a simple story that explains the 'if-then' statements. Talk about the original concern and how the root cause leads to the potential bad outcomes.

    Rules for Risk Objective:
    - State the desired goal if this risk is successfully handled. It should be a clear, positive outcome. For example, "Make sure all customer reports are 100% correct."

    Original Concern: "${originalConcern}"
    Identified Root Cause: "${rootCause}"

    Now, generate the full risk profile and return it in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: riskDetailsSchema,
    },
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error('API returned an empty response for risk details generation.');
  }

  try {
    const parsed = JSON.parse(jsonText);
    if (parsed && typeof parsed.description === 'string' && typeof parsed.objective === 'string' && Array.isArray(parsed.statements)) {
       return parsed as GeneratedRiskData;
    }
    throw new Error("Parsed JSON does not match the expected format.");
  } catch (e) {
    console.error("Failed to parse Risk Details JSON:", jsonText);
    throw new Error("The AI returned an invalid format for the risk details. Please try again.");
  }
};