import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Gemini API Key is missing!');
}

const genAI = new GoogleGenerativeAI(apiKey!);

export function startNewGeminiChatSession() {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).startChat({});
}

export async function sendMessageInChat(chatSession: any, prompt: string): Promise<string> {
  try {
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
