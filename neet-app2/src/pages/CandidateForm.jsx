import { useState } from 'react';
import styles from './CandidateForm.module.css';

export default function CandidateForm({ testName, onBack, onSubmit }) {
  const [form, setForm] = useState({ name: '', rollNumber: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        <button className={styles.back} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Tests
        </button>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.testBadge}>{testName}</div>
            <h1 className={styles.title}>Candidate Details</h1>
            <p className={styles.subtitle}>Enter your information to begin the examination</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                autoComplete="name"
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Roll Number</label>
              <input
                className={`${styles.input} ${errors.rollNumber ? styles.inputError : ''}`}
                type="text"
                placeholder="e.g. NEET2026001"
                value={form.rollNumber}
                onChange={e => { setForm(p => ({ ...p, rollNumber: e.target.value })); setErrors(p => ({ ...p, rollNumber: '' })); }}
                autoComplete="off"
              />
              {errors.rollNumber && <span className={styles.error}>{errors.rollNumber}</span>}
            </div>

            <div className={styles.examInfo}>
              <div className={styles.infoItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                Duration: 3 hours (180 min)
              </div>
              <div className={styles.infoItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                Marking: +4 correct, −1 incorrect
              </div>
              <div className={styles.infoItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                </svg>
                Subjects: Physics, Chemistry, Biology
              </div>
            </div>

            <button type="submit" className={styles.submit}>
              Proceed to Instructions
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
