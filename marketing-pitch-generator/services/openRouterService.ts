

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Narrative, SocialMediaPosts } from "../types";

const narrativeSchema = {
    type: Type.OBJECT,
    properties: {
        hook: {
            type: Type.STRING,
            description: "A compelling opening to grab attention. Response should be between 30 and 50 words."
        },
        emotion: {
            type: Type.STRING,
            description: "The core emotion the narrative should evoke (e.g., frustration, hope). Response should be between 30 and 50 words."
        },
        conflict: {
            type: Type.STRING,
            description: "The problem or pain point the product addresses. Response should be between 30 and 50 words."
        },
        resolution: {
            type: Type.STRING,
            description: "How the product solves the conflict and provides a better future. Response should be between 30 and 50 words."
        },
        cta: {
            type: Type.STRING,
            description: "A clear and persuasive call to action for the audience. Response should be between 30 and 50 words."
        },
    },
    required: ["hook", "emotion", "conflict", "resolution", "cta"]
};

const socialMediaPostsSchema = {
    type: Type.OBJECT,
    properties: {
        youtube: {
            type: Type.STRING,
            description: "A detailed and engaging YouTube video description. IMPORTANT: Use line breaks to create separate paragraphs for a summary, key points (if applicable), and a concluding section with links and hashtags."
        },
        instagram: {
            type: Type.STRING,
            description: "A visually-focused Instagram caption. IMPORTANT: Use emojis and multiple short paragraphs with line breaks for readability. End with a separated block of relevant hashtags."
        },
        linkedin: {
            type: Type.STRING,
            description: "A professional and insightful LinkedIn post. IMPORTANT: Structure the post with short paragraphs (2-3 sentences each) and use bullet points for lists to make it scannable. Focus on the business problem and solution. Use professional hashtags."
        },
        facebook: {
            type: Type.STRING,
            description: "A friendly and shareable Facebook post. IMPORTANT: Use ample whitespace and line breaks to make the post easy to read on mobile. Ask a question to encourage engagement and include relevant hashtags."
        },
        x: {
            type: Type.STRING,
            description: "A concise and punchy post for X (formerly Twitter). Keep it short, use 1-3 key hashtags, and have a clear call to action. Use line breaks sparingly if needed to separate thoughts within the character limit."
        },
    },
    required: ["youtube", "instagram", "linkedin", "facebook", "x"]
};


const createAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateNarrative = async (description: string): Promise<Narrative> => {
    try {
        const ai = createAiClient();
        const prompt = `Based on the following product/idea description, generate a compelling marketing pitch narrative. 
        Description: "${description}"
        
        Create a narrative with these five elements: a hook, an emotion to target, a conflict, a resolution, and a call to action.
        For each of the five elements (hook, emotion, conflict, resolution, CTA), please ensure the response is concise and between 30 and 50 words.
        Your response must be in JSON format.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: narrativeSchema,
            },
        });

        const jsonText = response.text.trim();
        const narrative = JSON.parse(jsonText) as Narrative;
        return narrative;

    } catch (error) {
        console.error("Error generating narrative:", error);
        throw new Error("Failed to generate marketing pitch. Please try again.");
    }
};

export const generateMarketingImage = async (narrative: Narrative, description: string): Promise<string> => {
    try {
        const ai = createAiClient();
        const prompt = `Create a visually compelling 5-panel collage that tells a continuous story with consistent characters. The style must be cinematic, photorealistic, and feature real human faces. The collage illustrates a narrative based on the user's idea and the provided pitch.

**CRITICAL INSTRUCTION: The same main character(s) must appear in each relevant panel to show a clear story progression. Maintain their appearance (clothing, features, etc.) as much as possible.**

**CRITICAL INSTRUCTION: Each of the 5 panels must be a unique and distinct image. Do not repeat compositions, poses, or backgrounds. Each panel must clearly advance the story to the next stage, showing a different action or emotional state.**

The overall theme is from this description: "${description}".
The story follows this narrative structure:

- **Panel 1 (Hook):** Start the story. Visually represent "${narrative.hook}". Introduce the main character and the initial situation. This should be an attention-grabbing scene.
- **Panel 2 (Emotion & Conflict):** Show the character experiencing the problem. Depict the core conflict from "${narrative.conflict}" and evoke the emotion of "${narrative.emotion}". This panel should clearly show the character's struggle or pain point.
- **Panel 3 (Discovery):** Bridge the conflict and resolution. Show the character or someone else discovering the solution. This could be finding the product, seeing a crucial detail, or having the 'aha' moment that leads to the solution.
- **Panel 4 (Resolution):** Show the solution in action. Visually represent "${narrative.resolution}". The main character should be shown actively using or benefiting from the solution, looking relieved, empowered, or happy.
- **Panel 5 (Call to Action):** Conclude the story with a powerful final image. Based on "${narrative.cta}", create a symbolic, photorealistic image showing the positive final outcome or the next step. For example, the character confidently moving forward in their new, improved state.

Maintain a cohesive art style across all panels. Avoid text and cartoonish elements.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in response.");

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate marketing image.");
    }
};

export const generateMarketingVideo = async (narrative: Narrative): Promise<string> => {
    try {
        const ai = createAiClient();
        const prompt = `Create a short, dynamic, and engaging 10-second marketing video for the following pitch.
        Hook: "${narrative.hook}".
        Emotion to convey: "${narrative.emotion}".
        The story starts with the conflict: "${narrative.conflict}".
        And finds its solution in the resolution: "${narrative.resolution}".
        End with a powerful visual that reinforces the call to action: "${narrative.cta}".
        The video should be cinematic and professional. No text overlays.`;
        
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        // Fetch the video data securely
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file. Status: ${videoResponse.status}`);
        }
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video:", error);
        throw error; // Re-throw the original error to be caught in the component
    }
};

export const generateSocialMediaPosts = async (narrative: Narrative, description: string): Promise<SocialMediaPosts> => {
    try {
        const ai = createAiClient();
        const prompt = `You are a social media marketing expert. Based on the user's business idea and the provided marketing narrative, generate tailored posts for YouTube, Instagram, LinkedIn, Facebook, and X (Twitter). 
        
        **CRITICAL: The posts MUST be well-formatted with appropriate line breaks, paragraphs, and spacing for each specific platform to ensure readability. Do not output a single block of text.**
        
        The posts should be engaging, platform-appropriate, and include relevant hashtags.

        **User's Business Idea:** "${description}"

        **Marketing Narrative:**
        - Hook: ${narrative.hook}
        - Emotion: ${narrative.emotion}
        - Conflict: ${narrative.conflict}
        - Resolution: ${narrative.resolution}
        - Call to Action: ${narrative.cta}

        Now, create the social media posts in the required JSON format, adhering to the formatting instructions in the schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: socialMediaPostsSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SocialMediaPosts;

    } catch (error) {
        console.error("Error generating social media posts:", error);
        throw new Error("Failed to generate social media posts. Please try again.");
    }
};