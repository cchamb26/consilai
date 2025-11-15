'use client';

import { useState } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

export default function StudentForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    grade: 'Grade 10',
    issues: '',
    strengths: '',
    goals: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur rounded-2xl shadow-2xl border border-slate-800 p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-2 text-white">
        {initialData ? 'Edit Student' : 'Add New Student'}
      </h2>
      <p className="text-sm text-slate-400 mb-6">
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
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Grade Level
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
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
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <Button type="submit" variant="primary" size="lg">
          {initialData ? 'Save Changes' : 'Add Student'}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

