
import React, { useState } from 'react';
import { MegaphoneIcon } from '../components/icons';

const AdCenterPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);

    const userPosts = [
        { id: 'p1', content: '¡Pasando un tiempo increíble explorando las montañas! La vista es impresionante. 🏔️ #naturaleza #viajes' },
        { id: 'p2', content: 'Acabo de terminar una nueva pintura. ¿Qué les parece? 🎨' },
    ];

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <MegaphoneIcon className="h-8 w-8 text-z-primary"/>
                    <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Centro de Anuncios</h1>
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold text-z-text-primary dark:text-z-text-primary-dark mb-4">Paso 1: Elige una publicación para promocionar</h2>
                        <div className="space-y-3">
                            {userPosts.map(post => (
                                <div 
                                    key={post.id}
                                    onClick={() => setSelectedPost(post.id)}
                                    className={`p-4 border dark:border-z-border-dark rounded-lg cursor-pointer ${selectedPost === post.id ? 'border-z-primary ring-2 ring-z-primary' : 'hover:bg-gray-50 dark:hover:bg-z-hover-dark'}`}
                                >
                                    <p className="text-z-text-secondary dark:text-z-text-secondary-dark">"{post.content}"</p>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setStep(2)} 
                            disabled={!selectedPost}
                            className="mt-6 w-full bg-z-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-z-dark-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Siguiente
                        </button>
                    </div>
                )}
                
                {step === 2 && (
                     <div>
                        <h2 className="text-xl font-semibold text-z-text-primary dark:text-z-text-primary-dark mb-4">Paso 2: Define tu presupuesto</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Presupuesto Diario</label>
                                <input type="number" defaultValue="100" className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5" />
                                <p className="text-xs text-z-text-secondary dark:text-z-text-secondary-dark mt-1">Alcance estimado: 1,200 - 3,500 personas por día.</p>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Duración</label>
                                <select className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5">
                                    <option>7 días</option>
                                    <option>14 días</option>
                                    <option>30 días</option>
                                </select>
                             </div>
                        </div>
                         <div className="flex space-x-2 mt-6">
                            <button onClick={() => setStep(1)} className="w-full bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-z-border-dark">
                                Atrás
                            </button>
                            <button onClick={() => setStep(3)} className="w-full bg-z-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-z-dark-blue">
                                Promocionar Ahora
                            </button>
                         </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-green-500 mb-2">¡Éxito!</h2>
                        <p className="text-z-text-primary dark:text-z-text-primary-dark">Tu publicación está en revisión. Una vez aprobada, comenzará a mostrarse a más personas en Reyes Iztacala.</p>
                        <button onClick={() => {setStep(1); setSelectedPost(null);}} className="mt-6 bg-z-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-z-dark-blue">
                            Crear otra promoción
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdCenterPage;
