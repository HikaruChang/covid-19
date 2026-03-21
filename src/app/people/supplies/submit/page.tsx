'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormItem from '@/components/FormItem';
import Turnstile from '@/components/Turnstile';
import api from '@/lib/api';

interface SupplyItem {
  name: string;
  unit: string;
  need: string;
  daily: string;
  have: string;
}

const emptySupply: SupplyItem = { name: '', unit: '', need: '', daily: '', have: '' };

export default function CommunitySubmissionPage() {
  const t = useTranslations();
  const [form, setForm] = useState({
    name: '',
    age: '',
    province: '',
    city: '',
    suburb: '',
    address: '',
    contactPhone: '',
    notes: '',
  });
  const [medicalSupplies, setMedicalSupplies] = useState<SupplyItem[]>([{ ...emptySupply }]);
  const [liveSupplies, setLiveSupplies] = useState<SupplyItem[]>([{ ...emptySupply }]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [siteKey, setSiteKey] = useState('');

  useEffect(() => {
    api.turnstileSiteKey().then((d) => setSiteKey(d.siteKey)).catch(() => { });
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSupplyChange = (
    type: 'medical' | 'live',
    index: number,
    key: keyof SupplyItem,
    value: string,
  ) => {
    const setter = type === 'medical' ? setMedicalSupplies : setLiveSupplies;
    setter((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const addSupply = (type: 'medical' | 'live') => {
    const setter = type === 'medical' ? setMedicalSupplies : setLiveSupplies;
    setter((prev) => [...prev, { ...emptySupply }]);
  };

  const removeSupply = (type: 'medical' | 'live', index: number) => {
    const setter = type === 'medical' ? setMedicalSupplies : setLiveSupplies;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.contactPhone) {
      setError(t('community.submitForm.requiredFieldsError', { fields: `${t('community.name')}、${t('community.address')}、${t('community.phone')}` }));
      return;
    }
    setLoading(true);
    try {
      await api.submitCommunitySupplies({
        ...form,
        age: form.age ? parseInt(form.age, 10) : 0,
        medicalSupplies: medicalSupplies.filter((s) => s.name),
        liveSupplies: liveSupplies.filter((s) => s.name),
        turnstileToken,
      });
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || t('partials.level.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Dialog open={submitted}>
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {t('community.submitForm.successTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('community.submitForm.successSubtitle')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button fullWidth href="/people/supplies">
            {t('community.submitForm.backToList')}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('community.submitForm.pageTitle')}
      </Typography>
      <Card sx={{ mb: 2 }} elevation={0}>
        <CardContent sx={{ bgcolor: '#ff5722', color: '#fff', fontWeight: 700 }}>
          {t('community.submitForm.cacheNotice')}
        </CardContent>
      </Card>

      <FormItem label={`1. ${t('community.name')}`} required>
        <TextField fullWidth size="small" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder={t('community.submitForm.placeholder.name')} />
      </FormItem>
      <FormItem label={`2. ${t('community.age')}`}>
        <TextField fullWidth size="small" type="number" value={form.age} onChange={(e) => handleFieldChange('age', e.target.value)} placeholder={t('community.submitForm.placeholder.age')} />
      </FormItem>
      <FormItem label={`3. ${t('community.submitForm.province')}`}>
        <TextField fullWidth size="small" value={form.province} onChange={(e) => handleFieldChange('province', e.target.value)} placeholder={t('community.submitForm.placeholder.province')} />
      </FormItem>
      <FormItem label={`4. ${t('community.submitForm.city')}`}>
        <TextField fullWidth size="small" value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} placeholder={t('community.submitForm.placeholder.city')} />
      </FormItem>
      <FormItem label={`5. ${t('community.submitForm.suburb')}`}>
        <TextField fullWidth size="small" value={form.suburb} onChange={(e) => handleFieldChange('suburb', e.target.value)} placeholder={t('community.submitForm.placeholder.suburb')} />
      </FormItem>
      <FormItem label={`6. ${t('community.address')}`} required>
        <TextField fullWidth size="small" value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder={t('community.submitForm.placeholder.address')} />
      </FormItem>
      <FormItem label={`7. ${t('community.phone')}`} required>
        <TextField fullWidth size="small" value={form.contactPhone} onChange={(e) => handleFieldChange('contactPhone', e.target.value)} placeholder={t('community.submitForm.placeholder.phone')} />
      </FormItem>

      {/* Medical supplies */}
      <FormItem label={`8. ${t('community.medicalSupplies')}`}>
        <Grid container spacing={2}>
          {medicalSupplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {t('community.submitForm.medicalItem', { num: i + 1 })} {s.name || t('community.submitForm.unnamed')}
                </Typography>
                <TextField fullWidth size="small" label={`${t('supplies.supplyName')} *`} value={s.name} onChange={(e) => handleSupplyChange('medical', i, 'name', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyUnit')} value={s.unit} onChange={(e) => handleSupplyChange('medical', i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyNeed')} value={s.need} onChange={(e) => handleSupplyChange('medical', i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyDaily')} value={s.daily} onChange={(e) => handleSupplyChange('medical', i, 'daily', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyHave')} value={s.have} onChange={(e) => handleSupplyChange('medical', i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => removeSupply('medical', i)}>
                  {t('community.submitForm.removeItem')}
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => addSupply('medical')} sx={{ height: '100%', minHeight: 80 }}>
              {t('community.submitForm.addMedical')}
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      {/* Live supplies */}
      <FormItem label={`9. ${t('community.liveSupplies')}`}>
        <Grid container spacing={2}>
          {liveSupplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {t('community.submitForm.liveItem', { num: i + 1 })} {s.name || t('community.submitForm.unnamed')}
                </Typography>
                <TextField fullWidth size="small" label={`${t('supplies.supplyName')} *`} value={s.name} onChange={(e) => handleSupplyChange('live', i, 'name', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyUnit')} value={s.unit} onChange={(e) => handleSupplyChange('live', i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyNeed')} value={s.need} onChange={(e) => handleSupplyChange('live', i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyHave')} value={s.have} onChange={(e) => handleSupplyChange('live', i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => removeSupply('live', i)}>
                  {t('community.submitForm.removeItem')}
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => addSupply('live')} sx={{ height: '100%', minHeight: 80 }}>
              {t('community.submitForm.addLive')}
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      <FormItem label={`10. ${t('supplies.notes')}`}>
        <TextField fullWidth multiline rows={3} size="small" value={form.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} placeholder={t('community.submitForm.placeholder.notes')} />
      </FormItem>

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onVerify={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
        />
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        disabled={loading || (!!siteKey && !turnstileToken)}
        onClick={handleSubmit}
        sx={{ mt: 2, mb: 4 }}
      >
        {loading ? t('partials.submitting') : t('partials.confirmSubmit')}
      </Button>
    </Box>
  );
}
