import type { SpinSegment } from '../components/SpinWheel';

export interface SpinReward {
  id: string;
  label: string;
  value: string;
  amount: string;
  image?: string;
}

export interface ServerSpinResponse {
  targetIndex: number;
  reward: SpinReward;
  txId: string;
  timestamp: number;
}

/**
 * Server-Authoritative Spin Service
 * 
 * NOTE: Currently simulates a server-determined spin with weighted probabilities
 * and network latency. When your backend API is ready, simply replace the mock logic
 * below with a real API request:
 * 
 * const response = await fetch('/api/spin', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` }
 * });
 * return await response.json();
 */
export async function requestServerSpin(segments: SpinSegment[]): Promise<ServerSpinResponse> {
  // 1. Simulate realistic server API latency (150ms - 250ms)
  await new Promise((resolve) => setTimeout(resolve, 180));

  if (!segments || segments.length === 0) {
    throw new Error('No spin segments available');
  }

  // 2. Server-side weighted probability roll
  // Example weights: Jackpot (5%), Admission Tickets (15%), Coins (25%), Diamonds (55% total)
  const weights = segments.map((seg) => {
    if (seg.value === 'jackpot') return 5;
    if (seg.value === 'tickets') return 15;
    if (seg.value === 'coins') return 25;
    return 30; // gems / diamonds
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  let targetIndex = 0;

  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      targetIndex = i;
      break;
    }
    random -= weights[i];
  }

  const winningSegment = segments[targetIndex];

  // 3. Predetermined reward payload
  const rewardAmount =
    winningSegment.value === 'jackpot'
      ? '$10.00'
      : winningSegment.value === 'coins'
      ? '$0.20'
      : winningSegment.value === 'tickets'
      ? '3 Tickets'
      : '80 💎';

  return {
    targetIndex,
    reward: {
      id: `rew-${Date.now()}`,
      label: winningSegment.label,
      value: winningSegment.value,
      amount: rewardAmount,
      image: winningSegment.image
    },
    txId: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: Date.now()
  };
}
