'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] flex flex-wrap items-center justify-between mx-auto p-4 sm:px-6 lg:px-8 h-20">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
          <div className="w-8 h-8 rounded-full bg-[#b50a0a] flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
             {/* CenterKick SVG Logo Placeholder (Using a stylistic 'C' or soccer ball motif) */}
             <svg className="w-4 h-4 text-white font-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-2.49 0-4.5-2.01-4.5-4.5S8.51 7.5 11 7.5s4.5 2.01 4.5 4.5c0 .34-.04.68-.11 1h-2.12c.15-.31.23-.65.23-1 0-1.38-1.12-2.5-2.5-2.5S8.5 10.62 8.5 12 9.62 14.5 11 14.5c.66 0 1.25-.26 1.7-.68l1.45 1.45c-.83.76-1.92 1.23-3.15 1.23z"/>
             </svg>
          </div>
          <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 group-hover:text-[#b50a0a] transition-colors">
            CenterKick
          </span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <div className="flex md:hidden order-2">
          <button 
             onClick={() => setIsOpen(!isOpen)} 
             className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* DESKTOP LINKS */}
        <div className={`items-center justify-center w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'} absolute md:relative top-20 md:top-0 left-0 bg-white md:bg-transparent shadow-md md:shadow-none border-t md:border-0 border-gray-100`}>
          <ul className="flex flex-col p-6 md:p-0 mt-0 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row text-sm">
            <li>
              <Link href="/" className="block py-2 text-[#b50a0a] font-bold" aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/news" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">News</Link>
            </li>
            <li>
              <Link href="/athletes" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Athletes</Link>
            </li>
            <li>
              <Link href="/transfer-focus" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Transfer Focus</Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">About us</Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Contact us</Link>
            </li>
            <li className="md:hidden mt-4">
              <Link href="/login" className="block w-full text-center text-white bg-[#b50a0a] hover:bg-[#990000] font-bold rounded text-sm px-6 py-3 transition-colors">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA BUTTON */}
        <div className="hidden md:flex order-3">
          <Link href="/login">
            <button type="button" className="text-white bg-[#b50a0a] hover:bg-[#990000] font-bold rounded-md text-xs tracking-widest uppercase px-6 py-2.5 shadow-sm transition-all hover:shadow-md">
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
