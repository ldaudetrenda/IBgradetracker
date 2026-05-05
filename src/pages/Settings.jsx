import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, ArrowLeft, UserCircle, LogOut, LogIn, Pencil, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { state, dispatch } = useApp();
  const { user, profile, logOut } = useAuth();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(state.studentName);
  const [profileSchool, setProfileSchool] = useState(state.schoolName || '');
  const [profileYear, setProfileYear] = useState(state.ibYear || '');

  function handleReset() {
    dispatch({ type: 'RESET_SETUP' });
    navigate('/');
  }

  async function handleLogout() {
    await logOut();
    navigate('/');
  }

  function setGoal(subjectId, grade) {
    dispatch({ type: 'SET_SUBJECT_GOAL', payload: { subjectId, goalGrade: grade } });
    setEditingGoal(null);
  }

  function saveProfile() {
    if (!profileName.trim()) return;
    dispatch({ type: 'UPDATE_PROFILE', payload: {
      studentName: profileName.trim(),
      schoolName: profileSchool.trim(),
      ibYear: profileYear.trim(),
    }});
    setEditingProfile(false);
  }

  function cancelProfileEdit() {
    setProfileName(state.studentName);
    setProfileSchool(state.schoolName || '');
    setProfileYear(state.ibYear || '');
    setEditingProfile(false);
  }

  return (
    <div className="main-content container fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.25rem' }} onClick={() => navigate('/')}>
        <ArrowLeft size={14} /> Dashboard
      </button>

      <h1 style={{ marginBottom: '0.25rem' }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Manage your IB Grade Tracker preferences</p>

      {/* Student Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3>Your Profile</h3>
          {!editingProfile && (
            <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(true)}>
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Nickname</label>
              <input
                className="input"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>School Name</label>
              <input
                className="input"
                value={profileSchool}
                onChange={e => setProfileSchool(e.target.value)}
                placeholder="e.g. International School of Geneva"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>IB Year</label>
              <input
                className="input"
                value={profileYear}
                onChange={e => setProfileYear(e.target.value)}
                placeholder="e.g. IB1, IB2, Year 1, 2025–2026"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.25rem' }}>
              <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={!profileName.trim()}>
                <Check size={13} /> Save
              </button>
              <button className="btn btn-ghost btn-sm" onClick={cancelProfileEdit}>
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Name</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{state.studentName}</div>
            </div>
            {state.schoolName && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>School</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{state.schoolName}</div>
              </div>
            )}
            {state.ibYear && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>IB Year</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{state.ibYear}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Target Score</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{state.goalScore} / 45</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Subjects</div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{state.subjects.length} + TOK</div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Subjects */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Subjects</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Re-select your subjects and adjust per-subject goals. Grade data is preserved for subjects you keep.
        </p>
        <Link to="/setup/edit" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <Pencil size={13} /> Edit Subjects
        </Link>
      </div>

      {/* Account */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCircle size={18} /> Account
        </h3>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{profile?.nickname || '—'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Login to use Friends Leaderboard and sync your profile.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                <LogIn size={14} /> Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Subject overview with goal editing */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.25rem' }}>Enrolled Subjects & Goals</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Click a subject's goal to change it.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* TOK row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--core-bg)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap' }}>
            <span className="badge badge-core">CORE</span>
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Theory of Knowledge</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goal: Core Points (0–3)</span>
          </div>

          {state.subjects.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap' }}>
              <span className={`badge ${s.level === 'HL' ? 'badge-hl' : 'badge-sl'}`}>{s.level}</span>
              <span style={{ fontWeight: 500, fontSize: '0.9rem', flex: 1, minWidth: '120px' }}>{s.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.groupName}</span>

              {editingGoal === s.id ? (
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginLeft: 'auto' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map(g => (
                    <button
                      key={g}
                      onClick={() => setGoal(s.id, g)}
                      style={{
                        width: '1.85rem', height: '1.85rem',
                        borderRadius: '50%',
                        border: s.goalGrade === g ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: s.goalGrade === g ? 'var(--primary)' : 'white',
                        color: s.goalGrade === g ? 'white' : 'var(--text-muted)',
                        fontWeight: 700, fontSize: '0.78rem',
                        cursor: 'pointer', transition: 'all 0.1s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >{g}</button>
                  ))}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingGoal(null)}
                    style={{ padding: '0.25rem 0.5rem', marginLeft: '0.125rem' }}
                  >✕</button>
                </div>
              ) : (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditingGoal(s.id)}
                  style={{ marginLeft: 'auto' }}
                >
                  Goal: <strong style={{ marginLeft: '0.25rem' }}>{s.goalGrade}</strong>
                  <span style={{ marginLeft: '0.375rem', color: 'var(--primary)', fontSize: '0.75rem' }}>· Edit</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'var(--danger-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <AlertTriangle size={18} color="var(--danger)" />
          <h3 style={{ color: 'var(--danger)' }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Resetting will delete all your grades and subjects. This action cannot be undone.
        </p>
        {!confirmReset ? (
          <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>
            <Trash2 size={14} /> Reset All Data
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)' }}>
              Are you sure? This deletes everything.
            </p>
            <button className="btn btn-danger" onClick={handleReset}>
              Yes, Reset Everything
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
