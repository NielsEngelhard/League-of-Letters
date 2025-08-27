import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
import { hasValidApikey } from '../webhook-utils';
import RemoveExpiredGames from '@/features/game/actions/command/remove-expired-games-command';
import RemoveExpiredGuestAccounts from '@/features/account/actions/command/remove-expired-guest-accounts';

// Clean database with expired records
export async function POST(req: NextRequest) {
  if (!hasValidApikey(req)) {
    return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
  }

  try {
    await db.transaction(async (tx) => {
      // Remove games older than 24 hours
      await RemoveExpiredGames(24, tx);

      // Remove expired guest accounts
      await RemoveExpiredGuestAccounts(tx);
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook "remove-expired-records":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
