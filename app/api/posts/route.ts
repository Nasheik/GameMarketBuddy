import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, mediaUrl, mediaType, platform, scheduledFor } = body;

    // Create the post
    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl,
        mediaType,
        platform,
        scheduledFor,
        status: scheduledFor ? 'queued' : 'draft',
      },
    });

    // If the post is scheduled, update its queue position
    if (scheduledFor) {
      const queuePosition = await prisma.post.count({
        where: {
          scheduledFor: {
            lte: scheduledFor,
          },
        },
      });

      await prisma.post.update({
        where: { id: post.id },
        data: { queuePosition },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        { scheduledFor: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 