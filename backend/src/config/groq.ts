/**
 * Groq AI Configuration
 * @module config/groq
 */

import Groq from 'groq-sdk';

// Groq API key from environment variables
const GROQ_API_KEY: string = process.env.GROQ_API_KEY || '';

/**
 * Groq client instance for AI operations
 * Uses LLaMA 3.1 70B model for demand forecasting
 */
export const groq: Groq | null = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

/**
 * Check if Groq API is available
 * @returns {boolean} True if API key is configured
 */
export const isGroqAvailable = (): boolean => !!GROQ_API_KEY && !!groq;

/**
 * Default model for AI operations
 */
export const GROQ_MODEL = 'llama-3.1-70b-versatile';

export default groq;
