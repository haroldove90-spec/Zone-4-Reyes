
import React from 'react';

const contacts = [
  { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' },
  { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' },
  { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' },
  { name: 'Bob Williams', avatarUrl: 'https://picsum.photos/id/103/200' },
  { name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/id/1040/200' },
  { name: 'Diana Prince', avatarUrl: 'https://picsum.photos/id/106/200' },
  { name: 'Ethan Hunt', avatarUrl: 'https://picsum.photos/id/107/200' },
];

const ContactItem: React.FC<{ name: string; avatarUrl: string }> = ({ name, avatarUrl }) => (
  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
    <div className="relative">
      <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full" />
      <div className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-z-bg-secondary dark:border-z-bg-primary-dark"></div>
    </div>
    <span className="font-semibold text-z-text-primary dark:text-z-text-primary-dark hidden lg:inline">{name}</span>
  </div>
);

const RightSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-72 pt-16 px-4 fixed right-0 h-full">
      <div className="flex flex-col space-y-2">
        <h2 className="text-z-text-secondary dark:text-z-text-secondary-dark font-semibold text-lg mb-2">Contacts</h2>
        {contacts.map((contact) => (
          <ContactItem key={contact.name} name={contact.name} avatarUrl={contact.avatarUrl} />
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
