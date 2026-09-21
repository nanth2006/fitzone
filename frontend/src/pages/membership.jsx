import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  UserCheck,
  X,
  ArrowRight,
  Flame,
  Crown,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Membership() {
  const { user, token, role, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);

  useEffect(() => {
    api.getMemberships()
      .then((data) => setMemberships(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err.message || 'Failed to load membership plans'))
      .finally(() => setLoading(false));
  }, [toast]);
  useEffect(() => {
    if (!successModalData) return;
    const timer = setTimeout(() => {
      setSuccessModalData(null);
    }, 3000); // modal visible for 4 seconds
    return () => clearTimeout(timer);
  }, [successModalData]);

  const handleSubscribe = async (plan) => {
    if (role !== 'user' || !token) {
      toast.info('Please sign in or register to choose a membership plan.');
      navigate('/login');
      return;
    }

    setSubscribingId(plan._id);
    try {
      const res = await api.subscribeMembership(plan._id, token);

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#10b981', '#7c3aed', '#ffffff'],
        });
      } catch (e) {}

      updateUser(res.user);
      setSuccessModalData({
        planName: plan.name,
        trainer: res.user?.trainer,
        user: res.user,
      });

      toast.success(`Successfully activated ${plan.name}!`);
      
    } catch (err) {
      toast.error(err.message || 'Failed to activate membership');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 via-rose-600/20 to-amber-500/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider hover:scale-105 translate-x-1">
            <Crown className="w-3.5 h-3.5 text-amber-400 hover:animate-pulse" /> Membership Tiers
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display">
            Invest in <span className="text-gradient-fire">Peak Performance</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            All tiers include unrestricted floor access, automatic personal coach matching, and digital performance tracking.
          </p>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-[2.5rem] h-96 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : memberships.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-[2.5rem] border border-slate-800 space-y-3">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white font-display">No membership plans currently available</h3>
            <p className="text-xs text-slate-400">Please check back soon or consult gym staff.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {memberships.map((m) => {
              const isCurrentPlan = user?.membership?._id === m._id;
              const isSubscribing = subscribingId === m._id;

              return (
                <div
                  key={m._id}
                  className={`rounded-[2.5rem] p-8 transition-all duration-300 relative flex flex-col justify-between ${
                    m.popular
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/70 border-2 border-red-500 shadow-2xl shadow-red-600/30 lg:-translate-y-3 z-10'
                      : 'gradient-card-border hover:border-slate-700 shadow-xl'
                  }`}
                >
                  {/* Badge */}
                  {(m.popular || m.badge) && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full btn-gradient-fire text-white font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      {m.badge || (m.popular ? 'Most Popular' : '')}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-white font-display">{m.name}</h3>
                        {isCurrentPlan && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Active Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                        {m.description || 'Comprehensive training package for disciplined athletes.'}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black text-white font-display">
                          ₹{m.price}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          / {m.duration}
                        </span>
                      </div>
                      {m.discountPrice && m.discountPrice > m.price && (
                        <div className="text-xs text-slate-500 line-through font-bold">
                          Regular Price: ₹{m.discountPrice}
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    {m.features && m.features.length > 0 && (
                      <div className="space-y-3.5 pt-6 border-t border-slate-800/80">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          Included Perks:
                        </span>
                        <ul className="space-y-3 text-xs text-slate-300 font-medium">
                          {m.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-8">
                    <button
                      onClick={() => handleSubscribe(m)}
                      disabled={isSubscribing || isCurrentPlan}
                      className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isCurrentPlan
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : m.popular
                          ? 'btn-gradient-fire text-white shadow-xl shadow-red-600/40 hover:scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-md'
                      }`}
                    >
                      {isSubscribing ? (
                        <span>Activating...</span>
                      ) : isCurrentPlan ? (
                        <span>Current Active Plan</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Choose {m.name}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-800/80">
          <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white font-display">Instant Trainer Allocation</h4>
              <p className="text-xs text-slate-400 mt-1">Get matched with an expert coach immediately upon activation.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
            <Zap className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white font-display">Zero Hidden Initiation Fees</h4>
              <p className="text-xs text-slate-400 mt-1">Transparent upfront pricing with zero surprise cancellation charges.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
            <Flame className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white font-display">Full Facility Access</h4>
              <p className="text-xs text-slate-400 mt-1">Full privileges across weights, cardio machines, and sauna suites.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Success Confetti Modal */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative text-center space-y-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSuccessModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/60">
              <CheckCircle2 className="w-8 h-8 font-black" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white font-display">Welcome to FitZone!</h3>
              <p className="text-xs text-slate-400">
                Your <span className="text-gradient-fire font-black">{successModalData.planName}</span> is officially active.
              </p>
            </div>

            {successModalData.trainer && (
              
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 text-left">
                <img
                  src={successModalData.trainer.link}
                  alt={successModalData.trainer.name}
                  className="w-13 h-13 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] font-black text-gradient-fire uppercase tracking-widest">Your Assigned Coach</span>
                  <div className="text-sm font-bold text-white ">{successModalData.trainer.name}</div>
                  <div className="text-xs text-slate-400 bg-clip-text  ">{successModalData.trainer.specialization}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSuccessModalData(null);
                navigate('/profile');
              }}
              className="w-full py-4 rounded-full btn-gradient-fire text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Fitness Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Membership;
