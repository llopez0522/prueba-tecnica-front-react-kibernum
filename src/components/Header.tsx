import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600">Zurich</span>
            <span className="text-2xl font-light text-gray-700"> Tasks</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
