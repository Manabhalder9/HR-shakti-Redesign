import { ArrowRight } from 'lucide-react';
import { Link } from '../context/RouterContext';
import { UPCOMING_MODULES } from '../data/workspaceNavigation';
import { PageHeader, WorkspaceLayout } from './WorkspaceLayout';

export function WorkspaceModuleShellPage({ moduleKey }: { moduleKey: string }) {
  const mod = UPCOMING_MODULES[moduleKey] || UPCOMING_MODULES.files;

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={mod.eyebrow}
        title={mod.title}
        description={mod.description}
        action={
          <Link href="/dashboard" className="button button-secondary">
            Back to Dashboard
          </Link>
        }
      />

      <section className="panel workspace-module-shell">
        <div className="workspace-module-shell-header">
          <div>
            <h2>Module roadmap</h2>
            <p className="workspace-module-note">{mod.phaseNote}</p>
          </div>
        </div>

        <div className="workspace-module-grid">
          <div className="workspace-module-block">
            <h3>Planned capabilities</h3>
            <ul className="workspace-module-list">
              {mod.plannedCapabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="workspace-module-block">
            <h3>Explore active related pages</h3>
            <div className="workspace-module-links">
              {mod.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="workspace-module-link">
                  <span>{link.label}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </WorkspaceLayout>
  );
}
