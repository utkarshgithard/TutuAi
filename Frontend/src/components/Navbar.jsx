import React from 'react';
import { FaInfoCircle, FaTools, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/logonav.png'
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto md:px-8 px-4 py-4  flex justify-between items-center">
        <div className='flex items-center justify-center gap-4'>
          <img
            src={logo}
            className="md:h-16 h-10 animate-spin-fast "
            alt="TUTU-AI Logo"
          />
          {/* Brand / Logo */}
          <a
            href="/"
            className="md:text-3xl text- font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider "
          >
            TUTU-AI
          </a>
        </div>


        {/* Navigation Links */}
        <ul className="flex space-x-6 text-sm md:text-base font-medium">
          <li>
            <a
              href="#about"
              className="flex items-center gap-1 hover:text-blue-400 transition-all duration-300"
            >
              <FaInfoCircle className="hidden md:inline-block" /> About
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="flex items-center gap-1 hover:text-purple-400 transition-all duration-300"
            >
              <FaTools className="hidden md:inline-block" /> Services
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="flex items-center gap-1 hover:text-pink-400 transition-all duration-300"
            >
              <FaEnvelope className="hidden md:inline-block" /> Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

