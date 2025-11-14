import Link from 'next/link';
import Button from '../components/Button';

export default function Home() {
  const features = [
    {
      id: 1,
      title: 'Students',
      description: 'Manage and track student profiles, issues, strengths, and goals',
      icon: '👥',
      href: '/students',
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      title: 'Classroom Simulation',
      description: 'Interactive seating chart with drag-and-drop placement',
      icon: '🪑',
      href: '/classroom',
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 3,
      title: 'AI Plan Generator',
      description: 'Generate personalized learning plans backed by leading educational research',
      icon: '🤖',
      href: '/plans',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  const workflowSteps = [
    {
      number: '1',
      title: 'Profile Students',
      description: 'Capture each student’s issues, goals, and strengths in the UI.',
    },
    {
      number: '2',
      title: 'Auto Keyword Extraction',
      description: 'The backend transforms student details into smart research search terms.',
    },
    {
      number: '3',
      title: 'Background Research Scrape',
      description: 'Scrapers quietly gather current evidence—no uploads required from teachers.',
    },
    {
      number: '4',
      title: 'AI Summaries',
      description: 'Backend services condense the research corpus into actionable insights.',
    },
    {
      number: '5',
      title: 'Plan Generator',
      description: 'Teachers view the finalized, research-backed plan directly in the UI.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">ConsilAI</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-Powered Teacher Assistant for Student Support & Classroom Management
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Manage student profiles, simulate classrooms, and deliver research-backed learning plans—our backend handles every research scrape and summary automatically.
          </p>
          <Link href="/students">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Core Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer h-full">
                <div className={`bg-gradient-to-r ${feature.color} h-32 flex items-center justify-center`}>
                  <span className="text-6xl">{feature.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <div className="text-blue-600 font-semibold text-sm">
                    Explore →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {workflowSteps.map(step => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Plus: Interactive Classroom</h3>
            <p className="text-gray-700 mb-4">
              Simulate classroom seating arrangements with drag-and-drop functionality. Organize your classroom to optimize student interactions and collaboration.
            </p>
            <Link href="/classroom">
              <Button variant="primary">Try Classroom Simulator</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Start using ConsilAI today to support your students better.
          </p>
          <Link href="/students">
            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full font-bold text-xl">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

