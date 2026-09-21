import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fillAdmin = () => {
    setFormData({
      email: 'nanthakumar2006geetha02@gmail.com',
      password: 'admin123',
    });
    toast.info('Admin credentials auto-filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.loginUser(formData);

      // Check if user is admin
      const isAdmin = data.role === 'admin' || data.user?.role === 'admin' || data.user?.email === 'nanthakumar2006geetha02@gmail.com';

      if (isAdmin) {
        login(data.token, { ...data.user, role: 'admin' }, 'admin');
        toast.success(`Welcome Director Nanthakumar! Opening Admin Dashboard...`);
        navigate('/admin/dashboard');
      } else {
        login(data.token, data.user, 'user');
        toast.success(`Welcome back, ${data.user.name || 'Athlete'}!`);
        navigate('/user');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email and password.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-red-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2 relative z-10">
        <Link to="/user" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <Dumbbell className="w-6 h-6 text-white transform -rotate-45" />
          </div>
          <span className="font-display font-extrabold text-3xl tracking-wider text-white">
            FIT<span className="text-red-500">ZONE</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 font-medium">Access your personal workout plans and trainer portal</p>
      </div>

      {/* Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full border border-slate-800 shadow-2xl relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Account Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in as Member or Administrator</p>
          </div>

          <button
            type="button"
            onClick={fillAdmin}
            className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
            title="Auto-fill Admin Account"
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Admin Demo
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="email@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Don't have a membership account?{' '}
            <Link to="/register" className="text-red-400 font-semibold hover:underline">
              Register
            </Link>
          </p>

          <p className="text-xs text-slate-500">
            Dedicated Staff Portal:{' '}
            <Link to="/admin/login" className="text-amber-400 font-semibold hover:underline">
              Admin Login Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
