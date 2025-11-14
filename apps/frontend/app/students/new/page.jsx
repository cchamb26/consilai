import Link from 'next/link';
import Button from '../../../components/Button';
import StudentForm from '../../../components/StudentForm';

export default function NewStudentPage() {
  const handleSubmit = (formData) => {
    console.log('New student submitted:', formData);
    // In a real app, this would send data to the backend
    alert('Student added! (This is a demo - data is not persisted)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/students" className="text-blue-600 hover:underline">Students</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">New Student</span>
        </div>

        <StudentForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

