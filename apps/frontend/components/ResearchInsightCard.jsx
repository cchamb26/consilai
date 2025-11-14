import Button from './Button';

export default function ResearchInsightCard({ insight }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
        <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
        <p className="text-sm text-purple-100">{insight.fileName}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Upload Date */}
        <div className="text-sm text-gray-600">
          <span className="font-semibold">📅 Uploaded:</span> {insight.uploadDate}
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Summary</p>
          <p className="text-gray-700 text-sm leading-relaxed">{insight.summary}</p>
        </div>

        {/* Topics */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">📚 Relevant Topics</p>
          <div className="flex flex-wrap gap-2">
            {insight.relevantTopics.map((topic, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">💡 Key Findings</p>
          <ul className="space-y-1">
            {insight.keyFindings.map((finding, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex gap-2 border-t border-gray-200">
        <Button variant="primary" size="sm">View Full Paper</Button>
        <Button variant="outline" size="sm">Use for Plan</Button>
      </div>
    </div>
  );
}

