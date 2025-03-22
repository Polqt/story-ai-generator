import { GPTScript } from '@gptscript-ai/gptscript';

const gptScript = new GPTScript({
  APIKey: process.env.OPENAI_API_KEY,
});

export default gptScript;