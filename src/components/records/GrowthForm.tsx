import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import NoteField from '@/components/common/NoteField';
import type { GrowthRecord, NewRecordInput } from '@/types';

/**
 * Form for creating or editing a growth record (weight/height).
 */
const GrowthForm: React.FC = () => {
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const editingRecord = useUIStore((s) => s.editingRecord);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);

  const isEditing = editingRecord?.type === 'growth';
  const existing = isEditing ? (editingRecord as GrowthRecord) : null;

  const [date, setDate] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.date) : dayjs()
  );
  const [weight, setWeight] = useState<string>(
    existing?.weight != null ? String(existing.weight) : ''
  );
  const [height, setHeight] = useState<string>(
    existing?.height != null ? String(existing.height) : ''
  );
  const [note, setNote] = useState<string>(existing?.note ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);

  useEffect(() => {
    if (isEditing && existing) {
      setDate(dayjs(existing.date));
      setWeight(existing.weight != null ? String(existing.weight) : '');
      setHeight(existing.height != null ? String(existing.height) : '');
      setNote(existing.note ?? '');
      setImages(existing.images ?? []);
    }
  }, [existing, isEditing]);

  const handleSubmit = (): void => {
    if (!activeBabyId) return;
    const data: NewRecordInput = {
      type: 'growth',
      babyId: activeBabyId,
      date: date.format('YYYY-MM-DD'),
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
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
      <DatePicker
        label="测量日期"
        value={date}
        onChange={(val) => val && setDate(val)}
        maxDate={dayjs()}
      />

      <TextField
        label="体重 (kg)"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        fullWidth
        size="small"
        placeholder="如 5.2"
        inputProps={{ step: '0.01' }}
      />

      <TextField
        label="身长 (cm)"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        fullWidth
        size="small"
        placeholder="如 58"
        inputProps={{ step: '0.1' }}
      />

      <NoteField
        value={note}
        onChange={setNote}
        images={images}
        onImagesChange={setImages}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!weight && !height}
      >
        {isEditing ? '保存修改' : '添加记录'}
      </Button>
    </Stack>
  );
};

export default GrowthForm;
