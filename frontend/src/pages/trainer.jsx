import React, { useEffect, useState } from 'react';
import {
  Users,
  Star,
  Award,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  UserCheck,
  X,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import api from '../api/api.js';

function Trainer() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    api.getTrainers()
      .then((data) => setTrainers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Failed to load trainers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" /> Elite Coaching Staff
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display">
            Personal <span className="text-gradient-fire">Coaches & Mentors</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Every FitZone athlete is matched with a certified coach specializing in biomechanics, muscle hypertrophy, nutrition strategy, and injury prevention.
          </p>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card rounded-[2rem] h-80 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-card rounded-3xl border border-rose-500/30 text-rose-300">
            <p className="text-base font-semibold">{error}</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-[2.5rem] border border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white font-display">No trainers added yet</h3>
            <p className="text-xs text-slate-400">Our administrative team will publish the coach roster shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((t) => (
              <div
                key={t._id}
                onClick={() => setSelectedTrainer(t)}
                className="gradient-card-border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Photo with Overlay */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                    <img
                      src={t.link}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021] via-transparent to-transparent" />

                    {/* Top rating badge */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {t.rating || 4.9}
                    </span>

                    <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                      {t.experience || '5+ Yrs'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-white font-display group-hover:text-red-400 transition">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gradient-fire font-bold">{t.specialization}</p>
                    {t.bio && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1 font-medium">
                        {t.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                  <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-300 font-bold">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      {t.assignedCount !== undefined ? `${t.assignedCount} Athletes` : 'Active'}
                    </span>
                    <span className="text-red-400 font-black uppercase text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-[2.5rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-200 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/70 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full overflow-hidden rounded-t-[2.5rem]">
              <img
                src={selectedTrainer.link}
                alt={selectedTrainer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider btn-gradient-fire text-white shadow-md">
                  {selectedTrainer.specialization}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
                  {selectedTrainer.name}
                </h2>
              </div>
            </div>

            <div className="p-7 space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Experience</div>
                  <div className="text-lg font-black text-white">{selectedTrainer.experience || '5+ Years'}</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Athlete Rating</div>
                  <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {selectedTrainer.rating || 4.9} / 5.0
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedTrainer.bio && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Coaching Philosophy</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedTrainer.bio}</p>
                </div>
              )}

              {/* Certifications */}
              {selectedTrainer.certifications && selectedTrainer.certifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Accreditations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-red-400" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact info */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-400 font-medium">
                {selectedTrainer.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-red-500" />
                    <span>{selectedTrainer.email}</span>
                  </div>
                )}
                {selectedTrainer.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>{selectedTrainer.phone}</span>
                  </div>
                )}
                {selectedTrainer.instagram && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-rose-500" />
                    <span>{selectedTrainer.instagram}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Trainer;
