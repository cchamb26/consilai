import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentDetailPanel({ student, onEditPlan }) {
  const issues = Array.isArray(student.issues) ? student.issues : [];
  const strengths = Array.isArray(student.strengths) ? student.strengths : [];
  const goals = Array.isArray(student.goals) ? student.goals : [];

  return (
    <div className="rounded-3xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-8 backdrop-blur max-w-4xl transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 pb-8 border-b border-border dark:border-white/10">
        <div className="flex items-center gap-4">
          <StudentAvatar name={student.name} avatar={student.avatar} size="lg" />
          <div>
            <h1 className="text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">{student.name}</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{student.email}</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">{student.grade}</p>
          </div>
        </div>
        {/* <Button variant="outline">Edit Profile</Button> */}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Issues */}
        <Section title="Focus Areas" icon="⚠️">
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 mt-1">•</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">{issue}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Strengths */}
        <Section title="Strengths" icon="⭐">
          <div className="space-y-2">
            {strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-primary-500 dark:text-primary-400 mt-1">•</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">{strength}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Goals */}
        <Section title="Learning Goals" icon="🎯">
          <div className="space-y-2">
            {goals.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-secondary-500 dark:text-secondary-400 mt-1">•</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">{goal}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick Stats */}
        <Section title="Snapshot" icon="📊">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Issues" value={issues.length} />
            <Stat label="Strengths" value={strengths.length} />
            <Stat label="Goals" value={goals.length} />
            <Stat label="Status" value="Active" />
          </div>
        </Section>
      </div>

      {/* Plan Section */}
      <div className="rounded-2xl border border-primary-400/30 dark:border-primary-500/40 bg-primary-100/50 dark:bg-primary-900/30 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">📋 Learning Plan</h3>
          <Button variant="primary" size="sm" onClick={onEditPlan}>
            Generate AI Plan
          </Button>
        </div>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
          Generate a personalized learning plan backed by the latest research matched to this student's profile automatically.
        </p>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-border dark:border-white/10 p-5 transition-colors">
      <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center gap-2">
        <span aria-hidden>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center rounded-xl bg-surface-light dark:bg-surface-dark/50 p-4 transition-colors">
      <p className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">{value}</p>
      <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mt-1">{label}</p>
    </div>
  );
}

