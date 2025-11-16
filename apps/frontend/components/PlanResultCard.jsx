import { useState } from 'react';
import Button from './Button';

// Normalize milestones so we can handle either plain strings or
// structured objects with { title, details[] }.
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

  return (
    <li className="rounded-2xl border border-border dark:border-white/10 bg-primary-50 dark:bg-primary-900/30 overflow-hidden transition-colors">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400" />
          <span className="text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark">
            {milestone.title || `Milestone ${index + 1}`}
          </span>
        </div>
        {hasDetails && (
          <span
            className={`text-xs text-text-secondary-light dark:text-text-secondary-dark transition-transform ${
              open ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        )}
      </button>

      {hasDetails && open && (
        <div className="px-8 pb-4 pt-1 bg-surface-light dark:bg-surface-dark/70 border-t border-border dark:border-white/10">
          <ul className="list-disc space-y-1 text-sm text-text-primary-light dark:text-text-primary-dark ml-4">
            {milestone.details.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function PlanResultCard({
  plan,
  studentName,
  onSave,
  onDownloadCsv,
  isSaving = false,
}) {
  const normalized = normalizeMilestones(plan.milestones || []);
  const sources = Array.isArray(plan.sources) ? plan.sources : [];
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 overflow-hidden backdrop-blur transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-white/10 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-text-secondary-light dark:text-text-secondary-dark">
          Plan Ready
        </p>
        <h3 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {plan.title}
        </h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Personalized for {studentName}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        {/* Objectives */}
        <div>
          <h4 className="text-sm uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mb-2">
            🎯 Focus
          </h4>
          <p className="text-base text-text-primary-light dark:text-text-primary-dark leading-relaxed whitespace-pre-wrap">
            {plan.objectives}
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
              Start
            </p>
            <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-1">
              {plan.startDate}
            </p>
          </div>
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
              End
            </p>
            <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-1">
              {plan.endDate}
            </p>
          </div>
          <div className="rounded-2xl border border-border dark:border-white/10 p-4 bg-primary-50 dark:bg-primary-900/30 transition-colors">
            <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
              Status
            </p>
            <p className="text-lg font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
              {plan.status}
            </p>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h4 className="text-sm uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mb-3">
            📋 Milestones
          </h4>
          <ul className="space-y-3">
            {normalized.map((milestone, idx) => (
              <MilestoneAccordionItem
                key={idx}
                milestone={milestone}
                index={idx}
              />
            ))}
          </ul>
        </div>

        {/* Sources used */}
        {sources.length > 0 && (
          <div className="rounded-2xl border border-border dark:border-white/10 bg-surface-light/70 dark:bg-surface-dark/70 overflow-hidden transition-colors">
            <button
              type="button"
              onClick={() => setSourcesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-primary-50/60 dark:hover:bg-primary-900/40 transition-colors"
            >
              <span className="text-sm uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
                🔗 Sources Used
              </span>
              <span
                className={`text-xs text-text-secondary-light dark:text-text-secondary-dark transition-transform ${
                  sourcesOpen ? 'rotate-90' : ''
                }`}
              >
                ▶
              </span>
            </button>

            {sourcesOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-border dark:border-white/10">
                <ul className="space-y-2 text-sm text-text-primary-light dark:text-text-primary-dark">
                  {sources.map((src, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary-400 dark:bg-primary-500" />
                      <div>
                        <a
                          href={src.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className={`hover:text-primary-600 dark:hover:text-primary-300 ${
                            src.url
                              ? 'underline decoration-primary-400/70'
                              : ''
                          }`}
                        >
                          {src.title || 'Untitled source'}
                        </a>
                        {src.source && (
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
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
          <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            🤖 AI Insights
          </p>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Generated by combining student context with continuously refreshed research summaries. Progress check-ins recalibrate the plan over time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex gap-2 border-t border-border dark:border-white/10 bg-background-light dark:bg-background-dark/50 transition-colors">
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
      </div>
    </div>
  );
}

