
import React from 'react';
import { Project, Deliverable } from '../types';
import { X, Check } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface DeliverablesModalProps {
  project: Project;
  onClose: () => void;
}

const statusColorMap: Record<Deliverable['status'], string> = {
  'To Do': 'text-text-secondary',
  'In Progress': 'text-blue-400',
  'Done': 'text-green-400',
  'Recurring': 'text-purple-400',
  'Deferred': 'text-yellow-400',
};

const DeliverableItem: React.FC<{
  deliverable: Deliverable;
  projectId: string;
}> = ({ deliverable, projectId }) => {
  const { toggleDeliverable } = useAppContext();

  const handleToggle = () => {
    toggleDeliverable(projectId, deliverable.recordId, deliverable.status);
  };

  const isDone = deliverable.status === 'Done';

  return (
    <li className="flex items-center justify-between py-3 px-4 bg-secondary rounded-md mb-3 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded-md flex items-center justify-center mr-4 border-2 transition-all duration-200 ${
            isDone ? 'bg-brand border-brand' : 'bg-surface border-subtle hover:border-brand'
          }`}
          aria-label={`Mark ${deliverable.name} as ${isDone ? 'incomplete' : 'complete'}`}
        >
          {isDone && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
        <span className={`${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
          {deliverable.name}
        </span>
      </div>
      <div className="text-right">
        <span className={`text-sm font-semibold capitalize ${statusColorMap[deliverable.status]}`}>
            {deliverable.status}
        </span>
      </div>
    </li>
  );
};

const DeliverablesModal: React.FC<DeliverablesModalProps> = ({ project, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-surface border border-subtle rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-subtle">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-text-primary">{project.name}</h2>
            <p className="text-text-secondary">{project.client.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Deliverables Checkpoint</h3>
          <ul>
            {project.deliverables.map(deliverable => (
              <DeliverableItem
                key={deliverable.recordId}
                deliverable={deliverable}
                projectId={project.recordId}
              />
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default DeliverablesModal;
