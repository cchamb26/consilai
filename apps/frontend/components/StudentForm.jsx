'use client';

import { useState } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

const EMOJIS = ['👨‍🎓', '👩‍🎓', '👨‍🦱', '👩‍🦱', '👨‍💼', '👩‍💼', '🧑‍🎓', '👦', '👧', '🧒', '👨‍🔬', '👩‍🔬', '🎨', '⭐', '🚀', '🌟'];

export default function StudentForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    id: '',
    name: '',
    email: '',
    grade: 'Grade 10',
    issues: '',
    strengths: '',
    goals: '',
    avatar: '👨‍🎓',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    const newErrors = {};
    if (!formData.name || formData.name.trim() === '') newErrors.name = 'Name is required';
    if (!formData.email || formData.email.trim() === '') newErrors.email = 'Email is required';
    if (!formData.issues || formData.issues.trim() === '') newErrors.issues = 'Issues are required';
    if (!formData.strengths || formData.strengths.trim() === '') newErrors.strengths = 'Strengths are required';
    if (!formData.goals || formData.goals.trim() === '') newErrors.goals = 'Learning goals are required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert comma-separated strings to arrays
    const submittedData = {
      ...formData,
      issues: formData.issues ? formData.issues.split(',').map(s => s.trim()).filter(s => s) : [],
      strengths: formData.strengths ? formData.strengths.split(',').map(s => s.trim()).filter(s => s) : [],
      goals: formData.goals ? formData.goals.split(',').map(s => s.trim()).filter(s => s) : [],
    };

    onSubmit?.(submittedData);
  };

  // Check if form is complete
  const isFormComplete = formData.name?.trim() && 
                         formData.email?.trim() && 
                         formData.issues?.trim() && 
                         formData.strengths?.trim() && 
                         formData.goals?.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark/80 backdrop-blur rounded-2xl shadow-2xl border border-border dark:border-slate-800 p-8 max-w-2xl transition-colors">
      <h2 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark">
        {initialData ? 'Edit Student' : 'Add New Student'}
      </h2>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
        Capture student context and let ConsilAI handle the research behind the scenes.
      </p>

      <div className="space-y-6">
        {/* Name */}
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter student name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="student@school.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Grade Level
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <option>Kindergarten</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
          </select>
        </div>

        {/* Issues */}
        <Textarea
          label="Current Issues (comma-separated)"
          name="issues"
          placeholder="e.g., Poor focus, Difficulty with math, Anxiety..."
          value={formData.issues}
          onChange={handleChange}
          rows={3}
        />

        {/* Strengths */}
        <Textarea
          label="Strengths (comma-separated)"
          name="strengths"
          placeholder="e.g., Creative thinking, Leadership, Technical skills..."
          value={formData.strengths}
          onChange={handleChange}
          rows={3}
        />

        {/* Goals */}
        <Textarea
          label="Learning Goals (comma-separated)"
          name="goals"
          placeholder="e.g., Improve collaboration, Build confidence, Master new skills..."
          value={formData.goals}
          onChange={handleChange}
          rows={3}
        />

        {/* Avatar/Emoji Selector */}
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-3">
            Student Avatar
          </label>
          <div className="grid grid-cols-8 gap-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                className={`text-3xl p-3 rounded-lg transition ${
                  formData.avatar === emoji
                    ? 'bg-primary-500 dark:bg-primary-600 scale-110'
                    : 'bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          disabled={!isFormComplete}
          className={!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {initialData ? 'Save Changes' : 'Add Student'}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

