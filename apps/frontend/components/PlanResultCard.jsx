import { useState } from 'react';
import Button from './Button';

<<<<<<< HEAD
function normalizeMilestones(milestones = []) {
  return milestones.map((m) => {
    if (typeof m === 'string') {
      return { title: m, details: [] };
    }
    return {
      title: m.title || '',
      details: Array.isArray(m.details) ? m.details : [],
    };
  });
}

function MilestoneAccordionItem({ milestone, index }) {
  const [open, setOpen] = useState(false);
  const hasDetails = milestone.details && milestone.details.length > 0;

  const toggle = () => {
    if (hasDetails) {
      setOpen((prev) => !prev);
    }
  };

=======
export default function PlanResultCard({
  plan,
  studentName,
  onSave,
  onDownloadCsv,
  isSaving = false,
}) {
>>>>>>> 053c3c0 (I got rid of the edit button for plans and made it so we generate CSVs instead of PDFs.)
  return (
    <li
      className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
          <span className="text-slate-200 text-sm leading-relaxed">
            {milestone.title || `Milestone ${index + 1}`}
          </span>
        </div>
        {hasDetails && (
          <span
            className={`text-xs text-slate-400 transition-transform ${
              open ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        )}
      </button>

      {hasDetails && open && (
        <div className="px-8 pb-4 pt-1 bg-slate-950/40 border-t border-white/10">
          <ul className="list-disc space-y-1 text-sm text-slate-200 ml-4">
            {milestone.details.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function PlanResultCard({ plan, studentName }) {
  const normalized = normalizeMilestones(plan.milestones || []);
  const sources = Array.isArray(plan.sources) ? plan.sources : [];
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 overflow-hidden backdrop-blur transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-white/10 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-text-secondary-light dark:text-text-secondary-dark">Plan Ready</p>
        <h3 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">{plan.title}</h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Personalized for {studentName}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        {/* Objectives */}
        <div>
<<<<<<< HEAD
          <h4 className="text-sm uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mb-2">🎯 Focus</h4>
          <p className="text-base text-text-primary-light dark:text-text-primary-dark leading-relaxed">{plan.objectives}</p>
=======
          <h4 className="text-sm uppercase tracking-wide text-slate-400 mb-2">🎯 Focus</h4>
          <p className="text-base text-slate-100 leading-relaxed whitespace-pre-wrap">
            {plan.objectives}
          </p>
>>>>>>> 053c3c0 (I got rid of the edit button for plans and made it so we generate CSVs instead of PDFs.)
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Start</p>
            <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-1">{plan.startDate}</p>
          </div>
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">End</p>
            <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-1">{plan.endDate}</p>
          </div>
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Status</p>
            <p className="text-lg font-semibold text-emerald-500 dark:text-emerald-400 mt-1">{plan.status}</p>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h4 className="text-sm uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mb-3">📋 Milestones</h4>
          <ul className="space-y-3">
<<<<<<< HEAD
            {plan.milestones.map((milestone, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-border dark:border-white/10 transition-colors">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                <span className="text-text-primary-light dark:text-text-primary-dark text-sm leading-relaxed">{milestone}</span>
              </li>
=======
            {normalized.map((milestone, idx) => (
              <MilestoneAccordionItem
                key={idx}
                milestone={milestone}
                index={idx}
              />
>>>>>>> 2883977db3f647a6b8cb70072086d8f31d3936a3
            ))}
          </ul>
        </div>

        {/* Sources used */}
        {sources.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              type="button"
              onClick={() => setSourcesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
            >
              <span className="text-sm uppercase tracking-wide text-slate-400">
                🔗 Sources Used
              </span>
              <span
                className={`text-xs text-slate-400 transition-transform ${
                  sourcesOpen ? 'rotate-90' : ''
                }`}
              >
                ▶
              </span>
            </button>

            {sourcesOpen && (
              <div className="px-4 pb-4 pt-1 bg-slate-950/40 border-t border-white/10">
                <ul className="space-y-2 text-sm text-slate-200">
                  {sources.map((src, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <div>
                        <a
                          href={src.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className={`hover:text-indigo-300 ${
                            src.url ? 'underline decoration-slate-500/70' : ''
                          }`}
                        >
                          {src.title || 'Untitled source'}
                        </a>
                        {src.source && (
                          <p className="text-xs text-slate-500">
                            {src.source}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* AI Insights (placeholder) */}
        <div className="rounded-2xl border border-primary-400/30 dark:border-primary-500/40 bg-primary-100/50 dark:bg-primary-900/30 p-4 transition-colors">
          <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">🤖 AI Insights</p>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Generated by combining student context with continuously refreshed research summaries. Progress check-ins recalibrate the plan over time.
          </p>
        </div>
      </div>

      {/* Footer */}
<<<<<<< HEAD
      <div className="px-6 py-4 flex gap-2 border-t border-border dark:border-white/10 bg-background-light dark:bg-background-dark/50 transition-colors">
        <Button variant="success" size="sm">Save Plan</Button>
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="secondary" size="sm">Download PDF</Button>
=======
      <div className="px-6 py-4 flex gap-2 border-t border-white/10 bg-slate-950/50">
        <Button
          variant="success"
          size="sm"
          disabled={isSaving || !onSave}
          onClick={onSave}
        >
          {isSaving ? 'Saving…' : 'Save Plan'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onDownloadCsv}
        >
          Download CSV
        </Button>
>>>>>>> 053c3c0 (I got rid of the edit button for plans and made it so we generate CSVs instead of PDFs.)
      </div>
    </div>
  );
}

