import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';

/**
 * Reset all Zustand stores to their initial state.
 * Call this in beforeEach to ensure test isolation.
 */
export function resetAllStores(): void {
  useBabyStore.setState({ babies: [] });
  useRecordStore.setState({ records: [] });
  useSettingsStore.setState({ theme: 'light', activeBabyId: null });
  useUIStore.setState({
    quickRecordOpen: false,
    quickRecordType: null,
    editingRecord: null,
  });
}

/** A sample baby input for tests. */
export const sampleBabyInput = {
  name: '测试宝宝',
  gender: 'male' as const,
  birthDate: '2026-01-01T00:00:00.000Z',
  birthWeight: 3.5,
  birthHeight: 50,
};
