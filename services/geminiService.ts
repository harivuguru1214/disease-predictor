import { GoogleGenAI, Type } from "@google/genai";

// Fix: Updated API key handling to use process.env.API_KEY to resolve the TypeScript error and align with coding guidelines.
// Per the guidelines, the API key is assumed to be pre-configured and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Prediction {
    disease: string;
    likelihood: number; // A score from 0.0 to 1.0
    contributingSymptoms: string[];
    prescription: string[];
    foodDiet: string[];
}

export type AnalysisResult = Prediction[];

export const analyzeSymptoms = async (symptoms: string[]): Promise<AnalysisResult> => {
    if (symptoms.length === 0) {
        throw new Error("No symptoms provided for analysis.");
    }

    const prompt = `
        You are an expert AI medical data analyst. Your task is to act as a machine learning model analyzing patient symptoms based on the "Disease Prediction Using Machine Learning" dataset from Kaggle.

        **Dataset Context:**
        - The dataset maps 132 symptoms to 41 possible diseases.
        - Your analysis must be strictly confined to the diseases in this dataset.
        - Possible Diseases: 'Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction', 'Peptic ulcer diseae', 'AIDS', 'Diabetes ', 'Gastroenteritis', 'Bronchial Asthma', 'Hypertension ', 'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)', 'Jaundice', 'Malaria', 'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Alcoholic hepatitis', 'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemmorhoids(piles)', 'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia', 'Osteoarthristis', 'Arthritis', '(vertigo) Paroymsal  Positional Vertigo', 'Acne', 'Urinary tract infection', 'Psoriasis', 'Impetigo'.

        **Task:**
        Analyze the following list of active symptoms. Provide a data-driven analysis by identifying the top 3 most likely diseases. For each predicted disease, estimate a likelihood score (from 0.0 to 1.0 representing confidence), identify which of the provided symptoms are the key contributors, provide a list of 2-4 common prescription medications, and suggest a list of 2-4 recommended food/diet items.

        **Active Symptoms:**
        ${symptoms.join(', ')}.

        **Response Format:**
        Your response MUST be a valid JSON array of objects that adheres to the schema below. The array should be ordered from most likely to least likely prediction. Do not include any other text, markdown, or explanations. The prescription and diet information is for informational purposes only and is not medical advice.
    `;
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                disease: { type: Type.STRING },
                likelihood: { type: Type.NUMBER },
                contributingSymptoms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                prescription: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                foodDiet: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ['disease', 'likelihood', 'contributingSymptoms', 'prescription', 'foodDiet']
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("The model returned an empty analysis. Please try again.");
        }
        
        // The response is expected to be a JSON string, so we parse it.
        const result: AnalysisResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the analysis from the AI model. The model returned an invalid format.");
        }
        throw new Error("Failed to get an analysis from the AI model. Please check your connection or API key.");
    }
};