
import React from 'react';
import { Project, Deliverable } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailsPageProps {
  project: Project;
  onBack: () => void;
}

const statusConfig: Record<Deliverable['status'], { color: string; pulse?: boolean, textColor: string }> = {
  'To Do': { color: 'bg-text-secondary/50', textColor: 'text-text-secondary' },
  'In Progress': { color: 'bg-blue-500', pulse: true, textColor: 'text-blue-400' },
  'Done': { color: 'bg-green-500', textColor: 'text-green-400' },
  'Recurring': { color: 'bg-purple-500', textColor: 'text-purple-400' },
  'Deferred': { color: 'bg-yellow-500', textColor: 'text-yellow-400' },
};

const phaseInfo = [
  { key: '1', title: 'Foundation', description: 'Onboarding, platform access, and initial audits to set the stage for success.' },
  { key: '2', title: 'Authority Platform', description: 'Technical SEO, Google Business Profile optimization, and review system implementation.' },
  { key: '3', title: 'Content Engine', description: 'Developing and producing a strategic content plan including articles and videos.' },
  { key: '4', title: 'Distribution', description: 'Actively distributing content, building backlinks, and executing PR campaigns.' },
  { key: '5', title: 'Optimization', description: 'Ongoing performance reviews and strategic planning for continuous growth.' }
];

const DeliverableCard: React.FC<{ deliverable: Deliverable, isLast: boolean }> = ({ deliverable, isLast }) => {
  const config = statusConfig[deliverable.status];
  const animationClass = config.pulse ? 'animate-pulse' : '';

  return (
    <li className="relative pl-12 pb-8">
      {/* Timeline Line */}
      {!isLast && <div className="absolute left-[19px] top-5 h-full w-0.5 bg-subtle"></div>}
      
      {/* Status Icon on Timeline */}
      <div className="absolute left-[13px] top-1.5 flex w-4 h-4 items-center justify-center">
        <div className={`w-3 h-3 rounded-full ${config.color} ${animationClass}`}></div>
      </div>

      {/* Card Content */}
      <div className="bg-surface border border-subtle rounded-lg p-5 ml-4">
        <h4 className="font-semibold text-text-primary text-md">{deliverable.name}</h4>
        <p className="text-text-secondary text-sm mt-1">{deliverable.description}</p>
        <div className="mt-3 text-xs font-semibold uppercase tracking-wider">
          <span className={config.textColor}>{deliverable.status}</span>
        </div>
      </div>
    </li>
  );
};

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project, onBack }) => {
  const completedDeliverables = project.deliverables.filter(d => d.status === 'Done').length;
  const totalDeliverables = project.deliverables.length;

  const deliverablesByPhase = project.deliverables.reduce((acc, deliverable) => {
    const phaseKey = deliverable.phase || 'other';
    if (!acc[phaseKey]) {
      acc[phaseKey] = [];
    }
    acc[phaseKey].push(deliverable);
    return acc;
  }, {} as Record<string, Deliverable[]>);
  
  const otherDeliverables = deliverablesByPhase['other'];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Projects</span>
        </button>
      </div>

      <div className="bg-surface border border-subtle rounded-lg p-6 mb-8">
        <div className="flex items-start sm:items-center">
            {project.client.logoUrl && (
                <img src={project.client.logoUrl} alt={`${project.client.name} logo`} className="w-12 h-12 rounded-md mr-4 bg-secondary object-cover flex-shrink-0" />
            )}
            <div className="min-w-0">
                 {project.client.website ? (
                    <a href={project.client.website} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-text-primary hover:text-brand transition-colors duration-200 underline-offset-4 hover:underline">
                        {project.client.name}
                    </a>
                ) : (
                    <h2 className="text-xl font-bold text-text-primary">{project.client.name}</h2>
                )}
                <p className="text-text-secondary mt-2 italic">"{project.projectGoal}"</p>
            </div>
        </div>
        <div className="mt-4">
          <span className="font-bold text-brand">{completedDeliverables} / {totalDeliverables}</span>
          <span className="text-text-secondary"> deliverables completed</span>
        </div>
      </div>
      
      <div className="space-y-12">
        {phaseInfo.map(phase => {
            const phaseKeyTyped = phase.key as keyof typeof deliverablesByPhase;
            const deliverablesInPhase = deliverablesByPhase[phaseKeyTyped];
            return (
              <div key={phase.key}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-5">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full font-bold text-brand mr-4 mb-3 sm:mb-0">
                      {phase.key}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">
                        Phase {phase.key}: {phase.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">{phase.description}</p>
                    </div>
                </div>
                {deliverablesInPhase && deliverablesInPhase.length > 0 ? (
                  <ul>
                    {deliverablesInPhase.map((d, index) => (
                      <DeliverableCard key={d.recordId} deliverable={d} isLast={index === deliverablesInPhase.length - 1} />
                    ))}
                  </ul>
                ) : (
                  <div className="relative pl-12">
                     <div className="pl-4 ml-4 border-l border-dashed border-subtle">
                      <div className="p-5 italic text-text-secondary/80">
                        No deliverables for this phase yet.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
        })}

        {otherDeliverables && otherDeliverables.length > 0 && (
          <div>
            <div className="flex items-center mb-5">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full font-bold text-brand mr-4">
                  O
                </div>
                <h3 className="text-xl font-bold text-text-primary capitalize">
                  Other Deliverables
                </h3>
            </div>
            <ul>
              {otherDeliverables.map((d, index) => (
                <DeliverableCard key={d.recordId} deliverable={d} isLast={index === otherDeliverables.length - 1} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
