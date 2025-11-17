
import { Group, Product, User, AppEvent, Fanpage } from '../types';

// FIX: Add fake products data for marketplace page.
export const FAKE_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Bicicleta de Montaña Rodada 29',
    price: '$4,500',
    imageUrl: 'https://picsum.photos/seed/bike/400/400',
    seller: { id: 'u2', name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' },
  },
  {
    id: 'prod2',
    name: 'Laptop Gamer Core i7, 16GB RAM',
    price: '$22,000',
    imageUrl: 'https://picsum.photos/seed/laptop/400/400',
    seller: { id: 'u3', name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' },
  },
  {
    id: 'prod3',
    name: 'Silla de Oficina Ergonómica',
    price: '$1,800',
    imageUrl: 'https://picsum.photos/seed/chair/400/400',
    seller: { id: 'u4', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' },
  },
  {
    id: 'prod4',
    name: 'Consola de Videojuegos Última Generación',
    price: '$13,500',
    imageUrl: 'https://picsum.photos/seed/console/400/400',
    seller: { id: 'u5', name: 'Bob Williams', avatarUrl: 'https://picsum.photos/id/103/200' },
  },
    {
    id: 'prod5',
    name: 'Cámara Fotográfica DSLR con Lente 18-55mm',
    price: '$9,800',
    imageUrl: 'https://picsum.photos/seed/camera/400/400',
    seller: { id: 'u6', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/id/1040/200' },
  },
  {
    id: 'prod6',
    name: 'Tenis para Correr, Talla 27 MX',
    price: '$1,200',
    imageUrl: 'https://picsum.photos/seed/shoes/400/400',
    seller: { id: 'u7', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/id/1067/200' },
  },
  {
    id: 'prod7',
    name: 'Juego de Herramientas 120 piezas',
    price: '$950',
    imageUrl: 'https://picsum.photos/seed/tools/400/400',
    seller: { id: 'u8', name: 'Bruce Wayne', avatarUrl: 'https://picsum.photos/id/1074/200' },
  },
  {
    id: 'prod8',
    name: 'Smartphone 128GB, Desbloqueado',
    price: '$7,300',
    imageUrl: 'https://picsum.photos/seed/phone/400/400',
    seller: { id: 'u9', name: 'Clark Kent', avatarUrl: 'https://picsum.photos/id/1084/200' },
  },
];