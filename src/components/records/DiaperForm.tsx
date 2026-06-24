import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { DIAPER_TYPES, POOP_TEXTURES, POOP_COLORS } from '@/lib/constants';
import NoteField from '@/components/common/NoteField';
import type { DiaperType, PoopTexture, DiaperRecord, NewRecordInput } from '@/types';

/**
 * Form for creating or editing a diaper record.
 */
const DiaperForm: React.FC = () => {
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const editingRecord = useUIStore((s) => s.editingRecord);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);

  const isEditing = editingRecord?.type === 'diaper';
  const existing = isEditing ? (editingRecord as DiaperRecord) : null;

  const [time, setTime] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.time) : dayjs()
  );
  const [diaperType, setDiaperType] = useState<DiaperType>(
    existing?.diaperType ?? 'wet'
  );
  const [poopTexture, setPoopTexture] = useState<PoopTexture | ''>(
    existing?.poopTexture ?? ''
  );
  const [poopColor, setPoopColor] = useState<string>(existing?.poopColor ?? '');
  const [note, setNote] = useState<string>(existing?.note ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);

  useEffect(() => {
    if (isEditing && existing) {
      setTime(dayjs(existing.time));
      setDiaperType(existing.diaperType);
      setPoopTexture(existing.poopTexture ?? '');
      setPoopColor(existing.poopColor ?? '');
      setNote(existing.note ?? '');
      setImages(existing.images ?? []);
    }
  }, [existing, isEditing]);

  const handleSubmit = (): void => {
    if (!activeBabyId) return;
    const data: NewRecordInput = {
      type: 'diaper',
      babyId: activeBabyId,
      time: time.toISOString(),
      diaperType,
      poopTexture: diaperType === 'poop' && poopTexture ? poopTexture : undefined,
      poopColor: diaperType === 'poop' && poopColor ? poopColor : undefined,
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
        label="更换时间"
        value={time}
        onChange={(val) => val && setTime(val)}
        ampm={false}
      />

      <Box>
        <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>类型</Box>
        <ToggleButtonGroup
          value={diaperType}
          exclusive
          onChange={(_, val: DiaperType | null) => val && setDiaperType(val)}
          fullWidth
          size="small"
        >
          {DIAPER_TYPES.map((t) => (
            <ToggleButton key={t.value} value={t.value}>
              {t.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {diaperType === 'poop' && (
        <>
          <Box>
            <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>排便性状</Box>
            <ToggleButtonGroup
              value={poopTexture}
              exclusive
              onChange={(_, val: PoopTexture | null) => val && setPoopTexture(val)}
              fullWidth
              size="small"
            >
              {POOP_TEXTURES.map((t) => (
                <ToggleButton key={t.value} value={t.value}>
                  {t.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Box sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>颜色</Box>
            <ToggleButtonGroup
              value={poopColor}
              exclusive
              onChange={(_, val: string | null) => val && setPoopColor(val)}
              fullWidth
              size="small"
              sx={{ flexWrap: 'wrap', gap: 0.5 }}
            >
              {POOP_COLORS.map((c) => (
                <ToggleButton key={c} value={c} sx={{ flex: '0 0 auto' }}>
                  {c}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </>
      )}

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

export default DiaperForm;
