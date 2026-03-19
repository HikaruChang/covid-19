'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import Turnstile from '@/components/Turnstile';
import api from '@/lib/api';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  content: string;
  type?: string;
  causes?: string[];
  onSuccess?: () => void;
}

const defaultCauses = [
  '信息不准确',
  '信息已过期',
  '联系方式错误',
  '地址错误',
  '其他',
];

export default function ReportDialog({
  open,
  onClose,
  content,
  type = 'general',
  causes = defaultCauses,
  onSuccess,
}: ReportDialogProps) {
  const [cause, setCause] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [siteKey, setSiteKey] = useState('');

  useEffect(() => {
    api.turnstileSiteKey().then((d) => setSiteKey(d.siteKey)).catch(() => { });
  }, []);

  const handleSubmit = async () => {
    if (!cause) return;
    if (!turnstileToken) return;
    setLoading(true);
    try {
      await api.reportIncorrect({ type, cause, content, turnstileToken });
      onSuccess?.();
      onClose();
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setCause('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>提交纠错</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
          <InputLabel>错误类型</InputLabel>
          <Select
            value={cause}
            label="错误类型"
            onChange={(e) => setCause(e.target.value)}
          >
            {causes.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2">
          收到纠错请求后我们会再次审核此条信息以保证准确性。
        </Typography>
        <Typography variant="body2" color="error">
          注意：我们的人力资源有限，烦请不要滥用此功能，十分感谢！
        </Typography>
        {siteKey && (
          <Turnstile
            siteKey={siteKey}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleSubmit}
          disabled={!cause || loading || (!!siteKey && !turnstileToken)}
          color="primary"
        >
          {loading ? <CircularProgress size={20} /> : '确认'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
