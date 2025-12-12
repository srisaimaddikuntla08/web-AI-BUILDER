

import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <nav className="relative z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 text-white backdrop-blur border-b border-slate-800">

      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-6 sm:h-7" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="hover:text-slate-300 transition">Home</Link>
        <Link to="/projects" className="hover:text-slate-300 transition">My Projects</Link>
        <Link to="/community" className="hover:text-slate-300 transition">Community</Link>
        <Link to="/pricing" className="hover:text-slate-300 transition">Pricing</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/auth/signIn")}
          className="px-6 py-1.5 bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md"
        >
          Get started
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden active:scale-90 transition"
          onClick={() => setMenuOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
               fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-lg flex flex-col items-center justify-center gap-10 text-xl md:hidden animate-fadeIn"
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/projects" onClick={() => setMenuOpen(false)}>My Projects</Link>
          <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>

          {/* Close Button */}
          <button
            className="p-2 bg-white text-black rounded-full hover:bg-slate-200 active:scale-95 transition"
            onClick={() => setMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Background Gradient */}
      <img
        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        alt="background gradient"
      />
    </nav>
  );
};

export default Navbar;
