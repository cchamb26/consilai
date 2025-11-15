import Link from 'next/link';
import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentCard({ student }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <StudentAvatar name={student.name} avatar={student.avatar} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-white">{student.name}</h3>
            <p className="text-sm text-slate-400">{student.grade}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Issues */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Focus Areas</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {student.issues.slice(0, 2).map((issue, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-100 border border-rose-500/30">
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Strengths</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {student.strengths.slice(0, 2).map((strength, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-100 border border-emerald-500/30">
                {strength}
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
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </div>
    </div>
  );
}

