import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentDetailPanel({ student, onEditPlan }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <StudentAvatar name={student.name} avatar={student.avatar} size="lg" />
          <div>
            <h1 className="text-3xl font-semibold text-white">{student.name}</h1>
            <p className="text-slate-300">{student.email}</p>
            <p className="text-sm text-slate-500 mt-1">{student.grade}</p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Issues */}
        <Section title="Focus Areas" icon="⚠️">
          <div className="space-y-2">
            {student.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span className="text-slate-200">{issue}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Strengths */}
        <Section title="Strengths" icon="⭐">
          <div className="space-y-2">
            {student.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span className="text-slate-200">{strength}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Goals */}
        <Section title="Learning Goals" icon="🎯">
          <div className="space-y-2">
            {student.goals.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-sky-400 mt-1">•</span>
                <span className="text-slate-200">{goal}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick Stats */}
        <Section title="Snapshot" icon="📊">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Issues" value={student.issues.length} />
            <Stat label="Strengths" value={student.strengths.length} />
            <Stat label="Goals" value={student.goals.length} />
            <Stat label="Status" value="Active" />
          </div>
        </Section>
      </div>

      {/* Plan Section */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">📋 Learning Plan</h3>
          <Button variant="primary" size="sm" onClick={onEditPlan}>
            Generate AI Plan
          </Button>
        </div>
        <p className="text-slate-300 text-sm">
          Generate a personalized learning plan backed by the latest research matched to this student’s profile automatically.
        </p>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <span aria-hidden>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center rounded-xl bg-white/5 p-4">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs uppercase tracking-wide text-slate-400 mt-1">{label}</p>
    </div>
  );
}

