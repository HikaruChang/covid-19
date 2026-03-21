'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
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
  requirements: string;
}

const defaultSupplies: SupplyItem[] = [
  { name: '医用防护口罩（N95）', unit: '个', need: '', daily: '', have: '', requirements: 'GB19083-2010' },
  { name: '医用外科口罩', unit: '个', need: '', daily: '', have: '', requirements: 'YY0469-2011' },
  { name: '一次性使用医用口罩', unit: '个', need: '', daily: '', have: '', requirements: 'YY/T 0969-2013' },
  { name: '医用一次性防护服', unit: '个', need: '', daily: '', have: '', requirements: 'GB19082-2009' },
  { name: '个人用眼护具', unit: '副', need: '', daily: '', have: '', requirements: 'GB14866-2006' },
  { name: '一次性使用医用橡胶检查手套', unit: '双', need: '', daily: '', have: '', requirements: 'GB10213-2006' },
  { name: '手术衣', unit: '个', need: '', daily: '', have: '', requirements: 'YY/T 0506.2-2016' },
];

const emptySupply: SupplyItem = { name: '', unit: '', need: '', daily: '', have: '', requirements: '' };

export default function HospitalSubmissionPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const backHref = pathname.startsWith('/staff') ? '/staff/supplies' : pathname.startsWith('/people') ? '/people/supplies' : '/volunteer/supplies';
  const [form, setForm] = useState({
    name: '',
    province: '',
    city: '',
    suburb: '',
    address: '',
    patients: '',
    beds: '',
    contactName: '',
    contactOrg: '',
    contactPhone: '',
    pathways: '',
    logisticStatus: '',
    source: '',
    proof: '',
    notes: '',
  });
  const [supplies, setSupplies] = useState<SupplyItem[]>(defaultSupplies.map((s) => ({ ...s })));
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

  const handleSupplyChange = (index: number, key: keyof SupplyItem, value: string) => {
    setSupplies((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const handleSubmit = async () => {
    const missing: string[] = [];
    if (!form.name) missing.push(t('supplies.hospitalName'));
    if (!form.address) missing.push(t('supplies.detailAddress'));
    if (!form.contactName) missing.push(t('supplies.contactName'));
    if (!form.contactPhone) missing.push(t('supplies.contactPhone'));
    if (!form.pathways) missing.push(t('supplies.pathways'));
    if (!form.source) missing.push(t('supplies.source'));
    if (missing.length) {
      setError(t('supplies.submitForm.requiredFieldsError', { fields: missing.join(', ') }));
      return;
    }
    setLoading(true);
    try {
      await api.submitSupplies({
        ...form,
        supplies: supplies.filter((s) => s.name),
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
            {t('supplies.submitForm.successTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('supplies.submitForm.successSubtitle')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button fullWidth href={backHref}>
            {t('supplies.submitForm.backToList')}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" fontWeight={700} gutterBottom>{t('supplies.submitForm.pageTitle')}</Typography>

      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ bgcolor: '#f44336', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
          {t('supplies.submitForm.volunteerNotice')}
        </CardContent>
      </Card>

      <FormItem label={'1. ' + t('supplies.hospitalName')} required>
        <TextField fullWidth size="small" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder={t('supplies.submitForm.placeholder.name')} />
      </FormItem>
      <FormItem label={'2. ' + t('supplies.submitForm.province')}>
        <TextField fullWidth size="small" value={form.province} onChange={(e) => handleFieldChange('province', e.target.value)} placeholder={t('supplies.submitForm.placeholder.province')} />
      </FormItem>
      <FormItem label={'3. ' + t('supplies.submitForm.city')}>
        <TextField fullWidth size="small" value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} placeholder={t('supplies.submitForm.placeholder.city')} />
      </FormItem>
      <FormItem label={'4. ' + t('supplies.submitForm.suburb')}>
        <TextField fullWidth size="small" value={form.suburb} onChange={(e) => handleFieldChange('suburb', e.target.value)} placeholder={t('supplies.submitForm.placeholder.suburb')} />
      </FormItem>
      <FormItem label={'5. ' + t('supplies.detailAddress')} required>
        <TextField fullWidth size="small" multiline rows={2} value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder={t('supplies.submitForm.placeholder.address')} />
      </FormItem>
      <FormItem label={'6. ' + t('supplies.patients')}>
        <TextField fullWidth size="small" value={form.patients} onChange={(e) => handleFieldChange('patients', e.target.value)} placeholder={t('supplies.submitForm.placeholder.patients')} />
      </FormItem>
      <FormItem label={'7. ' + t('supplies.beds')}>
        <TextField fullWidth size="small" value={form.beds} onChange={(e) => handleFieldChange('beds', e.target.value)} placeholder={t('supplies.submitForm.placeholder.beds')} />
      </FormItem>
      <FormItem label={'8. ' + t('supplies.contactName')} required>
        <TextField fullWidth size="small" value={form.contactName} onChange={(e) => handleFieldChange('contactName', e.target.value)} placeholder={t('supplies.submitForm.placeholder.contactName')} />
      </FormItem>
      <FormItem label={'9. ' + t('supplies.contactOrg')}>
        <TextField fullWidth size="small" value={form.contactOrg} onChange={(e) => handleFieldChange('contactOrg', e.target.value)} placeholder={t('supplies.submitForm.placeholder.contactOrg')} />
      </FormItem>
      <FormItem label={'10. ' + t('supplies.contactPhone')} required>
        <TextField fullWidth size="small" value={form.contactPhone} onChange={(e) => handleFieldChange('contactPhone', e.target.value)} placeholder={t('supplies.submitForm.placeholder.contactPhone')} />
      </FormItem>

      {/* Supply items */}
      <FormItem label={'11. ' + t('supplies.submitForm.supplyListLabel')} required>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('supplies.submitForm.autoFillNotice')}
        </Alert>
        <Grid container spacing={2}>
          {supplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {t('supplies.submitForm.supplyItem', { num: i + 1 })} {s.name || t('supplies.submitForm.unnamed')}
                </Typography>
                <TextField fullWidth size="small" label={t('supplies.supplyName') + ' *'} value={s.name} onChange={(e) => handleSupplyChange(i, 'name', e.target.value)} sx={{ mb: 1, bgcolor: !s.name ? '#ffcdd2' : '#fff' }} />
                <TextField fullWidth size="small" label={t('supplies.supplyUnit') + ' *'} placeholder={t('supplies.submitForm.placeholder.unit')} value={s.unit} onChange={(e) => handleSupplyChange(i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyNeed') + ' *'} value={s.need} onChange={(e) => handleSupplyChange(i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyDaily')} value={s.daily} onChange={(e) => handleSupplyChange(i, 'daily', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyHave') + ' *'} value={s.have} onChange={(e) => handleSupplyChange(i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label={t('supplies.supplyReq')} placeholder={t('supplies.submitForm.placeholder.requirements')} value={s.requirements} onChange={(e) => handleSupplyChange(i, 'requirements', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => setSupplies((prev) => prev.filter((_, j) => j !== i))}>
                  {t('supplies.removeSupply')}
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => setSupplies((prev) => [...prev, { ...emptySupply }])} sx={{ height: '100%', minHeight: 80 }}>
              {t('supplies.addSupply')}
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      <FormItem label={'12. ' + t('supplies.pathways')} required>
        <TextField fullWidth size="small" value={form.pathways} onChange={(e) => handleFieldChange('pathways', e.target.value)} placeholder={t('supplies.submitForm.placeholder.pathways')} />
      </FormItem>
      <FormItem label={'13. ' + t('supplies.logistic')}>
        <TextField fullWidth size="small" value={form.logisticStatus} onChange={(e) => handleFieldChange('logisticStatus', e.target.value)} placeholder={t('supplies.submitForm.placeholder.logistic')} />
      </FormItem>
      <FormItem label={'14. ' + t('supplies.source')} required>
        <TextField fullWidth size="small" value={form.source} onChange={(e) => handleFieldChange('source', e.target.value)} placeholder={t('supplies.submitForm.placeholder.source')} />
      </FormItem>
      <FormItem label={'15. ' + t('supplies.proof')}>
        <TextField fullWidth size="small" value={form.proof} onChange={(e) => handleFieldChange('proof', e.target.value)} placeholder={t('supplies.submitForm.placeholder.source')} />
      </FormItem>
      <FormItem label={'16. ' + t('supplies.notes')}>
        <TextField fullWidth multiline rows={3} size="small" value={form.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} placeholder={t('supplies.submitForm.placeholder.notes')} />
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
