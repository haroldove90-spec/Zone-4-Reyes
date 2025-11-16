
import { Group, Product, User, AppEvent, Fanpage } from '../types';

export const FAKE_GROUPS: Group[] = [
    { id: 'g1', name: 'Vecinos de Reyes Iztacala', description: 'Un grupo para conectar con tus vecinos, compartir noticias y organizar eventos locales.', memberCount: 254, coverUrl: 'https://picsum.photos/id/1016/1600/400', avatarUrl: 'https://picsum.photos/id/101/200', isPrivate: false },
    { id: 'g2', name: 'Amantes del Cine y Series', description: 'Para discutir los últimos estrenos, teorías de fans y clásicos del cine.', memberCount: 88, coverUrl: 'https://picsum.photos/id/122/1600/400', avatarUrl: 'https://picsum.photos/id/211/200', isPrivate: true },
];

const FAKE_SELLER: User = { id: 'seller1', name: 'Tiendita Local', avatarUrl: 'https://picsum.photos/id/75/200' };
export const FAKE_PRODUCTS: Product[] = [
    { id: 'prod1', name: 'Café de grano premium', price: '$250 MXN', imageUrl: 'https://picsum.photos/id/30/400/400', seller: FAKE_SELLER },
    { id: 'prod2', name: 'Artesanía hecha a mano', price: '$400 MXN', imageUrl: 'https://picsum.photos/id/48/400/400', seller: FAKE_SELLER },
    { id: 'prod3', name: 'Playera con diseño local', price: '$300 MXN', imageUrl: 'https://picsum.photos/id/54/400/400', seller: FAKE_SELLER },
    { id: 'prod4', name: 'Libro de autor local', price: '$150 MXN', imageUrl: 'https://picsum.photos/id/24/400/400', seller: FAKE_SELLER },
];

const FAKE_USER_ORGANIZER: User = { id: 'organizer1', name: 'Comité Vecinal', avatarUrl: 'https://picsum.photos/id/88/200'};
const FAKE_FANPAGE_ORGANIZER: Fanpage = { id: 'fp1', name: 'El Rincón del Café', category: 'Cafetería', bio: '', ownerEmail: '', avatarUrl: 'https://picsum.photos/id/55/200', coverUrl: ''};

export const FAKE_EVENTS: AppEvent[] = [
    { id: 'e1', name: 'Kermés Anual de la Colonia', description: '¡Ven a disfrutar con toda tu familia! Tendremos antojitos, juegos mecánicos y música en vivo.', date: 'SÁB, 25 NOV, 12:00 PM', location: 'Parque Central de Reyes Iztacala', coverUrl: 'https://picsum.photos/id/1019/1600/900', organizer: FAKE_USER_ORGANIZER, attendees: 125 },
    { id: 'e2', name: 'Noche de Acústico', description: 'Disfruta de una velada con música acústica en vivo y el mejor café de la zona.', date: 'VIE, 1 DIC, 8:00 PM', location: 'El Rincón del Café', coverUrl: 'https://picsum.photos/id/1082/1600/900', organizer: FAKE_FANPAGE_ORGANIZER, attendees: 40 },
];