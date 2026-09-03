require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined.");
}

const genAI = new GoogleGenAI({
    apiKey: geminiApiKey
});

async function generateProductDescriptionWithAi(productName, category) {

    const prompt = `
You are an expert e-commerce copywriter.

Write a catchy, SEO-friendly product description of maximum 100 words.

Product name: ${productName}
Category: ${category}

Tone: Professional yet exciting.
Return only the product description.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(`Generating AI description... Attempt ${attempt}`);

            const interaction = await genAI.interactions.create({
                model: "gemini-3.6-flash",
                input: prompt
            });

            const description = interaction.output_text;

            console.log("AI Response:", description);

            if (description) {
                return description;
            }

        } catch (error) {

            console.error(`Gemini API Error - Attempt ${attempt}:`, error);

            // Retry only for temporary server errors
            if (error.status === 503 && attempt < maxRetries) {

                console.log("Gemini is busy. Retrying in 3 seconds...");

                await new Promise(resolve => setTimeout(resolve, 3000));

                continue;
            }

            break;
        }
    }

    return "Description unavailable";
}

module.exports = {
    generateProductDescriptionWithAi
};