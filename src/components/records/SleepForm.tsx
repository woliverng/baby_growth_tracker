import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { diffMinutes, formatDuration } from '@/lib/date';
import NoteField from '@/components/common/NoteField';
import type { SleepRecord, NewRecordInput } from '@/types';

/**
 * Form for creating or editing a sleep record.
 * Includes quick "start sleep" and "end sleep" buttons.
 */
const SleepForm: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const editingRecord = useUIStore((s) => s.editingRecord);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);

  const isEditing = editingRecord?.type === 'sleep';
  const existing = isEditing ? (editingRecord as SleepRecord) : null;

  const [startTime, setStartTime] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.startTime) : dayjs()
  );
  const [endTime, setEndTime] = useState<dayjs.Dayjs>(
    existing ? dayjs(existing.endTime) : dayjs()
  );
  const [note, setNote] = useState<string>(existing?.note ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);

  useEffect(() => {
    if (isEditing && existing) {
      setStartTime(dayjs(existing.startTime));
      setEndTime(dayjs(existing.endTime));
      setNote(existing.note ?? '');
      setImages(existing.images ?? []);
    }
  }, [existing, isEditing]);

  /** Find an ongoing sleep record (endTime === startTime) for this baby. */
  const ongoingSleep = useMemo((): SleepRecord | null => {
    return (
      records.find(
        (r) =>
          r.type === 'sleep' &&
          r.babyId === activeBabyId &&
          r.startTime === r.endTime
      ) as SleepRecord | undefined ?? null
    );
  }, [records, activeBabyId]);

  const duration = diffMinutes(startTime.toISOString(), endTime.toISOString());
  const isOngoing = startTime.isSame(endTime);

  const handleStartSleep = (): void => {
    if (!activeBabyId) return;
    const now = dayjs().toISOString();
    addRecord({
      type: 'sleep',
      babyId: activeBabyId,
      startTime: now,
      endTime: now,
      duration: 0,
    });
    closeQuickRecord();
  };

  const handleEndSleep = (): void => {
    if (!ongoingSleep || !activeBabyId) return;
    const nowIso = dayjs().toISOString();
    const dur = diffMinutes(ongoingSleep.startTime, nowIso);
    updateRecord(ongoingSleep.id, {
      type: 'sleep',
      endTime: nowIso,
      duration: dur,
    });
    closeQuickRecord();
  };

  const handleSubmit = (): void => {
    if (!activeBabyId) return;
    const startIso = startTime.toISOString();
    const endIso = endTime.toISOString();
    const dur = startIso === endIso ? 0 : diffMinutes(startIso, endIso);

    const data: NewRecordInput = {
      type: 'sleep',
      babyId: activeBabyId,
      startTime: startIso,
      endTime: endIso,
      duration: dur,
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
      {/* Quick actions */}
      {!isEditing && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleStartSleep}
            disabled={!!ongoingSleep}
          >
            开始睡眠
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleEndSleep}
            disabled={!ongoingSleep}
          >
            结束睡眠
          </Button>
        </Box>
      )}

      {ongoingSleep && !isEditing && (
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(149, 117, 205, 0.1)', textAlign: 'center' }}>
          <Typography variant="body2" color="secondary.main">
            ● 睡眠中 · 已睡 {formatDuration(diffMinutes(ongoingSleep.startTime, new Date().toISOString()))}
          </Typography>
        </Box>
      )}

      <DateTimePicker
        label="入睡时间"
        value={startTime}
        onChange={(val) => val && setStartTime(val)}
        ampm={false}
      />

      <DateTimePicker
        label="醒来时间"
        value={endTime}
        onChange={(val) => val && setEndTime(val)}
        ampm={false}
        minDateTime={startTime}
      />

      {!isOngoing && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          睡眠时长: {formatDuration(duration)}
        </Typography>
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

export default SleepForm;
