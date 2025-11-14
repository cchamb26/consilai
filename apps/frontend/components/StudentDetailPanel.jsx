import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentDetailPanel({ student, onEditPlan }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-8 border-b-2 border-gray-100">
        <div className="flex items-center space-x-4">
          <StudentAvatar name={student.name} avatar={student.avatar} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">{student.email}</p>
            <p className="text-sm text-gray-500 mt-1">{student.grade}</p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Issues */}
        <Section title="Current Issues" icon="⚠️">
          <div className="space-y-2">
            {student.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-700">{issue}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Strengths */}
        <Section title="Strengths" icon="⭐">
          <div className="space-y-2">
            {student.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Goals */}
        <Section title="Learning Goals" icon="🎯">
          <div className="space-y-2">
            {student.goals.map((goal, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">{goal}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick Stats */}
        <Section title="Stats" icon="📊">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Issues" value={student.issues.length} />
            <Stat label="Strengths" value={student.strengths.length} />
            <Stat label="Goals" value={student.goals.length} />
            <Stat label="Status" value="Active" />
          </div>
        </Section>
      </div>

      {/* Plan Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">📋 Learning Plan</h3>
          <Button variant="primary" size="sm" onClick={onEditPlan}>
            Generate AI Plan
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Use AI to generate a personalized learning plan based on this student's profile, issues, strengths, and goals.
        </p>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}

