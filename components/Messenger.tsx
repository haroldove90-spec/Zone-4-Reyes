
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage } from '../types';
import { MoreHorizontalIcon, SearchIcon } from './icons';

const initialConversations: Conversation[] = [
    {
        id: '1',
        user: { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' },
        messages: [
            { id: 'm1', text: '¡Hola! ¿Cómo estás?', timestamp: '10:30 AM', sender: 'other' },
            { id: 'm2', text: '¡Hola John! Todo bien por aquí, ¿y tú?', timestamp: '10:31 AM', sender: 'me' },
        ],
        unreadCount: 2
    },
    {
        id: '2',
        user: { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' },
        messages: [{ id: 'm3', text: 'Te envié el documento que pediste.', timestamp: 'Ayer', sender: 'other' }],
        unreadCount: 1
    },
    {
        id: '3',
        user: { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' },
        messages: [{ id: 'm4', text: 'Nos vemos mañana en la reunión.', timestamp: 'Ayer', sender: 'other' }],
        unreadCount: 2
    },
];

interface MessengerProps {
    onClose: () => void;
    unreadCount: number;
    setUnreadCount: (count: number) => void;
}

const Messenger: React.FC<MessengerProps> = ({ onClose, unreadCount, setUnreadCount }) => {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);
    
    useEffect(() => {
        if(activeConversation) {
            const newUnread = unreadCount - activeConversation.unreadCount;
            setUnreadCount(newUnread < 0 ? 0 : newUnread);
            
            setConversations(prev => prev.map(c => 
                c.id === activeConversation.id ? { ...c, unreadCount: 0 } : c
            ));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const message: ChatMessage = {
            id: new Date().toISOString(),
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me'
        };

        const updatedConversations = conversations.map(c =>
            c.id === activeConversation.id ? { ...c, messages: [...c.messages, message] } : c
        );

        setConversations(updatedConversations);
        setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id) || null);
        setNewMessage('');
    };

    return (
        <div className="fixed bottom-0 right-4 md:right-24 w-full max-w-sm h-[60vh] bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-t-lg shadow-2xl z-50 flex flex-col animate-slideInUp" style={{animationDuration: '0.3s'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b dark:border-z-border-dark flex-shrink-0">
                <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Chats</h2>
                <button onClick={onClose} className="text-2xl text-z-text-secondary dark:text-z-text-secondary-dark hover:text-z-text-primary dark:hover:text-z-text-primary-dark">&times;</button>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Conversation List / Main Chat View */}
                <div className={`flex-grow flex flex-col transition-transform duration-300 ${activeConversation ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    <div className="w-full flex-shrink-0 p-2 border-b dark:border-z-border-dark">
                         <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-z-text-secondary dark:text-z-text-secondary-dark" />
                            <input type="text" placeholder="Buscar en Messenger" className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-full py-2 pl-10 pr-4" />
                         </div>
                    </div>
                    {/* Conversation List */}
                    <div className="w-full overflow-y-auto">
                        {conversations.map(conv => (
                            <div key={conv.id} onClick={() => setActiveConversation(conv)} className="flex items-center p-2 space-x-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
                                <div className="relative">
                                    <img src={conv.user.avatarUrl} alt={conv.user.name} className="h-12 w-12 rounded-full" />
                                    <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-z-bg-secondary dark:border-z-bg-secondary-dark"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{conv.user.name}</p>
                                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-z-text-primary dark:text-z-text-primary-dark font-bold' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>{conv.messages[conv.messages.length - 1].text}</p>
                                </div>
                                {conv.unreadCount > 0 && <div className="w-3 h-3 bg-z-primary rounded-full"></div>}
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Active Chat Window (Mobile overlay, Desktop side-by-side) */}
                 <div className={`absolute md:static top-0 left-0 w-full h-full bg-z-bg-secondary dark:bg-z-bg-secondary-dark flex flex-col transition-transform duration-300 ${activeConversation ? 'translate-x-0' : 'translate-x-full'}`}>
                    {activeConversation ? (
                        <>
                            <div className="flex items-center p-3 border-b dark:border-z-border-dark flex-shrink-0">
                                 <button onClick={() => setActiveConversation(null)} className="md:hidden mr-2 text-z-text-primary dark:text-z-text-primary-dark font-bold">&lt;</button>
                                <img src={activeConversation.user.avatarUrl} alt={activeConversation.user.name} className="h-10 w-10 rounded-full" />
                                <p className="ml-3 font-bold text-z-text-primary dark:text-z-text-primary-dark">{activeConversation.user.name}</p>
                            </div>
                            <div className="flex-grow p-3 overflow-y-auto">
                                {activeConversation.messages.map(msg => (
                                    <div key={msg.id} className={`flex my-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-3 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-z-primary text-white' : 'bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-3 border-t dark:border-z-border-dark flex-shrink-0">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-full px-4 py-2 focus:outline-none"
                                />
                            </form>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full text-z-text-secondary">Selecciona una conversación</div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Messenger;
