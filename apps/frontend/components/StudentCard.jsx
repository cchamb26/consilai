import Link from 'next/link';
import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentCard({ student, onEdit }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary-200/80 to-secondary-200/80 dark:from-primary-800/50 dark:to-secondary-800/50 border border-border dark:border-white/10 backdrop-blur p-6 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <StudentAvatar name={student.name} avatar={student.avatar} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{student.name}</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{student.grade}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Focus Areas */}
        <div>
          <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-1.5">
            {(student.issues || []).map((issue, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 dark:bg-rose-500/30 text-rose-700 dark:text-rose-300 border border-rose-500/40 dark:border-rose-500/50"
              >
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">Strengths</p>
          <div className="flex flex-wrap gap-1.5">
            {(student.strengths || []).map((strength, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-primary-200/50 dark:bg-primary-900/60 text-primary-800 dark:text-primary-200 border border-primary-400/50 dark:border-primary-700/50"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div>
          <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">Learning Goals</p>
          <div className="flex flex-wrap gap-1.5">
            {(student.goals || []).map((goal, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary-200/50 dark:bg-secondary-900/60 text-secondary-800 dark:text-secondary-200 border border-secondary-400/50 dark:border-secondary-700/50"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-8">
        <Link href={`/students/${student.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
        <Link href={`/students/${student.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

