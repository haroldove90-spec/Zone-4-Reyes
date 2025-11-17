
import React from 'react';
import { Product } from '../types';
import { FAKE_PRODUCTS } from '../services/geminiService';
import { SearchIcon } from '../components/icons';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md overflow-hidden group">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
        <div className="p-3">
            <h3 className="font-bold text-lg text-z-text-primary dark:text-z-text-primary-dark">{product.price}</h3>
            <p className="text-z-text-secondary dark:text-z-text-secondary-dark truncate">{product.name}</p>
        </div>
    </div>
);


const MarketplacePage: React.FC = () => {
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-4">Marketplace</h1>
                
                <div className="relative mb-6">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-z-text-secondary dark:text-z-text-secondary-dark" />
                  <input type="text" placeholder="Buscar productos" className="w-full bg-z-bg-secondary dark:bg-z-hover-dark rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-z-primary outline-none" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FAKE_PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default MarketplacePage;