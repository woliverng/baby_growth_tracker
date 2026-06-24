import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { RECORD_TYPE_LABELS } from '@/lib/constants';
import { getRecordDate, formatDate } from '@/lib/date';
import EmptyState from '@/components/common/EmptyState';
import AlbumGrid from '@/components/album/AlbumGrid';
import AlbumDetailDialog from '@/components/album/AlbumDetailDialog';
import type { RecordItem, RecordType, AlbumGroup } from '@/types';

/** Filter options for the album type tabs. */
type FilterType = RecordType | 'all';

/** All filter tab options in display order. */
const FILTER_OPTIONS: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'feeding', label: RECORD_TYPE_LABELS['feeding'] },
  { value: 'sleep', label: RECORD_TYPE_LABELS['sleep'] },
  { value: 'diaper', label: RECORD_TYPE_LABELS['diaper'] },
  { value: 'growth', label: RECORD_TYPE_LABELS['growth'] },
  { value: 'jaundice', label: RECORD_TYPE_LABELS['jaundice'] },
];

/**
 * Album page: displays all images from the active baby's records,
 * grouped by date with type filtering.
 * Filter tabs use giraffe yellow active state with pill style.
 */
const AlbumPage: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const startEdit = useUIStore((s) => s.startEdit);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /** Build date-grouped album groups from filtered records. */
  const groups = useMemo<AlbumGroup[]>(() => {
    if (!activeBabyId) return [];

    // Filter: current baby + has images
    const recordsWithImages = records.filter(
      (r) => r.babyId === activeBabyId && r.images && r.images.length > 0
    );

    // Filter by type
    const filtered =
      filterType === 'all'
        ? recordsWithImages
        : recordsWithImages.filter((r) => r.type === filterType);

    // Expand to image items
    const imageItems = filtered.flatMap((record) =>
      (record.images ?? []).map((imageSrc, imageIndex) => ({
        record,
        imageIndex,
        imageSrc,
        date: getRecordDate(record),
      }))
    );

    // Group by date (descending)
    const grouped = imageItems.reduce(
      (acc, item) => {
        (acc[item.date] ??= []).push(item);
        return acc;
      },
      {} as Record<string, typeof imageItems>
    );

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        label: formatDate(date, 'M月D日'),
        items,
      }));
  }, [records, activeBabyId, filterType]);

  const handleItemClick = useCallback(
    (record: RecordItem, imageIndex: number): void => {
      setSelectedRecord(record);
      setSelectedImageIndex(imageIndex);
      setDialogOpen(true);
    },
    []
  );

  const handleClose = useCallback((): void => {
    setDialogOpen(false);
  }, []);

  const handleEdit = useCallback(
    (record: RecordItem): void => {
      setDialogOpen(false);
      startEdit(record);
    },
    [startEdit]
  );

  const hasAnyImages = groups.length > 0;

  return (
    <Box className="page-transition" sx={{ p: 2, pb: 10 }}>
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        相册
      </Typography>

      {/* Type filter tabs */}
      <Tabs
        value={filterType}
        onChange={(_, val: FilterType) => setFilterType(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 36,
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: '9999px',
            color: '#8B7355',
            border: '1.5px solid #F0E6D8',
            margin: '0 4px',
            padding: '4px 12px',
            transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
            '&.Mui-selected': {
              backgroundColor: '#F4A940',
              color: '#FFFFFF',
              borderColor: '#F4A940',
            },
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {FILTER_OPTIONS.map((opt) => (
          <Tab key={opt.value} value={opt.value} label={opt.label} />
        ))}
      </Tabs>

      {/* Content */}
      {!hasAnyImages ? (
        <EmptyState
          icon={<PhotoLibraryIcon sx={{ fontSize: 64 }} />}
          title="还没有照片"
          subtitle="在记录中添加图片后，会自动显示在这里"
        />
      ) : (
        <Box>
          {groups.map((group) => (
            <AlbumGrid
              key={group.date}
              group={group}
              onItemClick={handleItemClick}
            />
          ))}
        </Box>
      )}

      {/* Detail dialog */}
      <AlbumDetailDialog
        open={dialogOpen}
        record={selectedRecord}
        imageIndex={selectedImageIndex}
        onClose={handleClose}
        onEdit={handleEdit}
      />
    </Box>
  );
};

export default AlbumPage;
