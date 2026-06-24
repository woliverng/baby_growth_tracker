import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { FEEDING_METHODS, QUICK_AMOUNTS } from '@/lib/constants';
import NoteField from '@/components/common/NoteField';
import type { FeedingMethod, FeedingRecord, NewRecordInput } from '@/types';

/**
 * Form for creating or editing a feeding record.
 */
const FeedingForm: React.FC = () => {
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const editingRecord = useUIStore((s) => s.editingRecord);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);

  const isEditing = editingRecord?.type === 'feeding';
  const existing = isEditing ? (editingRecord as FeedingRecord) : null;

  const [time, setTime] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.time) : dayjs()
  );
  const [feedingMethod, setFeedingMethod] = useState<FeedingMethod>(
    existing?.feedingMethod ?? 'breast'
  );
  const [amount, setAmount] = useState<string>(
    existing?.amount != null ? String(existing.amount) : ''
  );
  const [duration, setDuration] = useState<string>(
    existing?.duration != null ? String(existing.duration) : ''
  );
  const [note, setNote] = useState<string>(existing?.note ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);

  useEffect(() => {
    if (isEditing && existing) {
      setTime(dayjs(existing.time));
      setFeedingMethod(existing.feedingMethod);
      setAmount(existing.amount != null ? String(existing.amount) : '');
      setDuration(existing.duration != null ? String(existing.duration) : '');
      setNote(existing.note ?? '');
      setImages(existing.images ?? []);
    }
  }, [existing, isEditing]);

  const handleSubmit = (): void => {
    if (!activeBabyId) return;
    const data: NewRecordInput = {
      type: 'feeding',
      babyId: activeBabyId,
      time: time.toISOString(),
      feedingMethod,
      amount: amount ? parseFloat(amount) : undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      note: note.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (isEditing && existing) {
      updateRecord(existing.id, data);
    } else {
      addRecord(data);
    }
    closeQuickRecord();
  };

  return (
    <Stack spacing={2}>
      <DateTimePicker
        label="喂养时间"
        value={time}
        onChange={(val) => val && setTime(val)}
        ampm={false}
      />

      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>喂养方式</Box>
        <ToggleButtonGroup
          value={feedingMethod}
          exclusive
          onChange={(_, val: FeedingMethod | null) => val && setFeedingMethod(val)}
          fullWidth
          size="small"
        >
          {FEEDING_METHODS.map((m) => (
            <ToggleButton key={m.value} value={m.value}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>奶量 (ml)</Box>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          size="small"
          placeholder="输入奶量"
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {QUICK_AMOUNTS.map((amt) => (
            <Button
              key={amt}
              size="small"
              variant="outlined"
              onClick={() => setAmount(String(amt))}
              sx={{ flex: 1, minWidth: 0 }}
            >
              {amt}ml
            </Button>
          ))}
        </Box>
      </Box>

      <TextField
        label="时长 (分钟)"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        fullWidth
        size="small"
      />

      <NoteField
        value={note}
        onChange={setNote}
        images={images}
        onImagesChange={setImages}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        {isEditing ? '保存修改' : '添加记录'}
      </Button>
    </Stack>
  );
};

export default FeedingForm;
