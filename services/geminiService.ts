import { Product, User } from '../types';

const FAKE_SELLER: User = { id: 'seller1', name: 'Tiendita Local', avatarUrl: 'https://picsum.photos/id/75/200' };
export const FAKE_PRODUCTS: Product[] = [
    { id: 'prod1', name: 'Café de grano premium', price: '$250 MXN', imageUrl: 'https://picsum.photos/id/30/400/400', seller: FAKE_SELLER },
    { id: 'prod2', name: 'Artesanía hecha a mano', price: '$400 MXN', imageUrl: 'https://picsum.photos/id/48/400/400', seller: FAKE_SELLER },
    { id: 'prod3', name: 'Playera con diseño local', price: '$300 MXN', imageUrl: 'https://picsum.photos/id/54/400/400', seller: FAKE_SELLER },
    { id: 'prod4', name: 'Libro de autor local', price: '$150 MXN', imageUrl: 'https://picsum.photos/id/24/400/400', seller: FAKE_SELLER },
];
