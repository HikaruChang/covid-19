'use client';

import { useState, useEffect } from 'react';
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
      setError('请填写必填字段：姓名、详细地址、联系电话');
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
      setError(e.message || '提交失败');
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
            已成功提交物资需求
          </Typography>
          <Typography variant="body2" color="text.secondary">
            由于缓存原因，您的需求可能需要最多 5 分钟才能在需求列表中展示
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button fullWidth href="/people/supplies">
            返回需求列表
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        社区物资需求提交
      </Typography>
      <Card sx={{ mb: 2 }} elevation={0}>
        <CardContent sx={{ bgcolor: '#ff5722', color: '#fff', fontWeight: 700 }}>
          请注意：由于缓存原因，您的需求可能需要最多 5 分钟才能在需求列表中展示。感谢您的理解与配合！
        </CardContent>
      </Card>

      <FormItem label="1. 姓名" required>
        <TextField fullWidth size="small" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="2. 年龄">
        <TextField fullWidth size="small" type="number" value={form.age} onChange={(e) => handleFieldChange('age', e.target.value)} placeholder="请输入年龄" />
      </FormItem>
      <FormItem label="3. 省份">
        <TextField fullWidth size="small" value={form.province} onChange={(e) => handleFieldChange('province', e.target.value)} placeholder="请输入省份" />
      </FormItem>
      <FormItem label="4. 城市">
        <TextField fullWidth size="small" value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} placeholder="请输入城市" />
      </FormItem>
      <FormItem label="5. 区">
        <TextField fullWidth size="small" value={form.suburb} onChange={(e) => handleFieldChange('suburb', e.target.value)} placeholder="请输入区" />
      </FormItem>
      <FormItem label="6. 详细地址" required>
        <TextField fullWidth size="small" value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder="请输入详细地址" />
      </FormItem>
      <FormItem label="7. 联系电话" required>
        <TextField fullWidth size="small" value={form.contactPhone} onChange={(e) => handleFieldChange('contactPhone', e.target.value)} placeholder="请输入联系电话" />
      </FormItem>

      {/* Medical supplies */}
      <FormItem label="8. 医疗物资需求">
        <Grid container spacing={2}>
          {medicalSupplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  医疗需求物资 #{i + 1} {s.name || '(未命名)'}
                </Typography>
                <TextField fullWidth size="small" label="物资名称 *" value={s.name} onChange={(e) => handleSupplyChange('medical', i, 'name', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="数量单位" value={s.unit} onChange={(e) => handleSupplyChange('medical', i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="需求数量" value={s.need} onChange={(e) => handleSupplyChange('medical', i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="每日消耗" value={s.daily} onChange={(e) => handleSupplyChange('medical', i, 'daily', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="库存数量" value={s.have} onChange={(e) => handleSupplyChange('medical', i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => removeSupply('medical', i)}>
                  移除此物品
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => addSupply('medical')} sx={{ height: '100%', minHeight: 80 }}>
              添加医疗物品
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      {/* Live supplies */}
      <FormItem label="9. 生活物资需求">
        <Grid container spacing={2}>
          {liveSupplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  生活需求物资 #{i + 1} {s.name || '(未命名)'}
                </Typography>
                <TextField fullWidth size="small" label="物资名称 *" value={s.name} onChange={(e) => handleSupplyChange('live', i, 'name', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="数量单位" value={s.unit} onChange={(e) => handleSupplyChange('live', i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="需求数量" value={s.need} onChange={(e) => handleSupplyChange('live', i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="库存数量" value={s.have} onChange={(e) => handleSupplyChange('live', i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => removeSupply('live', i)}>
                  移除此物品
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => addSupply('live')} sx={{ height: '100%', minHeight: 80 }}>
              添加生活物品
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      <FormItem label="10. 备注">
        <TextField fullWidth multiline rows={3} size="small" value={form.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} placeholder="有什么需要补充的吗？" />
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
        {loading ? '提交中...' : '确认提交'}
      </Button>
    </Box>
  );
}
