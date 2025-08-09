

import { Project, ClientCompany } from '../types';

const now = new Date().toISOString();

const mockClients: Record<string, ClientCompany> = {
  synthwave: {
    id: 'client_01',
    recordId: 'rec_client_01',
    createdTime: now,
    name: 'SynthWave Inc.',
    website: 'https://synthwave.dev',
    logoUrl: 'https://placehold.co/100x100/1e293b/7c3aed/png?text=SI',
    dashboardTitle: 'SynthWave Project Hub',
    colorScheme: 'purple',
    clientUsername: 'synthwave_user'
  },
  pixelperfect: {
    id: 'client_02',
    recordId: 'rec_client_02',
    createdTime: now,
    name: 'PixelPerfect Co.',
    website: 'https://pixelperfect.design',
    logoUrl: 'https://placehold.co/100x100/1e293b/3b82f6/png?text=PP',
    dashboardTitle: 'PixelPerfect Creations',
    colorScheme: 'blue',
    clientUsername: 'pixel_perfect'
  },
  globalgoods: {
    id: 'client_03',
    recordId: 'rec_client_03',
    createdTime: now,
    name: 'Global Goods',
    website: 'https://globalgoods.com',
    logoUrl: 'https://placehold.co/100x100/1e293b/10b981/png?text=GG',
    dashboardTitle: 'Global Goods Portal',
    colorScheme: 'green',
    clientUsername: 'global_goods'
  },
  innovate: {
    id: 'client_04',
    recordId: 'rec_client_04',
    createdTime: now,
    name: 'Innovate Solutions',
    logoUrl: 'https://placehold.co/100x100/1e293b/0ea5e9/png?text=IS',
    dashboardTitle: 'Innovate Solutions HQ',
    colorScheme: 'slate',
    clientUsername: 'innovate_user'
  },
  fashionforward: {
    id: 'client_05',
    recordId: 'rec_client_05',
    createdTime: now,
    name: 'FashionForward',
    website: 'https://fashionforward.style',
    logoUrl: 'https://placehold.co/100x100/1e293b/f59e0b/png?text=FF',
    dashboardTitle: 'FashionForward Dashboard',
    colorScheme: 'orange',
    clientUsername: 'ff_style'
  },
};

export const mockProjects: Project[] = [
  {
    id: 'project_01',
    recordId: 'rec_project_01',
    createdTime: now,
    name: 'Q3 Social Media Campaign',
    client_id: ['rec_client_01'],
    client: mockClients.synthwave,
    status: 'In Progress',
    projectGoal: 'Increase brand engagement and followers across all social media platforms by 25%.',
    deliverables: [
      { id: 'del_01a', name: 'Initial Strategy Document', status: 'Done', description: 'Finalize and approve the overall campaign strategy and objectives.', phase: '1', recordId: 'rec_del_01a', createdTime: now, project_id: ['rec_project_01'] },
      { id: 'del_01b', name: 'Content Calendar Finalization', status: 'Done', description: 'Plan all content for the first month, including topics, formats, and post dates.', phase: '1', recordId: 'rec_del_01b', createdTime: now, project_id: ['rec_project_01'] },
      { id: 'del_01c', name: 'First Batch of Creatives', status: 'In Progress', description: 'Design and write copy for the first two weeks of social media posts.', phase: '2', recordId: 'rec_del_01c', createdTime: now, project_id: ['rec_project_01'] },
      { id: 'del_01d', name: 'Campaign Launch', status: 'To Do', description: 'Execute the launch of the campaign across all targeted platforms.', phase: '3', recordId: 'rec_del_01d', createdTime: now, project_id: ['rec_project_01'] },
    ],
  },
  {
    id: 'project_02',
    recordId: 'rec_project_02',
    createdTime: now,
    name: 'Website Redesign',
    client_id: ['rec_client_02'],
    client: mockClients.pixelperfect,
    status: 'In Progress',
    projectGoal: 'Launch a modern, responsive, and user-friendly website to improve conversion rates.',
    deliverables: [
      { id: 'del_02a', name: 'Wireframes & Mockups', status: 'Done', description: 'Create and get approval on the visual blueprint and design of the new website.', phase: '1', recordId: 'rec_del_02a', createdTime: now, project_id: ['rec_project_02'] },
      { id: 'del_02b', name: 'Frontend Development', status: 'In Progress', description: 'Code the client-side of the website based on the approved mockups.', phase: '2', recordId: 'rec_del_02b', createdTime: now, project_id: ['rec_project_02'] },
      { id: 'del_02c', name: 'Backend Integration', status: 'To Do', description: 'Connect the frontend to the CMS and any necessary APIs.', phase: '3', recordId: 'rec_del_02c', createdTime: now, project_id: ['rec_project_02'] },
      { id: 'del_02d', name: 'User Acceptance Testing', status: 'To Do', description: 'Perform thorough testing with a sample of target users.', phase: '4', recordId: 'rec_del_02d', createdTime: now, project_id: ['rec_project_02'] },
    ],
  },
  {
    id: 'project_03',
    recordId: 'rec_project_03',
    createdTime: now,
    name: 'E-commerce SEO Overhaul',
    client_id: ['rec_client_03'],
    client: mockClients.globalgoods,
    status: 'Completed',
    projectGoal: 'Improve search engine rankings for key product categories and increase organic traffic by 30%.',
    deliverables: [
      { id: 'del_03a', name: 'Keyword Research', status: 'Done', description: 'Identify and prioritize target keywords for all major product categories.', phase: '1', recordId: 'rec_del_03a', createdTime: now, project_id: ['rec_project_03'] },
      { id: 'del_03b', name: 'On-Page Optimization', status: 'Done', description: 'Optimize meta tags, content, and internal linking for target keywords.', phase: '2', recordId: 'rec_del_03b', createdTime: now, project_id: ['rec_project_03'] },
      { id: 'del_03c', name: 'Link Building Campaign', status: 'Done', description: 'Acquire high-quality backlinks to key category and product pages.', phase: '3', recordId: 'rec_del_03c', createdTime: now, project_id: ['rec_project_03'] },
      { id: 'del_03d', name: 'Final Performance Report', status: 'Done', description: 'Compile and present a report on SEO improvements and traffic growth.', phase: '5', recordId: 'rec_del_03d', createdTime: now, project_id: ['rec_project_03'] },
    ],
  },
  {
    id: 'project_04',
    recordId: 'rec_project_04',
    createdTime: now,
    name: 'New Product Launch Video',
    client_id: ['rec_client_04'],
    client: mockClients.innovate,
    status: 'In Progress',
    projectGoal: 'Create a compelling promotional video to support the launch of the new flagship product.',
    deliverables: [
      { id: 'del_04a', name: 'Script & Storyboard', status: 'Done', description: 'Finalize the video script and create a visual storyboard.', phase: '1', recordId: 'rec_del_04a', createdTime: now, project_id: ['rec_project_04'] },
      { id: 'del_04b', name: 'Filming & Production', status: 'In Progress', description: 'Shoot all required scenes for the promotional video.', phase: '2', recordId: 'rec_del_04b', createdTime: now, project_id: ['rec_project_04'] },
      { id: 'del_04c', name: 'Post-Production & Editing', status: 'To Do', description: 'Edit footage, add graphics, and finalize the video.', phase: '3', recordId: 'rec_del_04c', createdTime: now, project_id: ['rec_project_04'] },
      { id: 'del_04d', name: 'Weekly Social Media Snippets', status: 'Recurring', description: 'Create short clips from the main video for weekly social media pushes.', phase: 'other', recordId: 'rec_del_04d', createdTime: now, project_id: ['rec_project_04'] },
    ],
  },
  {
    id: 'project_05',
    recordId: 'rec_project_05',
    createdTime: now,
    name: 'PPC Campaign for Fall Season',
    client_id: ['rec_client_05'],
    client: mockClients.fashionforward,
    status: 'On Hold',
    projectGoal: 'Drive sales for the new fall collection through targeted pay-per-click advertising.',
    deliverables: [
      { id: 'del_05a', name: 'Ad Copy Creation', status: 'Deferred', description: 'Drafting of ad copy is paused pending budget approval.', phase: '1', recordId: 'rec_del_05a', createdTime: now, project_id: ['rec_project_05'] },
      { id: 'del_05b', name: 'Landing Page Design', status: 'To Do', description: 'Design a high-converting landing page for the campaign.', phase: '1', recordId: 'rec_del_05b', createdTime: now, project_id: ['rec_project_05'] },
    ],
  },
];

export const mockClientCompanies = Object.values(mockClients);