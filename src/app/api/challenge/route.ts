import { NextResponse } from 'next/server';
import { generateChallenge } from '@/lib/pow';

export async function GET() {
  try {
    const challenge = await generateChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Failed to generate cryptographic challenge:', error);
    return NextResponse.json(
      { error: 'Failed to generate cryptographic challenge' },
      { status: 500 }
    );
  }
}
