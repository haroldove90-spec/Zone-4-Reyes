
import { GoogleGenAI, Type } from "@google/genai";
import { Post, Group, Product, User, Event, Fanpage } from '../types';

export const FAKE_GROUPS: Group[] = [
    { id: 'g1', name: 'Vecinos de Reyes Iztacala', description: 'Un grupo para conectar con tus vecinos, compartir noticias y organizar eventos locales.', memberCount: 254, coverUrl: 'https://picsum.photos/id/1016/1600/400', avatarUrl: 'https://picsum.photos/id/101/200', isPrivate: false },
    { id: 'g2', name: 'Amantes del Cine y Series', description: 'Para discutir los últimos estrenos, teorías de fans y clásicos del cine.', memberCount: 88, coverUrl: 'https://picsum.photos/id/122/1600/400', avatarUrl: 'https://picsum.photos/id/211/200', isPrivate: true },
];

const FAKE_SELLER: User = { name: 'Tiendita Local', avatarUrl: 'https://picsum.photos/id/75/200' };
export const FAKE_PRODUCTS: Product[] = [
    { id: 'prod1', name: 'Café de grano premium', price: '$250 MXN', imageUrl: 'https://picsum.photos/id/30/400/400', seller: FAKE_SELLER },
    { id: 'prod2', name: 'Artesanía hecha a mano', price: '$400 MXN', imageUrl: 'https://picsum.photos/id/48/400/400', seller: FAKE_SELLER },
    { id: 'prod3', name: 'Playera con diseño local', price: '$300 MXN', imageUrl: 'https://picsum.photos/id/54/400/400', seller: FAKE_SELLER },
    { id: 'prod4', name: 'Libro de autor local', price: '$150 MXN', imageUrl: 'https://picsum.photos/id/24/400/400', seller: FAKE_SELLER },
];

const FAKE_USER_ORGANIZER: User = { name: 'Comité Vecinal', avatarUrl: 'https://picsum.photos/id/88/200'};
const FAKE_FANPAGE_ORGANIZER: Fanpage = { id: 'fp1', name: 'El Rincón del Café', category: 'Cafetería', bio: '', ownerEmail: '', avatarUrl: 'https://picsum.photos/id/55/200', coverUrl: ''};

export const FAKE_EVENTS: Event[] = [
    { id: 'e1', name: 'Kermés Anual de la Colonia', description: '¡Ven a disfrutar con toda tu familia! Tendremos antojitos, juegos mecánicos y música en vivo.', date: 'SÁB, 25 NOV, 12:00 PM', location: 'Parque Central de Reyes Iztacala', coverUrl: 'https://picsum.photos/id/1019/1600/900', organizer: FAKE_USER_ORGANIZER, attendees: 125 },
    { id: 'e2', name: 'Noche de Acústico', description: 'Disfruta de una velada con música acústica en vivo y el mejor café de la zona.', date: 'VIE, 1 DIC, 8:00 PM', location: 'El Rincón del Café', coverUrl: 'https://picsum.photos/id/1082/1600/900', organizer: FAKE_FANPAGE_ORGANIZER, attendees: 40 },
];

const FAKE_POSTS: Post[] = [
    {
      id: "1",
      user: { name: "Juan Pérez", avatarUrl: "https://picsum.photos/id/1011/200" },
      timestamp: "hace 2h",
      content: "¡Pasando un tiempo increíble explorando las montañas! La vista es impresionante. 🏔️ #naturaleza #viajes",
      media: [{ type: 'image', url: "https://picsum.photos/id/1015/800/600" }],
      likes: 128,
      commentsCount: 12,
      comments: [],
      type: 'standard',
      format: 'post',
    },
    {
      id: "reel-1",
      user: { name: "Sofia Reel", avatarUrl: "https://picsum.photos/id/1012/200" },
      timestamp: "hace 3h",
      content: "Un pequeño clip del atardecer de hoy. ¡Mágico! ✨ #atardecer #reel",
      media: [{ type: 'video', url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }],
      likes: 345,
      commentsCount: 25,
      comments: [],
      type: 'standard',
      format: 'reel',
    },
    {
      id: "fanpage-post-1",
      user: { name: "Juan Pérez", avatarUrl: "https://picsum.photos/id/1011/200" },
      timestamp: "hace 4h",
      content: "¡Nuestro nuevo Frappé de Caramelo ya está aquí! Ven a probarlo a El Rincón del Café. ☕️",
      media: [{ type: 'image', url: "https://picsum.photos/id/225/800/600" }],
      likes: 95,
      commentsCount: 18,
      comments: [],
      type: 'standard',
      format: 'post',
      fanpage: { id: 'fp1', name: 'El Rincón del Café', avatarUrl: 'https://picsum.photos/id/55/200' },
    },
    {
      id: "report-1",
      user: { name: "Vecino Preocupado", avatarUrl: "https://picsum.photos/id/40/200" },
      timestamp: "hace 30m",
      content: "Se reporta una fuga de agua importante en la esquina de Av. Principal y Calle 2. ¡Las autoridades ya fueron notificadas pero se recomienda tomar precauciones! #FugaDeAgua #ReyesIztacala",
      media: [{ type: 'image', url: "https://picsum.photos/id/119/800/600" }],
      likes: 45,
      commentsCount: 8,
      comments: [],
      type: 'report',
      format: 'post',
    },
    {
      id: "2",
      user: { name: "Ana García", avatarUrl: "https://picsum.photos/id/1025/200" },
      timestamp: "hace 5h",
      content: "Acabo de terminar una nueva pintura. ¿Qué les parece? 🎨",
      media: [{ type: 'image', url: "https://picsum.photos/id/10/800/600" }],
      likes: 256,
      commentsCount: 34,
      comments: [],
      type: 'standard',
      format: 'post',
    },
    {
      id: "3",
      user: { name: "Carlos Dev", avatarUrl: "https://picsum.photos/id/20/200" },
      timestamp: "hace 1d",
      content: "Finalmente desplegué la nueva funcionalidad después de una semana de programación intensa. ¡Me siento realizado! #desarrollador #vidadeveloper",
      likes: 98,
      commentsCount: 22,
      comments: [],
      type: 'standard',
      format: 'post',
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
      contents: "Genera un array JSON válido de 6 publicaciones de redes sociales realistas en español. Cada publicación debe seguir el esquema proporcionado. Asegúrate de que todos los valores de cadena, especialmente en el campo 'content', estén correctamente escapados para crear un JSON válido. Cada publicación debe tener un id, user (con name y avatarUrl de picsum.photos), timestamp (p. ej., 'hace 2h'), content (una mezcla de actividades, pensamientos y preguntas con hashtags), un imageUrl opcional (de picsum.photos, con 2 de las 6 publicaciones teniendo una cadena vacía para este valor), likes (número aleatorio), commentsCount (número aleatorio), y un array de comments vacío.",
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
    const postsFromApi = JSON.parse(text);

    // Adapt API response to new Post structure
    const adaptedPosts: Post[] = postsFromApi.map((p: any) => ({
        ...p,
        media: p.imageUrl ? [{ type: 'image', url: p.imageUrl }] : [],
        imageUrl: undefined, // remove old property
        type: 'standard',
        format: 'post',
    }));
    
    return adaptedPosts;
  } catch (error) {
    console.error("Error al generar el feed social desde Gemini:", error);
    return FAKE_POSTS;
  }
};