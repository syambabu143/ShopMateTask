require("dotenv").config();
const{GoogleGenAI} = require("@google/genai");

const geminiApiKey=process.env.GEMINI_API_KEY;
if(!geminiApiKey){
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenAI({apiKey: geminiApiKey});

async function generateProductDescriptionWithAi(productName,category) {
    const prompt="You are an expert e-commerce copywriter.\n" +
        "Write a catchy, SEO-fridenly product description (max" +
        "100 words) for: " + productName + "\n" +
        "Under the category: " + category + "\n" +
        "Tone: Professional yet exciting.";
    try{
        const result = await genAI.models.generateContent(
            {
                model: "gemini-3.6-flash",
                
                contents: prompt
            });
        return result.text;
    }catch (error){
        console.error("Error generating product description:", error);
        return "Description unavailable";
    }

}
module.exports={
    generateProductDescriptionWithAi,
}

