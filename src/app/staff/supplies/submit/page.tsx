'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
    if (!form.name) missing.push('医院名称');
    if (!form.address) missing.push('医院详细地址');
    if (!form.contactName) missing.push('责任人姓名');
    if (!form.contactPhone) missing.push('责任人联系方式');
    if (!form.pathways) missing.push('可接受的捐物资渠道');
    if (!form.source) missing.push('需求信息数据来源');
    if (missing.length) {
      setError(`请填写必填字段：${missing.join('、')}`);
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
            我们将在审核、确保准确性后以最快速度上线信息。感谢提供！
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button fullWidth href={backHref}>
            返回物资列表
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" fontWeight={700} gutterBottom>需求提交</Typography>

      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ bgcolor: '#f44336', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
          数据贡献志愿者请注意：我们感谢您提供数据以帮助其他志愿者；但为了资源分配效率与信息准确度考量，在您提交数据后我们还需进行二次审核、确保信息真实无误后，再公开发布您的信息；因此，您可能不会看到您的信息被立即公开。若您想加速此流程，还请在下方的【需求官方证明】一栏中，填写相关官方证明，我们核验此证明后即可立即发布数据。感谢您的理解与配合！
        </CardContent>
      </Card>

      <FormItem label="1. 医院名称" required>
        <TextField fullWidth size="small" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="请输入医院名称" />
      </FormItem>
      <FormItem label="2. 省份">
        <TextField fullWidth size="small" value={form.province} onChange={(e) => handleFieldChange('province', e.target.value)} placeholder="请选择省份" />
      </FormItem>
      <FormItem label="3. 城市">
        <TextField fullWidth size="small" value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} placeholder="请选择城市" />
      </FormItem>
      <FormItem label="4. 区/县">
        <TextField fullWidth size="small" value={form.suburb} onChange={(e) => handleFieldChange('suburb', e.target.value)} placeholder="请选择区/县" />
      </FormItem>
      <FormItem label="5. 医院详细地址" required>
        <TextField fullWidth size="small" multiline rows={2} value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder="请输入医院详细地址" />
      </FormItem>
      <FormItem label="6. 医院现每天接待患者数量">
        <TextField fullWidth size="small" value={form.patients} onChange={(e) => handleFieldChange('patients', e.target.value)} placeholder="(选填) 请输入医院现每天接待患者数量" />
      </FormItem>
      <FormItem label="7. 医院现床位数">
        <TextField fullWidth size="small" value={form.beds} onChange={(e) => handleFieldChange('beds', e.target.value)} placeholder="(选填) 请输入现医院现床位数" />
      </FormItem>
      <FormItem label="8. 责任人姓名" required>
        <TextField fullWidth size="small" value={form.contactName} onChange={(e) => handleFieldChange('contactName', e.target.value)} placeholder="请输入责任人姓名" />
      </FormItem>
      <FormItem label="9. 责任人所在单位或组织">
        <TextField fullWidth size="small" value={form.contactOrg} onChange={(e) => handleFieldChange('contactOrg', e.target.value)} placeholder="请输入责任人所在单位或组织" />
      </FormItem>
      <FormItem label="10. 责任人联系方式" required>
        <TextField fullWidth size="small" value={form.contactPhone} onChange={(e) => handleFieldChange('contactPhone', e.target.value)} placeholder="请输入责任人联系方式" />
      </FormItem>

      {/* Supply items */}
      <FormItem label="11. 物资需求列表" required>
        <Alert severity="info" sx={{ mb: 2 }}>
          为了填写效率考量，我们自动填写了大部分医院都需要的物资信息。还请二次确认是否正确！
        </Alert>
        <Grid container spacing={2}>
          {supplies.map((s, i) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={i}>
              <Card variant="outlined" sx={{ p: 1.5, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  需求物资 #{i + 1} {s.name || '(未命名)'}
                </Typography>
                <TextField fullWidth size="small" label="物资名称 *" value={s.name} onChange={(e) => handleSupplyChange(i, 'name', e.target.value)} sx={{ mb: 1, bgcolor: !s.name ? '#ffcdd2' : '#fff' }} />
                <TextField fullWidth size="small" label="数量单位 *" placeholder="如：个、20包/箱" value={s.unit} onChange={(e) => handleSupplyChange(i, 'unit', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="需求数量 *" value={s.need} onChange={(e) => handleSupplyChange(i, 'need', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="每日消耗" value={s.daily} onChange={(e) => handleSupplyChange(i, 'daily', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="库存数量 *" value={s.have} onChange={(e) => handleSupplyChange(i, 'have', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth size="small" label="物资要求" placeholder="如国家标准 GBxxxxx-xxxx" value={s.requirements} onChange={(e) => handleSupplyChange(i, 'requirements', e.target.value)} sx={{ mb: 1 }} />
                <Button fullWidth color="error" variant="contained" size="small" startIcon={<RemoveCircleIcon />} onClick={() => setSupplies((prev) => prev.filter((_, j) => j !== i))}>
                  移除物品
                </Button>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
            <Button fullWidth size="large" variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => setSupplies((prev) => [...prev, { ...emptySupply }])} sx={{ height: '100%', minHeight: 80 }}>
              添加物品
            </Button>
          </Grid>
        </Grid>
      </FormItem>

      <FormItem label="12. 可接受的捐物资渠道" required>
        <TextField fullWidth size="small" value={form.pathways} onChange={(e) => handleFieldChange('pathways', e.target.value)} placeholder="是否接受个人捐赠和/或企业等捐赠渠道？" />
      </FormItem>
      <FormItem label="13. 现在的物流状况">
        <TextField fullWidth size="small" value={form.logisticStatus} onChange={(e) => handleFieldChange('logisticStatus', e.target.value)} placeholder="如何将物资送抵贵院？有无特殊情况需说明？" />
      </FormItem>
      <FormItem label="14. 需求信息数据来源" required>
        <TextField fullWidth size="small" value={form.source} onChange={(e) => handleFieldChange('source', e.target.value)} placeholder="链接最快最准，若无也可填文字说明" />
      </FormItem>
      <FormItem label="15. 需求的官方证明">
        <TextField fullWidth size="small" value={form.proof} onChange={(e) => handleFieldChange('proof', e.target.value)} placeholder="链接最快最准，若无也可填文字说明" />
      </FormItem>
      <FormItem label="16. 其他备注">
        <TextField fullWidth multiline rows={3} size="small" value={form.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} placeholder="(选填) 有无其他备注？" />
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
