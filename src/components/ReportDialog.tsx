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
import { useTranslations } from 'next-intl';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  content: string;
  type?: string;
  causes?: string[];
  onSuccess?: () => void;
}

export default function ReportDialog({
  open,
  onClose,
  content,
  type = 'general',
  causes,
  onSuccess,
}: ReportDialogProps) {
  const t = useTranslations('report');
  const td = useTranslations('partials.dialog');
  const defaultCauses = t.raw('causes') as string[];
  const effectiveCauses = causes ?? defaultCauses;

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
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
          <InputLabel>{t('errorType')}</InputLabel>
          <Select
            value={cause}
            label={t('errorType')}
            onChange={(e) => setCause(e.target.value)}
          >
            {effectiveCauses.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2">
          {t('notice')}
        </Typography>
        <Typography variant="body2" color="error">
          {t('warning')}
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
        <Button onClick={onClose}>{td('cancel')}</Button>
        <Button
          onClick={handleSubmit}
          disabled={!cause || loading || (!!siteKey && !turnstileToken)}
          color="primary"
        >
          {loading ? <CircularProgress size={20} /> : td('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
