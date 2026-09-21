import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  Dumbbell,
  DollarSign,
  Flame,
  Search,
  Trash2,
  Edit2,
  LogOut,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

import AddTrainerForm from './addtrainer.jsx';
import AddMembershipForm from './addmembership.jsx';
import AddWorkout from './addworkouts.jsx';

const TABS = [
  {
    id: 'Overview',
    label: 'Analytics Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'Users',
    label: 'Members Directory',
    icon: Users,
  },
  {
    id: 'Memberships',
    label: 'Membership Plans',
    icon: CreditCard,
  },
  {
    id: 'Trainers',
    label: 'Trainers Roster',
    icon: UserCheck,
  },
  {
    id: 'Workouts',
    label: 'Workouts Library',
    icon: Dumbbell,
  },
];

function AdminDashboard() {
  const { token, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Overview');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [searchMember, setSearchMember] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ================= EDIT STATES =================
  const [editMembership, setEditMembership] = useState(null);
  const [editTrainer, setEditTrainer] = useState(null);
  const [editWorkout, setEditWorkout] = useState(null);

  // ================= LOAD ALL DATA =================
  const loadAll = async () => {
    setLoading(true);
    setError('');

    try {
      const [s, u, m, t, w] = await Promise.all([
        api.getAdminStats(token),
        api.getAllUsers(token, searchMember),
        api.getMemberships(),
        api.getTrainers(),
        api.getWorkouts(),
      ]);

      setStats(s);
      setUsers(Array.isArray(u) ? u : []);
      setMemberships(Array.isArray(m) ? m : []);
      setTrainers(Array.isArray(t) ? t : []);
      setWorkouts(Array.isArray(w) ? w : []);
    } catch (err) {
      console.error('Admin dashboard error:', err);

      setError(
        err.message || 'Failed to load administrative data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [searchMember]);

  // ================= ASSIGN TRAINER =================
  const handleAssignTrainer = async (userId, trainerId) => {
    try {
      await api.assignTrainer(userId, trainerId, token);

      toast.success(
        'Trainer assignment updated successfully'
      );

      await loadAll();
    } catch (err) {
      toast.error(
        err.message || 'Failed to assign trainer'
      );
    }
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        'Are you sure you want to remove this user account?'
      )
    ) {
      return;
    }

    try {
      await api.deleteUser(userId, token);

      toast.success('Member removed successfully');

      await loadAll();
    } catch (err) {
      toast.error(
        err.message || 'Failed to remove member'
      );
    }
  };

  // ================= DELETE TRAINER =================
  const handleDeleteTrainer = async (id) => {
    if (
      !window.confirm(
        'Remove this trainer from the system?'
      )
    ) {
      return;
    }

    try {
      await api.deleteTrainer(id, token);

      toast.success('Trainer removed');

      await loadAll();
    } catch (err) {
      toast.error(
        err.message || 'Failed to delete trainer'
      );
    }
  };

  // ================= DELETE MEMBERSHIP =================
  const handleDeleteMembership = async (id) => {
    if (
      !window.confirm(
        'Delete this membership tier?'
      )
    ) {
      return;
    }

    try {
      await api.deleteMembership(id, token);

      toast.success('Membership plan deleted');

      await loadAll();
    } catch (err) {
      toast.error(
        err.message || 'Failed to delete plan'
      );
    }
  };

  // ================= DELETE WORKOUT =================
  const handleDeleteWorkout = async (id) => {
    if (
      !window.confirm(
        'Remove this workout routine?'
      )
    ) {
      return;
    }

    try {
      await api.deleteWorkout(id, token);

      toast.success('Workout routine removed');

      await loadAll();
    } catch (err) {
      toast.error(
        err.message || 'Failed to delete workout'
      );
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 glass-header border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-20">

            <div className="flex items-center gap-3.5">

              <div className="relative">

                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl blur-sm opacity-80" />

                <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-white/20 flex items-center justify-center text-white">

                  <ShieldAlert className="w-6 h-6 text-amber-400" />

                </div>

              </div>

              <div>

                <span className="font-display font-black text-xl text-white tracking-wide flex items-center gap-1.5">

                  FITZONE

                  <span className="text-gradient-gold">
                    DIRECTOR
                  </span>

                </span>

                <span className="text-[9px] text-amber-400/90 block font-black uppercase tracking-[0.25em]">
                  COMMAND CONSOLE
                </span>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate('/user')}
                className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 transition shadow-sm cursor-pointer"
              >
                Public Site
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 px-4 py-2 rounded-xl bg-rose-950/20 border border-rose-800/40 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">

        {/* ================= TABS ================= */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">

          {TABS.map((tab) => {

            const Icon = tab.icon;
            const isTabActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  isTabActive
                    ? 'btn-gradient-fire text-white shadow-xl'
                    : 'glass-card text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >

                <Icon className="w-4 h-4" />

                {tab.label}

              </button>
            );

          })}

        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* ================= OVERVIEW ======================= */}
        {/* ================================================= */}

        {activeTab === 'Overview' && (

          <div className="space-y-8 animate-in fade-in duration-200">

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="gradient-card-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden">

                <div className="flex items-center justify-between">

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Total Members
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>

                </div>

                <div className="text-4xl font-black text-white font-display mt-3">
                  {stats?.totalUsers || users.length}
                </div>

                <div className="text-xs text-slate-400 mt-1 font-medium">
                  <span className="text-emerald-400 font-bold">
                    {stats?.activeSubscriptions || 0}
                  </span>{' '}
                  subscribed athletes
                </div>

              </div>

              <div className="gradient-card-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden">

                <div className="flex items-center justify-between">

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Est. Monthly Revenue
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>

                </div>

                <div className="text-4xl font-black text-gradient-gold font-display mt-3">
                  ₹{(stats?.totalRevenue || 0).toLocaleString()}
                </div>

                <div className="text-xs text-emerald-400 mt-1 font-bold">
                  Active tier cashflow
                </div>

              </div>

              <div className="gradient-card-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden">

                <div className="flex items-center justify-between">

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Today's Check-ins
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>

                </div>

                <div className="text-4xl font-black text-gradient-fire font-display mt-3">
                  {stats?.todayCheckins || 0}
                </div>

                <div className="text-xs text-slate-400 mt-1 font-medium">
                  Athletes trained today
                </div>

              </div>

              <div className="gradient-card-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden">

                <div className="flex items-center justify-between">

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Roster & Library
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5" />
                  </div>

                </div>

                <div className="text-3xl font-black text-white font-display mt-3">
                  {trainers.length} Coaches / {workouts.length} Routines
                </div>

                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {memberships.length} Active membership tiers
                </div>

              </div>

            </div>

            {/* TRAINER LOAD */}
            <div className="gradient-card-border rounded-[2.5rem] p-7 sm:p-9 space-y-6 shadow-2xl">

              <div>
                <h3 className="text-2xl font-black text-white font-display">
                  Trainer Mentorship Workload
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Live distribution of athletes assigned to each certified coach
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {(stats?.trainerLoads || trainers).map((t) => {

                  const assigned =
                    t.assignedCount || 0;

                  const capacity =
                    t.capacity || 25;

                  const percent = Math.min(
                    100,
                    Math.round(
                      (assigned / capacity) * 100
                    )
                  );

                  return (

                    <div
                      key={t._id}
                      className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-md"
                    >

                      <div className="flex items-center gap-3">

                        <img
                          src={t.link}
                          alt={t.name}
                          className="w-11 h-11 rounded-2xl object-cover"
                        />

                        <div className="min-w-0">

                          <h4 className="text-sm font-bold text-white truncate">
                            {t.name}
                          </h4>

                          <span className="text-[10px] text-red-400 font-bold block truncate">
                            {t.specialization}
                          </span>

                        </div>

                      </div>

                      <div className="space-y-1.5 pt-1">

                        <div className="flex justify-between text-xs font-bold">

                          <span className="text-slate-400">
                            {assigned} Athletes
                          </span>

                          <span className="text-gradient-fire">
                            {percent}%
                          </span>

                        </div>

                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">

                          <div
                            className="h-full btn-gradient-fire rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

            {/* RECENT USERS */}
            <div className="glass-card rounded-[2.5rem] p-7 sm:p-9 border border-slate-800 space-y-4">

              <h3 className="text-2xl font-black text-white font-display">
                Recent Member Registrations
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full text-left text-xs">

                  <thead>

                    <tr className="border-b border-slate-800 text-slate-400 font-black uppercase tracking-wider">

                      <th className="py-3 px-4">
                        Member Name
                      </th>

                      <th className="py-3 px-4">
                        Email
                      </th>

                      <th className="py-3 px-4">
                        Membership Tier
                      </th>

                      <th className="py-3 px-4">
                        Assigned Coach
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800/60">

                    {users.slice(0, 5).map((u) => (

                      <tr
                        key={u._id}
                        className="hover:bg-slate-900/50"
                      >

                        <td className="py-3.5 px-4 font-bold text-white">
                          {u.name}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-4">

                          {u.membership ? (

                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider btn-gradient-fire text-white shadow-sm">
                              {u.membership.name}
                            </span>

                          ) : (

                            <span className="text-slate-600 font-semibold">
                              No Plan
                            </span>

                          )}

                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-semibold">

                          {u.trainer
                            ? u.trainer.name
                            : (
                              <span className="text-slate-600">
                                Unassigned
                              </span>
                            )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* ================= USERS ========================== */}
        {/* ================================================= */}

        {activeTab === 'Users' && (

          <div className="glass-card rounded-[2.5rem] p-7 sm:p-9 border border-slate-800 space-y-6 animate-in fade-in duration-200">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-black text-white font-display">
                  Gym Members Directory
                </h2>

                <p className="text-xs text-slate-400 font-medium">
                  Manage member accounts, memberships, and assigned coaches
                </p>

              </div>

              <div className="relative w-full sm:w-72">

                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchMember}
                  onChange={(e) =>
                    setSearchMember(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-medium"
                />

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>

                  <tr className="border-b border-slate-800 text-slate-400 font-black uppercase tracking-wider">

                    <th className="py-3 px-4">
                      Member
                    </th>

                    <th className="py-3 px-4">
                      Contact
                    </th>

                    <th className="py-3 px-4">
                      Membership Plan
                    </th>

                    <th className="py-3 px-4">
                      Assigned Coach
                    </th>

                    <th className="py-3 px-4">
                      Reassign Coach
                    </th>

                    <th className="py-3 px-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800/60">

                  {users.length === 0 && !loading && (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        No member accounts found matching your search.
                      </td>

                    </tr>

                  )}

                  {users.map((u) => (

                    <tr
                      key={u._id}
                      className="hover:bg-slate-900/60 transition"
                    >

                      <td className="py-4 px-4 font-bold text-white">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center font-black text-white text-xs shadow-md">

                            {u.name
                              ? u.name[0].toUpperCase()
                              : 'U'}

                          </div>

                          <div>

                            <div>
                              {u.name}
                            </div>

                            <span className="text-[10px] text-slate-500 font-normal">
                              Goal: {u.fitnessGoal || 'Build Muscle'}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td className="py-4 px-4 text-slate-300">

                        <div>
                          {u.email}
                        </div>

                        {u.phone && (

                          <span className="text-slate-500 text-[11px] font-semibold">
                            {u.phone}
                          </span>

                        )}

                      </td>

                      <td className="py-4 px-4">

                        {u.membership ? (

                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider btn-gradient-fire text-white shadow-sm">
                            {u.membership.name}
                          </span>

                        ) : (

                          <span className="text-slate-500 font-semibold">
                            No active plan
                          </span>

                        )}

                      </td>

                      <td className="py-4 px-4 text-slate-200">

                        {u.trainer ? (

                          <span className="font-bold text-amber-400">
                            {u.trainer.name}
                          </span>

                        ) : (

                          <span className="text-slate-500">
                            Unassigned
                          </span>

                        )}

                      </td>

                      <td className="py-4 px-4">

                        <select
                          value={u.trainer?._id || ''}
                          onChange={(e) =>
                            handleAssignTrainer(
                              u._id,
                              e.target.value
                            )
                          }
                          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-red-500 font-semibold"
                        >

                          <option value="">
                            -- None --
                          </option>

                          {trainers.map((t) => (

                            <option
                              key={t._id}
                              value={t._id}
                            >
                              {t.name}
                            </option>

                          ))}

                        </select>

                      </td>

                      <td className="py-4 px-4 text-right">

                        <button
                          onClick={() =>
                            handleDeleteUser(u._id)
                          }
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
                          title="Delete Member Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* ================= MEMBERSHIPS =================== */}
        {/* ================================================= */}

        {activeTab === 'Memberships' && (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">

            <div className="lg:col-span-4">

              <AddMembershipForm
                onAdded={loadAll}
                editMembership={editMembership}
                onUpdated={() => {
                  setEditMembership(null);
                  loadAll();
                }}
              />

            </div>

            <div className="lg:col-span-8 space-y-4">

              <h3 className="text-2xl font-black text-white font-display">
                Active Membership Tiers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {memberships.map((m) => (

                  <div
                    key={m._id}
                    className="gradient-card-border rounded-3xl p-6 flex flex-col justify-between space-y-4 relative shadow-xl"
                  >

                    {m.popular && (

                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider btn-gradient-fire text-white shadow-md">
                        Featured
                      </span>

                    )}

                    <div className="space-y-2">

                      <h4 className="text-xl font-bold text-white font-display">
                        {m.name}
                      </h4>

                      <div className="flex items-baseline gap-2">

                        <span className="text-3xl font-black text-gradient-fire font-display">
                          ₹{m.price}
                        </span>

                        <span className="text-xs text-slate-400 font-bold">
                          / {m.duration}
                        </span>

                      </div>

                      <p className="text-xs text-slate-400 font-medium">
                        {m.description}
                      </p>

                    </div>

                    {m.features &&
                      m.features.length > 0 && (

                        <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3.5 font-medium">

                          {m.features.map((f, i) => (

                            <li
                              key={i}
                              className="flex items-center gap-2"
                            >

                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />

                              <span>{f}</span>

                            </li>

                          ))}

                        </ul>

                      )}

                    {/* EDIT + DELETE */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">

                      <button
                        onClick={() =>
                          handleDeleteMembership(m._id)
                        }
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Remove Plan
                      </button>

                      <button
                        onClick={() =>
                          setEditMembership(m)
                        }
                        className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider cursor-pointer"
                      >

                        <Edit2 className="w-3.5 h-3.5" />

                        Edit

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* ================= TRAINERS ====================== */}
        {/* ================================================= */}

        {activeTab === 'Trainers' && (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">

            <div className="lg:col-span-4">

              <AddTrainerForm
                onAdded={loadAll}
                editTrainer={editTrainer}
                onUpdated={() => {
                  setEditTrainer(null);
                  loadAll();
                }}
              />

            </div>

            <div className="lg:col-span-8 space-y-4">

              <h3 className="text-2xl font-black text-white font-display">
                Trainer Coaching Roster
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {trainers.map((t) => (

                  <div
                    key={t._id}
                    className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xl"
                  >

                    <div className="relative h-40 w-full">

                      <img
                        src={t.link}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent" />

                    </div>

                    <div className="p-5 space-y-1.5">

                      <h4 className="text-base font-bold text-white font-display">
                        {t.name}
                      </h4>

                      <p className="text-xs text-gradient-fire font-bold">
                        {t.specialization}
                      </p>

                      <span className="text-[11px] text-slate-400 block font-semibold">
                        {t.experience || '5+ Years'}
                      </span>

                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800 text-xs">

                      <span className="text-emerald-400 font-bold">
                        {t.assignedCount || 0} Athletes
                      </span>

                      <div className="flex items-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() =>
                            setEditTrainer(t)
                          }
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider cursor-pointer"
                        >

                          <Edit2 className="w-3.5 h-3.5" />

                          Edit

                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDeleteTrainer(t._id)
                          }
                          className="text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* ================= WORKOUTS ====================== */}
        {/* ================================================= */}

        {activeTab === 'Workouts' && (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">

            <div className="lg:col-span-4">

              <AddWorkout
                onAdded={loadAll}
                editWorkout={editWorkout}
                onUpdated={() => {
                  setEditWorkout(null);
                  loadAll();
                }}
              />

            </div>

            <div className="lg:col-span-8 space-y-4">

              <h3 className="text-2xl font-black text-white font-display">
                Workout Routine Database
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {workouts.map((w) => (

                  <div
                    key={w._id}
                    className="gradient-card-border rounded-3xl p-4 flex items-center gap-4 group justify-between shadow-md"
                  >

                    <div className="flex items-center gap-3.5 min-w-0">

                      <img
                        src={w.link}
                        alt={w.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                      />

                      <div className="min-w-0">

                        <span className="text-[10px] font-black text-gradient-fire uppercase tracking-widest">

                          {w.category || 'Full Body'} • {w.difficulty}

                        </span>

                        <h4 className="text-sm font-bold text-white truncate font-display">
                          {w.name}
                        </h4>

                        <div className="text-xs text-slate-400 font-medium">
                          {w.duration} mins • ~{w.caloriesBurned || 250} kcal
                        </div>

                      </div>

                    </div>

                    {/* EDIT + DELETE */}
                    <div className="flex items-center gap-2 shrink-0">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          setEditWorkout(w)
                        }
                        className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 rounded-xl transition cursor-pointer"
                        title="Edit Workout"
                      >

                        <Edit2 className="w-4 h-4" />

                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDeleteWorkout(w._id)
                        }
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                        title="Remove Workout"
                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
