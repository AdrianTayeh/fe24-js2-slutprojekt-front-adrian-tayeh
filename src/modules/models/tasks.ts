export type Task =  {
    id: string;
    title: string;
    description: string;
    category: 'ux' | 'frontend' | 'backend';
    status: 'to do' | 'in progress' | 'done';
    assigned?: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
}