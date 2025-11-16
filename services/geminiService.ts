
import { GoogleGenAI, Type } from "@google/genai";
import { Post } from '../types';

const FAKE_POSTS: Post[] = [
    {
      id: "1",
      user: { name: "Juan Pérez", avatarUrl: "https://picsum.photos/id/1011/200" },
      timestamp: "hace 2h",
      content: "¡Pasando un tiempo increíble explorando las montañas! La vista es impresionante. 🏔️ #naturaleza #viajes",
      imageUrl: "https://picsum.photos/id/1015/800/600",
      likes: 128,
      commentsCount: 12,
      comments: [],
    },
    {
      id: "2",
      user: { name: "Ana García", avatarUrl: "https://picsum.photos/id/1025/200" },
      timestamp: "hace 5h",
      content: "Acabo de terminar una nueva pintura. ¿Qué les parece? 🎨",
      imageUrl: "https://picsum.photos/id/10/800/600",
      likes: 256,
      commentsCount: 34,
      comments: [],
    },
    {
      id: "3",
      user: { name: "Carlos Dev", avatarUrl: "https://picsum.photos/id/20/200" },
      timestamp: "hace 1d",
      content: "Finalmente desplegué la nueva funcionalidad después de una semana de programación intensa. ¡Me siento realizado! #desarrollador #vidadeveloper",
      likes: 98,
      commentsCount: 22,
      comments: [],
    }
];

export const generateSocialFeed = async (): Promise<Post[]> => {
  // In a real scenario, you might get an API key error here. 
  // We'll return fake data as a fallback.
  if (!process.env.API_KEY) {
    console.warn("API_KEY no encontrada. Devolviendo datos de prueba.");
    return Promise.resolve(FAKE_POSTS);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Genera un array JSON válido de 5 publicaciones de redes sociales realistas en español. Cada publicación debe seguir el esquema proporcionado. Asegúrate de que todos los valores de cadena, especialmente en el campo 'content', estén correctamente escapados para crear un JSON válido. Cada publicación debe tener un id, user (con name y avatarUrl de picsum.photos), timestamp (p. ej., 'hace 2h'), content (una mezcla de actividades, pensamientos y preguntas con hashtags), un imageUrl opcional (de picsum.photos, con 2 de las 5 publicaciones teniendo una cadena vacía para este valor), likes (número aleatorio), commentsCount (número aleatorio), y un array de comments vacío.",
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
    console.error("Error al generar el feed social desde Gemini:", error);
    return FAKE_POSTS;
  }
};