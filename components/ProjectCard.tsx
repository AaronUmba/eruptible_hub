

import React from 'react';
import { Project } from '../types';
import ProgressBar from './ProgressBar';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const statusColors: Record<Project['status'], string> = {
  'To Do': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
  'On Hold': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Cancelled': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const completedDeliverables = project.deliverables.filter(d => d.status === 'Done').length;
  const totalDeliverables = project.deliverables.length;
  const progress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : (project.status === 'Completed' ? 100 : 0);

  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-surface border border-subtle rounded-lg p-5 cursor-pointer
                 transition-all duration-300 ease-in-out hover:border-brand/70 hover:shadow-lg hover:shadow-brand/10"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center min-w-0">
          {project.client.logoUrl && (
            <img src={project.client.logoUrl} alt={`${project.client.name} logo`} className="w-10 h-10 rounded-md mr-4 flex-shrink-0 bg-secondary object-cover" />
          )}
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-text-primary truncate" title={project.name}>{project.name}</h3>
            <p className="text-sm text-text-secondary truncate" title={project.client.name}>{project.client.name}</p>
          </div>
        </div>
        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-4 italic line-clamp-2 h-[40px]" title={project.projectGoal}>
        {project.projectGoal}
      </p>

      <div>
        <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
          <span>Progress</span>
          <span>{completedDeliverables} / {totalDeliverables}</span>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default ProjectCard;