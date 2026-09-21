import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Shield,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  Zap,
  Activity,
  Heart,
  TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BMICalculator from '../components/BMICalculator.jsx';
import WorkoutModal from '../components/WorkoutModal.jsx';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function UserDashboard() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'HIIT', 'Arms', 'Core'];

  useEffect(() => {
    api.getWorkouts({ category: activeCategory })
      .then((data) => setFeaturedWorkouts(data.slice(0, 6)))
      .catch((err) => console.log('Workouts fetch error:', err));

    api.getTrainers()
      .then((data) => setTrainers(data.slice(0, 4)))
      .catch((err) => console.log('Trainers fetch error:', err));

    api.getMemberships()
      .then((data) => setMemberships(data.slice(0, 3)))
      .catch((err) => console.log('Memberships fetch error:', err));
  }, [activeCategory]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Navbar />

      {/* ================= HERO SECTION WITH DYNAMIC GRADIENTS ================= */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
        {/* Layered Multi-Color Ambient Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-red-600/20 via-rose-600/15 to-violet-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-amber-500/15 to-rose-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 to-red-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Floating Pill with glowing border */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 via-rose-600/20 to-amber-500/20 border border-red-500/40 text-red-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-red-950/50">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Next-Gen Gym & Performance Hub</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight font-display">
                FORGE YOUR <br />
                <span className="text-gradient-fire">ULTIMATE SELF</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Transform your body and mind with Olympic-tier equipment, personalized trainer matchmaking, and structured progression routines designed to shatter plateaus.
              </p>

              {/* Action Buttons with continuous glowing gradients */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/membership')}
                  className="btn-gradient-fire px-8 py-4 rounded-full text-white font-extrabold text-sm tracking-wider uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-200 animate-ping" />
                  Explore Memberships
                  <ArrowRight className="w-4 h-4 " />
                </button>

                <button
                  onClick={() => navigate('/workout')}
                  className="px-8 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 hover:border-red-500/60 font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-lg hover:shadow-glow-red hover:scale-105"
                >
                  <Dumbbell className="w-4 h-4 animate-spin text-red-500" />
                  Browse Workout Routines
                </button>
              </div>

              {/* Stat Counters with Gradient Accent Lines */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 ">
                <div className="space-y-1 hover:scale-105">
                  <div className="text-3xl sm:text-4xl font-black text-white font-display ">2,500+</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Athletes</div>
                  <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
                </div>
                <div className="space-y-1 hover:scale-105">
                  <div className="text-3xl sm:text-4xl font-black text-gradient-fire font-display">120+</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Certified Coaches</div>
                  <div className="h-1 w-12 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" />
                </div>
                <div className="space-y-1 hover:scale-105">
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">99.4%</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Goal Attainment</div>
                  <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Glowing Outer Frame */}
                <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-rose-600 to-blue-400 rounded-[2.5rem] blur-xl opacity-40 animate-pulse-glow" />

                <div className="relative z-10 rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group">
                  <img
                    src="https://img.freepik.com/premium-photo/contemporary-gym-interior-with-exercise-equipment-concept-gym-design-fitness-equipment-modern-interiors-exercise-space-training-facility_864588-109337.jpg?w=2000"
                    alt="FitZone Gym Hero Performance"
                    className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/30 to-transparent" />

                  {/* Floating Live Metric Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/15 backdrop-blur-xl flex items-center justify-between shadow-2xl  hover:bg-gradient-to-tr from-orange-400 to-pink-300 ">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/40">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold uppercase">Daily Burn Index</div>
                        <div className="text-sm font-black text-white font-display">680 kcal / Athlete</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 hover:text-white text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <TrendingUp className="w-3 h-6 " /> +24% Peak
                    </span>
                  </div>
                </div>

                {/* Floating Top Rating Badge */}
                <div className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-3.5 p-4 rounded-2xl glass-card border border-white/15 shadow-2xl animate-float">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">#1 Gym Facility</div>
                    <div className="flex items-center text-amber-400 text-xs mt-0.5">
                      {'★'.repeat(5)}
                      <span className="text-slate-300 ml-1.5 font-bold text-[11px]">4.98 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORLD CLASS AMENITIES MATRIX ================= */}
      <section className="py-24 relative border-y border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gradient-fire">World-Class Infrastructure</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              Engineered For Greatness
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every detail is meticulously crafted to eliminate friction and maximize metabolic conditioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Dumbbell className="w-6 h-6 text-red-500" />,
                gradient: 'from-red-600/20 to-rose-600/5',
                borderColor: 'hover:border-red-500/50',
                title: 'Heavy Hammer Strength',
                desc: 'Olympic calibrated barbells, dumbbells up to 150 lbs, competition benches, and full squat racks.',
              },
              {
                icon: <Users className="w-6 h-6 text-rose-500" />,
                gradient: 'from-rose-600/20 to-blue-600/20',
                borderColor: 'hover:border-rose-500/50',
                title: '1-on-1 Coach Matching',
                desc: 'Automated personal trainer allocation matching your exact physique and hypertrophy aspirations.',
              },
              {
                icon: <Flame className="w-6 h-6 text-amber-500" />,
                gradient: 'from-amber-600/20 to-orange-600/5',
                borderColor: 'hover:border-amber-500/50',
                title: 'Digital Streak Check-In',
                desc: 'One-click daily attendance logging with streak bonuses and performance analytics in your portal.',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-violet-400" />,
                gradient: 'from-violet-600/20 to-indigo-600/5',
                borderColor: 'hover:border-violet-500/50',
                title: 'Sauna & Cryo Suite',
                desc: 'Infrared dry saunas, cold contrast plunge tubs, and compression recovery gear for accelerated repair.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`glass-card glass-card-hover rounded-3xl p-7 border border-slate-800/90 relative group overflow-hidden ${feature.borderColor}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE WORKOUT PREVIEW ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gradient-fire">Science-Backed Regimens</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
                Featured Workout Routines
              </h2>
            </div>
            <Link
              to="/workout"
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-400 hover:text-red-300 transition group"
            >
              Browse Full Exercise Library <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Switcher Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'btn-gradient-fire text-white shadow-lg'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Workout Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorkouts.map((w) => (
              <div
                key={w._id}
                onClick={() => setSelectedWorkout(w)}
                className="gradient-card-border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={w.link}
                      alt={w.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021] via-[#0b1021]/30 to-transparent" />
                    
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider btn-gradient-fire text-white shadow-md">
                      {w.category}
                    </span>
                    <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                      {w.difficulty}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition font-display line-clamp-1">
                      {w.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {w.description || 'Targeted hypertrophy progression engineered for optimal muscle fiber recruitment.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between pt-3.5 border-t border-slate-800 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold text-slate-300">
                      <Clock className="w-4 h-4 text-red-500" />
                      {w.duration} mins
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ~{w.caloriesBurned || 300} kcal
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE BMI CALCULATOR WIDGET ================= */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BMICalculator />
        </div>
      </section>

      {/* ================= TRAINERS SHOWCASE ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gradient-fire">Elite Mentorship</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              Meet Our Master Coaches
            </h2>
            <p className="text-sm text-slate-400">
              When you activate your membership, you are automatically paired with an expert coach dedicated to your training.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((t) => (
              <div
                key={t._id}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-slate-800/90 group"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={t.link}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {t.rating || 4.9}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                      {t.experience || '5+ Yrs'}
                    </span>
                  </div>
                </div>

                <div className="p-5 text-center space-y-1.5">
                  <h3 className="text-base font-bold text-white font-display">{t.name}</h3>
                  <p className="text-xs text-gradient-fire font-bold">{t.specialization}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/trainer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-black uppercase tracking-wider transition shadow-lg"
            >
              View Full Trainer Roster <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MEMBERSHIP PLANS PREVIEW ================= */}
      <section className="py-24 border-t border-slate-800/80 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gradient-fire">Membership Tiers</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              Transparent, All-Inclusive Plans
            </h2>
            <p className="text-sm text-slate-400">
              Join thousands of dedicated athletes with simple pricing and full facility privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {memberships.map((m) => (
              <div
                key={m._id}
                className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between ${
                  m.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/60 border-2 border-red-500 shadow-2xl shadow-red-600/30 scale-105 z-10'
                    : 'glass-card border border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {m.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-gradient-fire text-white font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">{m.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{m.description || 'Full gym and trainer privileges.'}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white font-display">₹{m.price}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">/ {m.duration}</span>
                  </div>

                  {m.features && m.features.length > 0 && (
                    <ul className="space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium">
                      {m.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => navigate('/membership')}
                  className={`mt-8 w-full py-4 rounded-full font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                    m.popular
                      ? 'btn-gradient-fire text-white shadow-xl shadow-red-600/40 hover:scale-[1.02]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700'
                  }`}
                >
                  Choose {m.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routine Detail Modal */}
      {selectedWorkout && (
        <WorkoutModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default UserDashboard;
