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
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/students" className="hover:text-white transition">Students</Link>
          <span>/</span>
          <span className="text-slate-300">New</span>
        </div>

        <StudentForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

