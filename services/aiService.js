const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiEmbedding(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values; // Returns the 768-dimension array
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("Failed to generate AI embedding");
    }
}

module.exports = { getGeminiEmbedding };