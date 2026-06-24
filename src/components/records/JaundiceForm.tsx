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
import { JAUNDICE_MEASURE_SITES } from '@/lib/constants';
import NoteField from '@/components/common/NoteField';
import type { JaundiceMeasureSite, JaundiceRecord, NewRecordInput } from '@/types';

/**
 * Form for creating or editing a jaundice record.
 */
const JaundiceForm: React.FC = () => {
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const editingRecord = useUIStore((s) => s.editingRecord);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);

  const isEditing = editingRecord?.type === 'jaundice';
  const existing = isEditing ? (editingRecord as JaundiceRecord) : null;

  const [time, setTime] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.time) : dayjs()
  );
  const [value, setValue] = useState<string>(
    existing?.value != null ? String(existing.value) : ''
  );
  const [measureSite, setMeasureSite] = useState<JaundiceMeasureSite>(
    existing?.measureSite ?? 'forehead'
  );
  const [note, setNote] = useState<string>(existing?.note ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);

  useEffect(() => {
    if (isEditing && existing) {
      setTime(dayjs(existing.time));
      setValue(existing.value != null ? String(existing.value) : '');
      setMeasureSite(existing.measureSite);
      setNote(existing.note ?? '');
      setImages(existing.images ?? []);
    }
  }, [existing, isEditing]);

  const handleSubmit = (): void => {
    if (!activeBabyId) return;
    const data: NewRecordInput = {
      type: 'jaundice',
      babyId: activeBabyId,
      time: time.toISOString(),
      value: parseFloat(value),
      measureSite,
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
        label="测量时间"
        value={time}
        onChange={(val) => val && setTime(val)}
        ampm={false}
      />

      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>黄疸指数 (mg/dL)</Box>
        <TextField
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          size="small"
          placeholder="输入黄疸指数（正常范围：1–12 mg/dL）"
          inputProps={{ step: '0.1', min: '0' }}
        />
      </Box>

      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>测量部位</Box>
        <ToggleButtonGroup
          value={measureSite}
          exclusive
          onChange={(_, val: JaundiceMeasureSite | null) => val && setMeasureSite(val)}
          fullWidth
          size="small"
        >
          {JAUNDICE_MEASURE_SITES.map((site) => (
            <ToggleButton key={site.value} value={site.value}>
              {site.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

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
        disabled={!value}
      >
        {isEditing ? '保存修改' : '添加记录'}
      </Button>
    </Stack>
  );
};

export default JaundiceForm;
