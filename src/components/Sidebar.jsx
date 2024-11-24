// Sidebar.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaFileAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, closeSidebar, setActiveSection }) => {
  const [activeLink, setActiveLink] = useState('interviews');

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setActiveSection(link); // Update active section in Dashboard
  };

  return (
    <motion.div
      initial={{ x: isOpen ? 0 : '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={`fixed top-[10.6vh] left-0 w-full z-50 h-full sm:w-[16vw] sm:h-[86.8vh] flex flex-col items-center py-6 border-r bg-white text-black shadow-lg overflow-y-auto ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="flex flex-col w-full space-y-2">
        <div
          className={`flex items-center py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer ${
            activeLink === 'interviews' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 hover:text-white'
          }`}
          onClick={() => handleLinkClick('interviews')}
        >
          <FaClipboardList className="mr-2 text-xl" />
          <span>Interviews</span>
        </div>
        <div
          className={`flex items-center py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer ${
            activeLink === 'reports' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 hover:text-white'
          }`}
          onClick={() => handleLinkClick('reports')}
        >
          <FaFileAlt className="mr-2 text-xl" />
          <span>Past Reports</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
