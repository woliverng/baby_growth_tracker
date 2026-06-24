import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

import { RECORD_TYPE_COLORS, RECORD_TYPE_LABELS, JAUNDICE_WARNING_THRESHOLD } from '@/lib/constants';
import { formatDate, formatDuration, diffMinutes } from '@/lib/date';
import { useUIStore } from '@/store/useUIStore';
import { useRecordStore } from '@/store/useRecordStore';
import ConfirmDialog from './ConfirmDialog';
import ImagePreview from './ImagePreview';
import type { RecordItem } from '@/types';

interface RecordCardProps {
  record: RecordItem;
}

/**
 * Renders a record card with a left color dot, type-specific content,
 * and edit/delete actions. Uses 14px radius and warm border.
 */
const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const startEdit = useUIStore((s) => s.startEdit);
  const deleteRecord = useRecordStore((s) => s.deleteRecord);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const color = RECORD_TYPE_COLORS[record.type] ?? '#999';
  const images = record.images ?? [];

  /** Whether this jaundice record exceeds the warning threshold */
  const isJaundiceHigh =
    record.type === 'jaundice' && record.value > JAUNDICE_WARNING_THRESHOLD;

  const handleEdit = (): void => {
    startEdit(record);
  };

  const handleDelete = (): void => {
    deleteRecord(record.id);
    setConfirmOpen(false);
  };

  const renderContent = (): React.ReactNode => {
    switch (record.type) {
      case 'feeding': {
        const methodLabel =
          record.feedingMethod === 'breast'
            ? '母乳'
            : record.feedingMethod === 'formula'
            ? '配方奶'
            : '混合';
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label={methodLabel} color={color} />
            {record.amount != null && <Chip label={`${record.amount}ml`} color={color} />}
            {record.duration != null && <Chip label={`${record.duration}分钟`} color={color} />}
          </Box>
        );
      }
      case 'sleep': {
        const isOngoing = record.endTime === record.startTime;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label={`${formatDate(record.startTime, 'HH:mm')} - ${isOngoing ? '进行中' : formatDate(record.endTime, 'HH:mm')}`} color={color} />
            {!isOngoing && <Chip label={formatDuration(record.duration)} color={color} />}
            {isOngoing && <Chip label={`已睡${formatDuration(diffMinutes(record.startTime, new Date().toISOString()))}`} color={color} />}
          </Box>
        );
      }
      case 'diaper': {
        const typeLabel = record.diaperType === 'wet' ? '湿尿布' : '排便';
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label={typeLabel} color={color} />
            {record.poopTexture && (
              <Chip
                label={`性状: ${record.poopTexture === 'watery' ? '水样' : record.poopTexture === 'soft' ? '软' : '硬'}`}
                color={color}
              />
            )}
            {record.poopColor && <Chip label={`颜色: ${record.poopColor}`} color={color} />}
          </Box>
        );
      }
      case 'growth': {
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {record.weight != null && <Chip label={`${record.weight} kg`} color={color} />}
            {record.height != null && <Chip label={`${record.height} cm`} color={color} />}
          </Box>
        );
      }
      case 'jaundice': {
        const siteLabel = record.measureSite === 'forehead' ? '额头'
          : record.measureSite === 'chest' ? '胸前' : '腹部';
        const isHigh = record.value > JAUNDICE_WARNING_THRESHOLD;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            <Chip label={`${record.value} mg/dL`} color={color} />
            <Chip label={siteLabel} color={color} />
            {isHigh && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  color: '#E53935',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <WarningIcon sx={{ fontSize: '1rem' }} />
                超标
              </Box>
            )}
          </Box>
        );
      }
      default:
        return null;
    }
  };

  const timeText = (): string => {
    switch (record.type) {
      case 'feeding':
        return formatDate(record.time, 'HH:mm');
      case 'sleep':
        return formatDate(record.startTime, 'HH:mm');
      case 'diaper':
        return formatDate(record.time, 'HH:mm');
      case 'growth':
        return record.date;
      case 'jaundice':
        return formatDate(record.time, 'HH:mm');
      default:
        return '';
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: 1.5,
          borderRadius: '14px',
          border: isJaundiceHigh
            ? '2px solid #E53935'
            : '1px solid #F0E6D8',
          backgroundColor: '#FFFFFF',
          boxShadow: isJaundiceHigh
            ? '0 1px 6px rgba(229,57,53,0.12)'
            : '0 1px 3px rgba(93,58,26,0.04)',
          transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
          '&:hover': {
            boxShadow: isJaundiceHigh
              ? '0 2px 8px rgba(229,57,53,0.16)'
              : '0 1px 3px rgba(93,58,26,0.06)',
            borderColor: isJaundiceHigh ? '#E53935' : '#E0D0B8',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* Left color dot */}
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '9999px',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#4A3728' }}
            >
              {RECORD_TYPE_LABELS[record.type]}
            </Typography>
            <Typography variant="caption" sx={{ color: '#B8A088', fontWeight: 600 }}>
              {timeText()}
            </Typography>
          </Box>
          {renderContent()}
          {record.note && (
            <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem', color: '#8B7355' }}>
              {record.note}
            </Typography>
          )}
          {images.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {images.map((src, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={src}
                  alt=""
                  onClick={() => {
                    setPreviewIndex(idx);
                    setPreviewOpen(true);
                  }}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ flexShrink: 0 }}>
          <IconButton size="small" onClick={handleEdit} aria-label="编辑">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="删除">
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        title="删除记录"
        content="确定要删除这条记录吗？此操作不可撤销。"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <ImagePreview
        open={previewOpen}
        images={images}
        index={previewIndex}
        onClose={() => setPreviewOpen(false)}
        onIndexChange={setPreviewIndex}
      />
    </>
  );
};

/** Small inline chip for record details. */
const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: 1,
      py: 0.25,
      borderRadius: '6px',
      backgroundColor: `${color}15`,
      color: color,
      fontSize: '0.75rem',
      fontWeight: 500,
    }}
  >
    {label}
  </Box>
);

export default RecordCard;
