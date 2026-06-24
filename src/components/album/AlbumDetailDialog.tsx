import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';

import { RECORD_TYPE_COLORS, RECORD_TYPE_LABELS, JAUNDICE_WARNING_THRESHOLD } from '@/lib/constants';
import { formatDate, formatDuration } from '@/lib/date';
import type { RecordItem } from '@/types';

interface AlbumDetailDialogProps {
  open: boolean;
  record: RecordItem | null;
  imageIndex: number;
  onClose: () => void;
  onEdit: (record: RecordItem) => void;
}

/**
 * Full-screen dialog showing a large image from an album entry,
 * with left/right navigation and record details below.
 *
 * The bottom section displays the record type label, time, key
 * information, and note. An edit button triggers the onEdit callback.
 */
const AlbumDetailDialog: React.FC<AlbumDetailDialogProps> = ({
  open,
  record,
  imageIndex,
  onClose,
  onEdit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(imageIndex);

  useEffect(() => {
    setCurrentIndex(imageIndex);
  }, [imageIndex, open]);

  if (!record) return null;

  const images = record.images ?? [];
  const color = RECORD_TYPE_COLORS[record.type] ?? '#999';
  const hasMultiple = images.length > 1;

  /** Whether this jaundice record exceeds the warning threshold */
  const isJaundiceHigh =
    record.type === 'jaundice' && record.value > JAUNDICE_WARNING_THRESHOLD;

  const handlePrev = (): void => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = (): void => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const renderRecordDetail = (): React.ReactNode => {
    switch (record.type) {
      case 'feeding': {
        const methodLabel =
          record.feedingMethod === 'breast'
            ? '母乳'
            : record.feedingMethod === 'formula'
            ? '配方奶'
            : '混合';
        return `${methodLabel}${record.amount ? ` · ${record.amount}ml` : ''}${
          record.duration ? ` · ${record.duration}分钟` : ''
        }`;
      }
      case 'sleep': {
        const isOngoing = record.endTime === record.startTime;
        return `${formatDate(record.startTime, 'HH:mm')} - ${
          isOngoing ? '进行中' : formatDate(record.endTime, 'HH:mm')
        } · ${formatDuration(record.duration)}`;
      }
      case 'diaper': {
        const typeLabel = record.diaperType === 'wet' ? '湿尿布' : '排便';
        const details: string[] = [typeLabel];
        if (record.poopTexture) {
          details.push(
            record.poopTexture === 'watery' ? '水样' : record.poopTexture === 'soft' ? '软' : '硬'
          );
        }
        if (record.poopColor) details.push(record.poopColor);
        return details.join(' · ');
      }
      case 'growth': {
        const parts: string[] = [];
        if (record.weight != null) parts.push(`体重 ${record.weight}kg`);
        if (record.height != null) parts.push(`身长 ${record.height}cm`);
        return parts.join(' · ');
      }
      case 'jaundice': {
        const siteLabel = record.measureSite === 'forehead' ? '额头'
          : record.measureSite === 'chest' ? '胸前' : '腹部';
        const isHigh = record.value > JAUNDICE_WARNING_THRESHOLD;
        return `黄疸指数 ${record.value} mg/dL · ${siteLabel}${isHigh ? ' · ⚠️ 超标' : ''}`;
      }
      default:
        return '';
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
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: { bgcolor: '#000' },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#000',
          color: '#fff',
          py: 1,
        }}
      >
        <IconButton onClick={onClose} aria-label="关闭" sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
        <Button
          startIcon={<EditIcon />}
          onClick={() => onEdit(record)}
          sx={{ color: '#fff', textTransform: 'none' }}
        >
          编辑
        </Button>
      </DialogTitle>

      {/* Large image */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 0,
        }}
      >
        {images[currentIndex] && (
          <Box
            component="img"
            src={images[currentIndex]}
            alt=""
            sx={{
              maxHeight: '50vh',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Left arrow */}
        {hasMultiple && (
          <IconButton
            onClick={handlePrev}
            aria-label="上一张"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {/* Right arrow */}
        {hasMultiple && (
          <IconButton
            onClick={handleNext}
            aria-label="下一张"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Counter */}
        {hasMultiple && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              fontSize: '0.8rem',
            }}
          >
            {currentIndex + 1} / {images.length}
          </Typography>
        )}
      </Box>

      {/* Record details */}
      <Box
        sx={{
          bgcolor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
          pb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: `${color}20`,
              color: color,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {RECORD_TYPE_LABELS[record.type]}
          </Box>
          {isJaundiceHigh && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: 'rgba(229,57,53,0.1)',
                color: '#E53935',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <WarningIcon sx={{ fontSize: '1rem' }} />
              超标警告
            </Box>
          )}
          <Typography variant="caption" color="text.secondary">
            {timeText()}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {renderRecordDetail()}
        </Typography>
        {record.note && (
          <Typography variant="body2" color="text.secondary">
            {record.note}
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default AlbumDetailDialog;
