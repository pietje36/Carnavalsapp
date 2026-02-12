
import { GoogleGenAI, Type } from "@google/genai";
import { Question, GameType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCarnavalQuestions(type: GameType): Promise<Question[]> {
  const model = 'gemini-3-flash-preview';
  
  const systemPrompt = `Je bent een vrolijke carnavalsvierder en een expert in het maken van educatieve vragen voor kinderen in groep 8 (11-12 jaar oud). 
  Je maakt vragen in het thema Carnaval (Brabants/Limburgs).
  
  Voor 'math' (rekenen): Focus op breuken, procenten, hoofdrekenen en verhaaltjessommen.
  Voor 'language' (taal): Focus op spelling, spreekwoorden en grammatica.
  Voor 'typing' (typen): Genereer een lijst met 10 uitdagende carnavalswoorden.
  Voor 'hangman' (galgje): Genereer 5 unieke carnavalswoorden van minimaal 6 letters.
  Voor 'quiz' (algemene kennis): Focus op tradities, de Raad van Elf, de Prins, de 11e van de 11e, en de betekenis van carnavalskleuren en symbolen.`;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING },
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING }
      },
      required: ["id", "type", "question", "options", "correctAnswer", "explanation"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Genereer 5 unieke items voor de categorie ${type} voor groep 8 in het thema Carnaval.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const questions: Question[] = JSON.parse(response.text);
    return questions;
  } catch (error) {
    console.error("Fout bij het genereren van vragen:", error);
    return getFallbackQuestions(type);
  }
}

function getFallbackQuestions(type: GameType): Question[] {
  if (type === 'quiz') {
    return [
      {
        id: 'q1',
        type: 'quiz',
        question: "Op welke datum begint het carnavalsseizoen officieel?",
        options: ["1 januari", "11 november", "25 december", "1 april"],
        correctAnswer: "11 november",
        explanation: "Het seizoen begint op de 11e van de 11e om 11:11 uur, omdat 11 het 'gekkengetal' is."
      }
    ];
  }
  if (type === 'math') {
    return [
      {
        id: 'f1',
        type: 'math',
        question: "Een praalwagen is 12 meter lang. Voor de decoratie is 25% van de wagen bedekt met bloemen. Hoeveel meter is dat?",
        options: ["2 meter", "3 meter", "4 meter", "6 meter"],
        correctAnswer: "3 meter",
        explanation: "25% is een kwart. 12 gedeeld door 4 is 3 meter."
      }
    ];
  }
  if (type === 'typing' || type === 'hangman') {
     return [
       { id: 't1', type: type, question: "Polonaise", options: [], correctAnswer: "Polonaise", explanation: "Gezellig achter elkaar aan lopen!" },
       { id: 't2', type: type, question: "Dweilorkest", options: [], correctAnswer: "Dweilorkest", explanation: "Muziek die door de straten dweilt." }
     ];
  }
  return [
    {
      id: 'f2',
      type: 'language',
      question: "Wat is het meervoud van 'dweilorkest'?",
      options: ["dweilorkesten", "dweilorkestjes", "dweilorkests", "dweilorkesters"],
      correctAnswer: "dweilorkesten",
      explanation: "Het meervoud van orkest is orkesten, dus dweilorkesten."
    }
  ];
}
