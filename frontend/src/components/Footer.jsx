import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/user" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                <Dumbbell className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                FIT<span className="text-red-500">ZONE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering individuals to break boundaries and achieve peak performance. Modern facility, expert coaching, and an uncompromising community of champions.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Certified Trainers
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> Premium Equipment
            
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/user" className="hover:text-red-400 transition">Home Dashboard</Link>
              </li>
              <li>
                <Link to="/workout" className="hover:text-red-400 transition">Workout Routines</Link>
              </li>
              <li>
                <Link to="/trainer" className="hover:text-red-400 transition">Personal Trainers</Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-red-400 transition">Membership Plans</Link>
              </li>
            </ul>
          </div>

          {/* Member Portal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display">Members</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/profile" className="hover:text-red-400 transition">My Fitness Profile</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-400 transition">Member Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-400 transition">Create Account</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-500 hover:text-amber-400 transition">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display">Visit Us</h4>
            <ul className="space-y-3 text-xs leading-relaxed">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5 hover:scale-105" />
                <span className='hover:scale-105'>404 Iron Forge Boulevard, Metro Fitness District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span className='hover:scale-105'>Mon – Sun: 5:00 AM – 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className='hover:scale-105'>+91 9976193689 FITZONE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className='hover:scale-105'>support@fitzonegym.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FitZone Gym Management. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for elite performance with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
