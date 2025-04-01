const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create sample queues
  const marketingQueue = await prisma.queue.create({
    data: {
      name: 'Marketing Posts',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const announcementsQueue = await prisma.queue.create({
    data: {
      name: 'Game Announcements',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create sample posts
  const posts = [
    {
      content: '🎮 Exciting news! Our new game "Space Adventure" is coming soon! #gamedev #indiegame',
      mediaUrl: 'https://example.com/space-adventure.jpg',
      mediaType: 'image',
      platform: 'twitter',
      status: 'draft',
      queueId: announcementsQueue.id,
      queuePosition: 1,
    },
    {
      content: 'Join us for our weekly dev stream! We\'ll be showing off new features and answering your questions.',
      mediaUrl: 'https://example.com/dev-stream.jpg',
      mediaType: 'image',
      platform: 'twitter',
      status: 'queued',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      queueId: marketingQueue.id,
      queuePosition: 1,
    },
    {
      content: 'Check out our latest blog post about game development tips!',
      mediaUrl: 'https://example.com/blog-post.jpg',
      mediaType: 'image',
      platform: 'facebook',
      status: 'draft',
      queueId: marketingQueue.id,
      queuePosition: 2,
    },
    {
      content: 'Behind the scenes: Meet our amazing development team! 🎮✨',
      mediaUrl: 'https://example.com/team-video.mp4',
      mediaType: 'video',
      platform: 'instagram',
      status: 'queued',
      scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      queueId: marketingQueue.id,
      queuePosition: 3,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 