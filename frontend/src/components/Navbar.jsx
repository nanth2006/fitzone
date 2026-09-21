import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Dumbbell,
  Flame,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

function Navbar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/user' },
    { name: 'Workouts', path: '/workout' },
    { name: 'Trainers', path: '/trainer' },
    { name: 'Memberships', path: '/membership' },
  ];

  const isActive = (path) => {
    if (path === '/user' && (location.pathname === '/' || location.pathname === '/user')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 ">
          {/* Logo with Multi-hue Gradient */}
          <Link
            to="/user"
            className="flex items-center gap-3.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-white/20 flex items-center justify-center">
<Dumbbell className="w-6 h-6 text-red-500 transition-transform duration-300  hover:animate-spin" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-wider text-white flex items-center">
                FIT<span className="text-gradient-fire">ZONE</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-extrabold -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                ELITE PERFORMANCE
              </span>
            </div>
          </Link>

          {/* Desktop Nav with Floating Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-gradient-to-br from-red-400 to-yellow-300 p-1.5 rounded-full border border-slate-700/60 shadow-xl shadow-black/40 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-tr from-red-400 via-pink-400 to-yellow-200 text-white font-extrabold shadow-md'
                    : 'text-slate-900 hover:text-black hover:bg-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {role === 'user' ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/80 text-white hover:border-red-500/60 hover:shadow-glow-red transition-all duration-300 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                    {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : role === 'admin' ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 hover:scale-105 transition duration-300"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Console
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-red-400 border border-slate-700 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-red-500" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider btn-gradient-fire text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Join FitZone
                </Link>
                <Link
                  to="/admin/login"
                  title="Admin Portal"
                  className="p-2 text-slate-500 hover:text-amber-400 transition ml-1"
                >
                  <ShieldAlert className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {role === 'user' && (
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-xs font-black text-white shadow-sm"
              >
                {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid gap-1 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  isActive(link.path)
                    ? 'btn-gradient-fire text-white'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <span>{link.name}</span>
                {isActive(link.path) && <Flame className="w-4 h-4 text-white" />}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {role === 'user' ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs"
                >
                  <UserIcon className="w-4 h-4 text-red-500" />
                  My Fitness Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/30 font-bold text-xs text-left transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : role === 'admin' ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/30 font-bold text-xs text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Admin Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs"
                >
                  <LogIn className="w-4 h-4 text-red-500" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl btn-gradient-fire text-white font-bold text-xs shadow-lg shadow-red-600/30"
                >
                  <UserPlus className="w-4 h-4" />
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
