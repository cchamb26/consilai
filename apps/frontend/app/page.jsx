import Link from 'next/link';
import Button from '../components/Button';

export default function Home() {
  const features = [
    {
      id: 1,
      title: 'Students',
      description: 'All profiles, history, and context surfaced instantly.',
      icon: '👥',
      href: '/students',
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      id: 2,
      title: 'Classroom Simulation',
      description: 'Design seating layouts that adapt to behavior and goals.',
      icon: '🪑',
      href: '/classroom',
      accent: 'from-purple-500 to-indigo-500',
    },
    {
      id: 3,
      title: 'AI Plan Generator',
      description: 'Generate personalized plans backed by hidden research.',
      icon: '🤖',
      href: '/plans',
      accent: 'from-amber-400 to-rose-400',
    },
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Profile Students',
      description: 'Capture the student’s challenges, strengths, and aspirations—this is the only manual step.',
    },
    {
      number: '02',
      title: 'Research Intelligence',
      description: 'ConsilAI extracts signals, scrapes vetted research, and assembles evidence-backed strategies quietly in the background.',
    },
    {
      number: '03',
      title: 'Plan Delivery',
      description: 'You receive a polished, ready-to-use learning plan with zero extra clicks or uploads.',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">ConsilAI</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            A calm command center for every student, every classroom, every plan.
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl">
            ConsilAI pairs elegant tooling with invisible research automation. Profile students, shape classrooms, and deliver AI plans that feel handcrafted—without exposing the complexity underneath.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/students">
              <Button variant="primary" size="lg">
                Explore Students
              </Button>
            </Link>
            <Link href="/plans">
              <Button variant="secondary" size="lg">
                Generate a Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href} className="group">
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/30 transition">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 mb-6">{feature.description}</p>
                <span className="text-sm text-slate-300 group-hover:text-white transition">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 space-y-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Flow</p>
            <h2 className="text-3xl font-semibold">Research stays hidden. The experience stays effortless.</h2>
            <p className="text-slate-400 max-w-3xl">
               Every plan is powered by quiet automation you never have to manage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowSteps.map(step => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-slate-900 to-slate-950 p-10 flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-indigo-200">Start</p>
            <h3 className="text-3xl font-semibold">Orchestrate every student journey from one calm interface.</h3>
            <p className="text-slate-200 max-w-2xl">
              Students, classrooms, plans—kept in sync with zero clutter. ConsilAI keeps research invisible so you can focus on decisions, not documentation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/students">
              <Button variant="primary" size="lg">
                Go to Students
              </Button>
            </Link>
            <Link href="/classroom">
              <Button variant="outline" size="lg">
                Open Classroom
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full flex flex-col items-center text-center gap-3">
      <span className="text-xs uppercase tracking-[0.4em] text-slate-500">{number}</span>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

