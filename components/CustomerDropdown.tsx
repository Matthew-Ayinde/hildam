"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CollapsibleButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Button */}
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full bg-[#03C03C] text-white py-3 px-4 rounded-lg shadow-md focus:outline-none"
      >
        <span className="text-lg font-medium">Customers</span>
        {isOpen ? (
          <FaChevronUp className="w-5 h-5" />
        ) : (
          <FaChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-100 py-3 px-4 space-y-2 rounded-b-lg">
          <a
            href="#"
            className="block text-gray-700 hover:text-[#03C03C] transition-colors"
          >
            Link 1
          </a>
          <a
            href="#"
            className="block text-gray-700 hover:text-[#03C03C] transition-colors"
          >
            Link 2
          </a>
          <a
            href="#"
            className="block text-gray-700 hover:text-[#03C03C] transition-colors"
          >
            Link 3
          </a>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleButton;
