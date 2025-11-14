import Link from 'next/link';
import StudentAvatar from './StudentAvatar';
import Button from './Button';

export default function StudentCard({ student }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <StudentAvatar name={student.name} avatar={student.avatar} size="md" />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.grade}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Issues */}
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Current Issues</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {student.issues.slice(0, 2).map((issue, idx) => (
              <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Strengths</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {student.strengths.slice(0, 2).map((strength, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {strength}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
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

