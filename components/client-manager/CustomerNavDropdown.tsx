"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoShirt } from "react-icons/io5";

const CollapsibleButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Button */}
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full bg-transparent text-gray-400 py-3 rounded-lg focus:outline-none"
      >
        <span className='flex flex-row'>
          
        <span>
        <IoShirt size={30}/>
        </span>
        <span className="text-lg font-medium ml-5">Customers</span>
        </span>
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
        <div className="bg-transparent py-3 px-4 pl-14 space-y-2 rounded-b-lg">
          <a
            href="#"
            className="block text-gray-400 hover:text-[#03C03C] transition-colors"
          >
            List
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-[#03C03C] transition-colors"
          >
            Create
          </a>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleButton;
