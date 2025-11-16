
import { GoogleGenAI, Type } from "@google/genai";
import { Post } from '../types';

const FAKE_POSTS: Post[] = [
    {
      id: "1",
      user: { name: "John Doe", avatarUrl: "https://picsum.photos/id/1011/200" },
      timestamp: "2h ago",
      content: "Having a great time exploring the mountains! The view is breathtaking. 🏔️ #nature #travel",
      imageUrl: "https://picsum.photos/id/1015/800/600",
      likes: 128,
      commentsCount: 12,
      comments: [],
    },
    {
      id: "2",
      user: { name: "Jane Smith", avatarUrl: "https://picsum.photos/id/1025/200" },
      timestamp: "5h ago",
      content: "Just finished a new painting. What do you guys think? 🎨",
      imageUrl: "https://picsum.photos/id/10/800/600",
      likes: 256,
      commentsCount: 34,
      comments: [],
    },
    {
      id: "3",
      user: { name: "Code Master", avatarUrl: "https://picsum.photos/id/20/200" },
      timestamp: "1d ago",
      content: "Finally deployed the new feature after a week of intense coding. Feeling accomplished! #developer #codinglife",
      likes: 98,
      commentsCount: 22,
      comments: [],
    }
];

export const generateSocialFeed = async (): Promise<Post[]> => {
  // In a real scenario, you might get an API key error here. 
  // We'll return fake data as a fallback.
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Returning mock data.");
    return Promise.resolve(FAKE_POSTS);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a JSON array of 5 realistic social media posts. Each post should have an id, user (with name and avatarUrl from picsum.photos), timestamp (e.g., '2h ago'), content (a mix of activities, thoughts, and questions with hashtags), an optional imageUrl (from picsum.photos, make 2 of the 5 posts have an empty string for this), likes (random number), commentsCount (random number), and an empty comments array.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              user: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  avatarUrl: { type: Type.STRING }
                }
              },
              timestamp: { type: Type.STRING },
              content: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              likes: { type: Type.INTEGER },
              commentsCount: { type: Type.INTEGER },
              comments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    user: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        avatarUrl: { type: Type.STRING },
                      },
                    },
                    text: { type: Type.STRING },
                    timestamp: { type: Type.STRING },
                  },
                },
              },
            }
          }
        },
      },
    });

    const text = response.text.trim();
    const posts = JSON.parse(text);
    return posts;
  } catch (error) {
    console.error("Error generating social feed from Gemini:", error);
    return FAKE_POSTS;
  }
};