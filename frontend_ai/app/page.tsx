import { PostForm } from '../components/PostForm';
import { Queue } from '../components/Queue';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Social Media Post Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <PostForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Post Queue</h2>
          <Queue />
        </div>
      </div>
    </div>
  );
}
