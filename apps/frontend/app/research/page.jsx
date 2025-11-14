'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import ResearchInsightCard from '../../components/ResearchInsightCard';
import { mockResearchInsights } from '../../lib/mockData';

export default function ResearchPage() {
  const [insights, setInsights] = useState(mockResearchInsights);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    console.log('Files received:', files);
    alert(`${files.length} file(s) uploaded! (Demo mode - files are not actually processed)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Research Upload</h1>
          <p className="text-gray-600 text-lg">
            Upload educational research papers for AI analysis and insights
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-12">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative rounded-lg border-2 border-dashed p-12 text-center
              transition-all cursor-pointer
              ${dragActive ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white hover:border-green-400'}
            `}
          >
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              id="file-input"
              accept=".pdf,.docx,.txt"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {dragActive ? 'Drop files here' : 'Drag and drop research papers here'}
              </p>
              <p className="text-gray-600 mb-4">or click to select files</p>
              <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</p>
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="primary" onClick={() => document.getElementById('file-input')?.click()}>
              📁 Choose File
            </Button>
            <Button variant="outline">
              🔗 Add URL
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Feature icon="🤖" title="AI Analysis" description="Automatically extract key findings and insights from research papers" />
          <Feature icon="🏷️" title="Topic Tags" description="Auto-categorize papers by relevant educational topics" />
          <Feature icon="💾" title="Save & Share" description="Store papers and share insights with your team" />
        </div>

        {/* Current Insights */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Recent Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map(insight => (
              <ResearchInsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {insights.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No research papers uploaded yet. Start by uploading your first paper!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow border-t-4 border-green-500">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

