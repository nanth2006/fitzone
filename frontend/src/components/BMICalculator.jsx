import React, { useState } from 'react';
import { Calculator, Activity, Heart, ArrowRight, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/api.js';

function BMICalculator() {
  const { user, token, role, updateUser } = useAuth();
  const toast = useToast();

  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState(user?.weight || '');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [lbs, setLbs] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const calculateBMI = (e) => {
    e.preventDefault();
    setHeight("")
    setWeight("")
    let hInMeters = 0;
    let wInKg = 0;

    if (unit === 'metric') {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      if (!h || !w || h <= 0 || w <= 0) {
        toast.error('Please enter valid height and weight values');
        return;
      }
      hInMeters = h / 100;
      wInKg = w;
    } else {
      const f = parseFloat(feet) || 0;
      const i = parseFloat(inches) || 0;
      const l = parseFloat(lbs) || 0;
      const totalInches = f * 12 + i;
      if (!totalInches || !l || totalInches <= 0 || l <= 0) {
        toast.error('Please enter valid height and weight values');
        return;
      }
      hInMeters = totalInches * 0.0254;
      wInKg = l * 0.453592;
    }

    const bmi = parseFloat((wInKg / (hInMeters * hInMeters)).toFixed(1));
    let category = '';
    let color = '';
    let advice = '';
    let goalSuggestion = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      advice = 'Focus on nutrient-dense calorie surplus, compound lifts, and progressive overload to build muscle mass.';
      goalSuggestion = 'Build Muscle';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Healthy Weight';
      color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      advice = 'Awesome! Maintain peak physique through balanced resistance training, HIIT conditioning, and clean macros.';
      goalSuggestion = 'Maintain Fitness';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight';
      color = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      advice = 'Target moderate caloric deficit paired with high-intensity interval training (HIIT) and strength training.';
      goalSuggestion = 'Lose Fat';
    } else {
      category = 'Obese';
      color = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      advice = 'Consult our certified trainers for a guided low-impact cardio, strength progression, and structured diet plan.';
      goalSuggestion = 'Lose Fat';
    }

    setBmiResult({
      bmi,
      category,
      color,
      advice,
      goalSuggestion,
      heightCm: unit === 'metric' ? Math.round(parseFloat(height)) : Math.round(hInMeters * 100),
      weightKg: unit === 'metric' ? Math.round(parseFloat(weight)) : Math.round(wInKg),
    });
  };

  const handleSaveToProfile = async () => {
    if (!bmiResult || role !== 'user' || !token) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(
        {
          height: bmiResult.heightCm,
          weight: bmiResult.weightKg,
          fitnessGoal: bmiResult.goalSuggestion,
        },
        token
      );
      updateUser(updated);
      toast.success('Fitness metrics saved to your profile!');
    } catch (err) {
      toast.error(err.message || 'Failed to save to profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gradient-card-border rounded-[2.5rem] p-7 sm:p-10 relative overflow-hidden shadow-2xl">
      {/* Background glow circle */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2">
              Body Mass Index <span className="text-gradient-fire">Calculator</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">Instant health classification and tailored fitness strategy</p>
          </div>
        </div>

        {/* Unit Switcher */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              setUnit('metric');
              setBmiResult(null);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
              unit === 'metric'
                ? 'btn-gradient-fire text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            type="button"
            onClick={() => {
              setUnit('imperial');
              setBmiResult(null);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
              unit === 'imperial'
                ? 'btn-gradient-fire text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Imperial (ft / lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <form onSubmit={calculateBMI} className="lg:col-span-6 space-y-5">
          {unit === 'metric' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="50"
                  max="260"
                  required
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm font-semibold transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 74"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="20"
                  max="300"
                  required
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm font-semibold transition"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Feet (ft)
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    min="3"
                    max="8"
                    required
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-sm font-semibold transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Inches (in)
                  </label>
                  <input
                    type="number"
                    placeholder="9"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    min="0"
                    max="11"
                    required
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-sm font-semibold transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 165"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  min="50"
                  max="600"
                  required
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-sm font-semibold transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl btn-gradient-fire text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Analyze Body Composition & Goal
          </button>
        </form>

        {/* Results Panel */}
        <div className="lg:col-span-6 bg-slate-950/80 rounded-3xl p-6 sm:p-7 border border-slate-800/80 flex flex-col justify-between min-h-[240px]">
          {bmiResult ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Your Health Score</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white font-display">{bmiResult.bmi}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${bmiResult.color}`}>
                      {bmiResult.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Suggested Goal</span>
                  <div className="text-sm font-black text-gradient-fire mt-1">{bmiResult.goalSuggestion}</div>
                </div>
              </div>

              {/* Multi-Hue Visual Gauge */}
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                  <div className="w-[18.5%] bg-gradient-to-r from-amber-600 to-amber-400 rounded-l-full" title="Underweight (<18.5)" />
                  <div className="w-[25%] bg-gradient-to-r from-emerald-600 to-emerald-400" title="Normal (18.5-24.9)" />
                  <div className="w-[25%] bg-gradient-to-r from-orange-500 to-orange-400" title="Overweight (25-29.9)" />
                  <div className="w-[31.5%] bg-gradient-to-r from-red-600 to-rose-600 rounded-r-full" title="Obese (30+)" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1">
                  <span>&lt; 18.5</span>
                  <span>18.5 – 24.9 (Fit)</span>
                  <span>25 – 29.9</span>
                  <span>30+</span>
                </div>
              </div>

              {/* Coach Advice */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                <span className="font-bold text-white block mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Coach Strategy:
                </span>
                {bmiResult.advice}
              </div>

              {role === 'user' && (
                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Metrics to My Profile
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 space-y-3">
              <Heart className="w-12 h-12 text-slate-700 stroke-[1.5]" />
              <div>
                <p className="text-sm font-bold text-slate-300">Enter your height and weight above</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive immediate BMI analysis and tailored gym programming</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BMICalculator;
