import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, ApiResponseError, QuantitativeClassificationResult } from '../types';

/**
 * Classifies the text content within a given JSON string using the Gemini API for quantitative experimental data.
 *
 * @param jsonString The JSON string to analyze.
 * @returns A promise that resolves to the quantitative classification result or rejects with an error.
 */
export const classifyJsonText = async (jsonString: string): Promise<QuantitativeClassificationResult> => {
  // Ensure the API key is available. This is provided by the environment.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set. Please ensure it's configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are an expert Scientific Data Curator specialized in Biochemistry and Enzymology.
Your task is to analyze content segments (text paragraphs or figure captions) from scientific papers and classify whether they contain QUANTITATIVE EXPERIMENTAL DATA.

Target Data Definition (Look for these):
- Kinetic parameters: Kcat, Km, Vmax, specific activity (U/mg), turnover rates.
- Physicochemical properties: Melting temperature (Tm), Glass transition (Tg), Crystallinity (%).
- Experimental Conditions paired with Results: pH values, Temperatures (°C), Buffer concentrations linked to activity/stability.
- Quantitative Results: "30% increase", "fold change", "degradation rate", "yield of 50%", "concentration of 100 nM".
- Statistical markers linked to data: p-values, error margins (± SD/SEM), n=3.

Exclusions (Classify as FALSE):
- General introductory text or broad claims without numbers ("Enzymes are efficient").
- Methodology descriptions without results ("We used HPLC to measure...").
- Citations or references descriptions.
- Acknowledgments or author affiliations.

Your output must be a strict JSON list classifying each input item.
Prioritize RECALL: If you are unsure but it looks like a result, classify as TRUE.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      has_quantitative_data: {
        type: Type.BOOLEAN,
        description: 'True if the content contains quantitative experimental data, false otherwise.',
      },
      reasoning: {
        type: Type.STRING,
        description: 'A brief explanation for the classification (why it is true or false).',
      },
    },
    required: ['has_quantitative_data'],
    propertyOrdering: ['has_quantitative_data', 'reasoning'],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using 'gemini-2.5-flash' for text analysis
      contents: [{ parts: [{ text: `Analyze the following JSON content for quantitative experimental data. Focus your analysis on the 'text_content' field, and within 'text_segments' and 'artifacts' if present, to determine if the document contains such data. Provide a brief reasoning for your classification:\n\n${jsonString}` }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const textResponse = response.text.trim();
    if (!textResponse) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Attempt to parse the JSON response from Gemini
    let classification: QuantitativeClassificationResult;
    try {
      classification = JSON.parse(textResponse) as QuantitativeClassificationResult;
    } catch (parseError) {
      console.error("Failed to parse Gemini's JSON response:", textResponse, parseError);
      throw new Error(`Invalid JSON response from API: ${textResponse}`);
    }

    // Validate the parsed response against our expected structure
    if (typeof classification.has_quantitative_data !== 'boolean') {
      throw new Error("Missing or invalid 'has_quantitative_data' in API response.");
    }

    return classification;

  } catch (error: any) {
    console.error("Error classifying JSON text:", error);
    let errorMessage: ApiResponseError = {
      message: 'An unexpected error occurred during classification.'
    };

    if (error.response && error.response.status) {
      errorMessage.message = `API Error ${error.response.status}: ${error.response.statusText}`;
      if (error.response.data && error.response.data.error) {
        errorMessage.details = error.response.data.error.message;
      }
    } else if (error.message) {
      errorMessage.message = error.message;
    }

    throw errorMessage;
  }
};