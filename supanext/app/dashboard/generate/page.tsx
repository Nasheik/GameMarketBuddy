import { Metadata } from 'next';
// import PostGenerator from '@/components/dashboard/post-generator';

export const metadata: Metadata = {
  title: 'Generate Posts',
  description: 'Generate social media posts for your game',
};

export default function GeneratePage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generate Posts</h1>
      </div>
      {/* <PostGenerator /> */}
    </div>
  );
} 