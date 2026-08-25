import type { SpinSegment } from '../components/SpinWheel';
import { performServerSpin } from './dataService';

export interface SpinReward {
  id: string;
  label: string;
  value: string;
  amount: string;
  image?: string;
  isDouble?: boolean;
}

export interface ServerSpinResponse {
  targetIndex: number;
  reward: SpinReward;
  txId: string;
  timestamp: number;
  isDouble?: boolean;
}

/**
 * Server-Authoritative Spin Service
 * Calls POST /api/v1/spin (or data.json fallback when mock enabled)
 */
export async function requestServerSpin(segments: SpinSegment[]): Promise<ServerSpinResponse> {
  const result = await performServerSpin();

  const segmentIndex =
    result.targetIndex >= 0 && result.targetIndex < segments.length
      ? result.targetIndex
      : 0;

  const matchedSegment = segments[segmentIndex];

  return {
    targetIndex: segmentIndex,
    reward: {
      id: result.reward?.id || `rew-${Date.now()}`,
      label: result.reward?.label || matchedSegment?.label || 'Diamond',
      value: result.reward?.value || matchedSegment?.value || 'gem',
      amount: result.reward?.amount || '+80 💎',
      image: result.reward?.image || matchedSegment?.image,
      isDouble: result.isDouble
    },
    txId: result.txId || `TX-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: result.timestamp || Date.now(),
    isDouble: result.isDouble
  };
}
