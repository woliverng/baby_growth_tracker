import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import dayjs from 'dayjs';

import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { exportJSON, exportCSV, downloadFile, getStorageInfo } from '@/lib/storage';
import { calculateAge } from '@/lib/date';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import GiraffeIcon from '@/components/common/GiraffeIcon';
import type { Baby, NewBabyInput } from '@/types';

/**
 * Settings page: baby profile management, data export, theme toggle, about.
 * Features giraffe avatar, warm settings groups with 20px radius, and brand footer.
 */
const SettingsPage: React.FC = () => {
  const babies = useBabyStore((s) => s.babies);
  const addBaby = useBabyStore((s) => s.addBaby);
  const updateBaby = useBabyStore((s) => s.updateBaby);
  const deleteBaby = useBabyStore((s) => s.deleteBaby);
  const deleteRecordsByBaby = useRecordStore((s) => s.deleteRecordsByBaby);

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const setActiveBabyId = useSettingsStore((s) => s.setActiveBabyId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBaby, setEditingBaby] = useState<Baby | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Baby | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success'): void => {
    setSnackbar({ open: true, message, severity });
  };

  const handleExportJSON = (): void => {
    const json = exportJSON();
    downloadFile(json, `baby_growth_${dayjs().format('YYYYMMDD_HHmmss')}.json`, 'application/json');
    showSnackbar('JSON 导出成功');
  };

  const handleExportCSV = (): void => {
    const csv = exportCSV();
    downloadFile(csv, `baby_growth_${dayjs().format('YYYYMMDD_HHmmss')}.csv`, 'text/csv;charset=utf-8');
    showSnackbar('CSV 导出成功');
  };

  const handleDeleteBaby = (): void => {
    if (!deleteTarget) return;
    deleteRecordsByBaby(deleteTarget.id);
    deleteBaby(deleteTarget.id);
    if (activeBabyId === deleteTarget.id) {
      const remaining = babies.filter((b) => b.id !== deleteTarget.id);
      setActiveBabyId(remaining[0]?.id ?? '');
    }
    setDeleteTarget(null);
    showSnackbar('宝宝档案已删除');
  };

  const handleToggleActive = (id: string): void => {
    setActiveBabyId(id);
  };

  const activeBaby = babies.find((b) => b.id === activeBabyId) ?? babies[0];

  // Storage usage for progress bar
  const storageUsage = useMemo(() => {
    try {
      const info = getStorageInfo();
      return { used: info.used, total: info.total, percent: info.percent * 100 };
    } catch {
      return { used: 0, total: 5 * 1024 * 1024, percent: 0 };
    }
  }, []);

  const storagePercent = Math.min(100, Math.round(storageUsage.percent));
  const storageUsedMB = (storageUsage.used / (1024 * 1024)).toFixed(1);
  const storageTotalMB = (storageUsage.total / (1024 * 1024)).toFixed(0);

  const settingsGroupStyle = {
    borderRadius: '20px',
    border: '1px solid #F0E6D8',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    mb: 2,
  };

  return (
    <Box sx={{ p: 2 }} className="page-transition">
      {/* Giraffe Profile Header */}
      <Box
        sx={{
          textAlign: 'center',
          py: 3,
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #FDE68A, #F4A940)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            overflow: 'hidden',
          }}
        >
          <GiraffeIcon size={44} />
        </Box>
        {activeBaby ? (
          <>
            <Typography
              sx={{
                fontFamily: '"Nunito", "PingFang SC", sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#4A3728',
                mb: 0.5,
              }}
            >
              {activeBaby.name}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#B8A088' }}>
              {dayjs(activeBaby.birthDate).format('YYYY年M月D日')}出生 · {calculateAge(activeBaby.birthDate).text}
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: '0.8rem', color: '#B8A088' }}>
            请创建宝宝档案
          </Typography>
        )}
      </Box>

      {/* Baby Profile Management */}
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        宝宝档案
      </Typography>
      <List sx={settingsGroupStyle}>
        {babies.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="暂无宝宝档案"
              secondary="点击下方按钮创建"
              primaryTypographyProps={{ sx: { color: '#4A3728' } }}
              secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
            />
          </ListItem>
        ) : (
          babies.map((baby) => (
            <React.Fragment key={baby.id}>
              <ListItem
                button
                onClick={() => handleToggleActive(baby.id)}
                selected={baby.id === activeBabyId}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#FFFAF0',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#FFF3E0',
                  },
                }}
              >
                <ListItemIcon>
                  <PersonIcon
                    sx={{ color: baby.id === activeBabyId ? '#F4A940' : '#B8A088' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={baby.name}
                  secondary={`${calculateAge(baby.birthDate).text} · 出生 ${dayjs(baby.birthDate).format('YYYY-MM-DD')}`}
                  primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
                />
                <ListItemSecondaryAction>
                  <IconButton size="small" onClick={() => { setEditingBaby(baby); setEditDialogOpen(true); }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteTarget(baby)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ borderColor: '#F0E6D8' }} />
            </React.Fragment>
          ))
        )}
      </List>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => setAddDialogOpen(true)}
        sx={{
          mb: 3,
          borderRadius: '20px',
          borderColor: '#F0E6D8',
          color: '#8B7355',
          fontWeight: 600,
          '&:hover': {
            borderColor: '#F4A940',
            backgroundColor: '#FFFAF0',
          },
        }}
      >
        添加宝宝
      </Button>

      {/* Data Export */}
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        数据管理
      </Typography>
      <List sx={settingsGroupStyle}>
        <ListItem button onClick={handleExportJSON} sx={{ '&:hover': { backgroundColor: '#FFF3E0' } }}>
          <ListItemIcon>
            <CodeIcon sx={{ color: '#8B5E3C' }} />
          </ListItemIcon>
          <ListItemText
            primary="导出 JSON"
            secondary="导出完整数据（含设置）"
            primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
          />
        </ListItem>
        <Divider sx={{ borderColor: '#F0E6D8' }} />
        <ListItem button onClick={handleExportCSV} sx={{ '&:hover': { backgroundColor: '#FFF3E0' } }}>
          <ListItemIcon>
            <TableChartIcon sx={{ color: '#8B5E3C' }} />
          </ListItemIcon>
          <ListItemText
            primary="导出 CSV"
            secondary="导出记录列表为表格"
            primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
          />
        </ListItem>
      </List>

      {/* Storage & About */}
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        外观与存储
      </Typography>
      <List sx={settingsGroupStyle}>
        {/* Theme toggle */}
        <ListItem sx={{ '&:hover': { backgroundColor: '#FFF3E0' } }}>
          <ListItemIcon>
            {theme === 'dark' ? <DarkModeIcon sx={{ color: '#F4A940' }} /> : <LightModeIcon sx={{ color: '#F4A940' }} />}
          </ListItemIcon>
          <ListItemText
            primary="深色模式"
            secondary={theme === 'dark' ? '已开启' : '已关闭'}
            primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
          />
          <ListItemSecondaryAction>
            <Switch
              checked={theme === 'dark'}
              onChange={(_, checked) => setTheme(checked ? 'dark' : 'light')}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider sx={{ borderColor: '#F0E6D8' }} />

        {/* Storage usage */}
        <ListItem sx={{ '&:hover': { backgroundColor: '#FFF3E0' } }}>
          <ListItemIcon>
            <StorageIcon sx={{ color: '#8B5E3C' }} />
          </ListItemIcon>
          <ListItemText
            primary="存储空间"
            secondary={`已用 ${storageUsedMB} MB / 约 ${storageTotalMB} MB`}
            primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
          />
        </ListItem>
        {/* Storage progress bar */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Box
            sx={{
              width: '100%',
              height: '4px',
              backgroundColor: '#F0E6D8',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${storagePercent}%`,
                height: '100%',
                backgroundColor: '#F4A940',
                borderRadius: '2px',
                transition: 'width 300ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: '#F0E6D8' }} />

        {/* About */}
        <ListItem sx={{ '&:hover': { backgroundColor: '#FFF3E0' } }}>
          <ListItemIcon>
            <InfoIcon sx={{ color: '#8B5E3C' }} />
          </ListItemIcon>
          <ListItemText
            primary="关于小鹿成长记"
            secondary="版本 1.0.0"
            primaryTypographyProps={{ sx: { color: '#4A3728', fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: '#B8A088' } }}
          />
        </ListItem>
      </List>

      {/* Brand Footer */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography
          sx={{
            fontFamily: '"Nunito", "PingFang SC", sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#D97706',
            mb: 0.5,
          }}
        >
          🦒 小鹿成长记
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#B8A088' }}>
          陪伴宝宝成长的每一天 ❤️
        </Typography>
      </Box>

      {/* Edit Dialog */}
      <BabyEditDialog
        open={editDialogOpen}
        baby={editingBaby}
        onClose={() => { setEditDialogOpen(false); setEditingBaby(null); }}
        onSave={(data) => {
          if (editingBaby) {
            updateBaby(editingBaby.id, data);
            showSnackbar('档案已更新');
          }
          setEditDialogOpen(false);
          setEditingBaby(null);
        }}
      />

      {/* Add Dialog */}
      <BabyEditDialog
        open={addDialogOpen}
        baby={null}
        onClose={() => setAddDialogOpen(false)}
        onSave={(data) => {
          const baby = addBaby(data);
          if (!activeBabyId) setActiveBabyId(baby.id);
          showSnackbar('宝宝档案已创建');
          setAddDialogOpen(false);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="删除宝宝档案"
        content={`确定要删除「${deleteTarget?.name}」及其所有记录吗？此操作不可撤销。`}
        confirmText="删除"
        onConfirm={handleDeleteBaby}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ===== Baby Edit Dialog =====

interface BabyEditDialogProps {
  open: boolean;
  baby: Baby | null;
  onClose: () => void;
  onSave: (data: NewBabyInput) => void;
}

const BabyEditDialog: React.FC<BabyEditDialogProps> = ({ open, baby, onClose, onSave }) => {
  const [name, setName] = useState(baby?.name ?? '');
  const [gender, setGender] = useState<'male' | 'female'>(baby?.gender ?? 'male');
  const [birthDate, setBirthDate] = useState(
    baby ? dayjs(baby.birthDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  );
  const [birthWeight, setBirthWeight] = useState(String(baby?.birthWeight ?? 3.5));
  const [birthHeight, setBirthHeight] = useState(String(baby?.birthHeight ?? 50));

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setName(baby?.name ?? '');
      setGender(baby?.gender ?? 'male');
      setBirthDate(baby ? dayjs(baby.birthDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
      setBirthWeight(String(baby?.birthWeight ?? 3.5));
      setBirthHeight(String(baby?.birthHeight ?? 50));
    }
  }, [open, baby]);

  const handleSave = (): void => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      gender,
      birthDate: dayjs(birthDate).toISOString(),
      birthWeight: parseFloat(birthWeight) || 3.5,
      birthHeight: parseFloat(birthHeight) || 50,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Nunito", "PingFang SC", sans-serif' }}>
        {baby ? '编辑宝宝档案' : '添加宝宝'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="宝宝昵称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={(_, val: 'male' | 'female' | null) => val && setGender(val)}
            fullWidth
            size="small"
          >
            <ToggleButton value="male">👦 男孩</ToggleButton>
            <ToggleButton value="female">👧 女孩</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="出生日期"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="出生体重(kg)"
              type="number"
              value={birthWeight}
              onChange={(e) => setBirthWeight(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="出生身长(cm)"
              type="number"
              value={birthHeight}
              onChange={(e) => setBirthHeight(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">取消</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim()}
          sx={{
            background: 'linear-gradient(135deg, #F4A940, #D97706)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(244,169,64,0.35)',
            },
          }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPage;
