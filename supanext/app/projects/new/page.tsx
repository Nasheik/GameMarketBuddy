import CreateProjectForm from '@/app/components/project/create-project-form';

export default function NewProject() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>
        <CreateProjectForm />
      </div>
    </div>
  );
} 