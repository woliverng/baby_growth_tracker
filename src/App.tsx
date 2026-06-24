import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';

import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import RecordsPage from '@/pages/RecordsPage';
import GrowthPage from '@/pages/GrowthPage';
import SettingsPage from '@/pages/SettingsPage';
import AlbumPage from '@/pages/AlbumPage';
import QuickRecordSheet from '@/components/common/QuickRecordSheet';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { NewBabyInput } from '@/types';

/**
 * First-run onboarding dialog for creating the first baby profile.
 */
function OnboardingDialog(): React.ReactElement {
  const babies = useBabyStore((s) => s.babies);
  const addBaby = useBabyStore((s) => s.addBaby);
  const setActiveBabyId = useSettingsStore((s) => s.setActiveBabyId);

  const [open, setOpen] = useState(babies.length === 0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState(dayjsStr());
  const [birthWeight, setBirthWeight] = useState('3.5');
  const [birthHeight, setBirthHeight] = useState('50');

  function dayjsStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  const handleSubmit = (): void => {
    if (!name.trim()) return;
    const input: NewBabyInput = {
      name: name.trim(),
      gender,
      birthDate: new Date(birthDate).toISOString(),
      birthWeight: parseFloat(birthWeight) || 3.5,
      birthHeight: parseFloat(birthHeight) || 50,
    };
    const baby = addBaby(input);
    setActiveBabyId(baby.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        欢迎使用宝宝成长记录 🎉
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
            onChange={(_, val) => val && setGender(val)}
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
            />
            <TextField
              label="出生身长(cm)"
              type="number"
              value={birthHeight}
              onChange={(e) => setBirthHeight(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={!name.trim()}
          color="primary"
        >
          创建宝宝档案
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const App: React.FC = () => {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
      <QuickRecordSheet />
      <OnboardingDialog />
    </>
  );
};

export default App;
