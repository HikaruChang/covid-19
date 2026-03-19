'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpCircleIcon from '@mui/icons-material/HelpOutline';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LocaleSwitcher from '@/components/LocaleSwitcher';

// 0=WAITING, 1=OK, 2=SIGNATURE_MISMATCH, 3=ILLEGAL_ARGUMENTS
const statusConfig = [
  { color: '#9e9e9e', icon: <TimerIcon sx={{ fontSize: 48 }} />, title: '验证中...', subtitle: '正在验证签名，请稍候' },
  { color: '#4caf50', icon: <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50' }} />, title: '验证通过', subtitle: '此证书签名有效且已通过验证' },
  { color: '#f44336', icon: <ErrorIcon sx={{ fontSize: 48, color: '#f44336' }} />, title: '签名不匹配', subtitle: '此证书签名验证失败，证书可能被篡改' },
  { color: '#ff9800', icon: <HelpCircleIcon sx={{ fontSize: 48, color: '#ff9800' }} />, title: '参数缺失', subtitle: '缺少必要的验证参数' },
];

function VerifierContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState(0); // WAITING

  const name = searchParams.get('n') || '';
  const group = searchParams.get('g') || '';
  const signature = searchParams.get('s') || '';

  useEffect(() => {
    if (!name || !group || !signature) {
      setResult(3); // ILLEGAL_ARGUMENTS
      return;
    }

    const delay = Math.random() * 3000 + 1000;
    let timeoutId: ReturnType<typeof setTimeout>;

    fetch('/api/certificate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, group, signature }),
    })
      .then((r) => r.json())
      .then((data: any) => {
        timeoutId = setTimeout(() => {
          if (data.validity === 1) {
            setResult(1); // OK
          } else {
            setResult(2); // SIGNATURE_MISMATCH
          }
        }, delay);
      })
      .catch(() => {
        timeoutId = setTimeout(() => setResult(2), delay);
      });

    return () => clearTimeout(timeoutId);
  }, [name, group, signature]);

  const status = statusConfig[result];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
        <LocaleSwitcher />
      </Box>

      <Typography
        variant="h4"
        sx={{ color: '#a20002', fontWeight: 900, letterSpacing: 2, mb: 1 }}
      >
        covid-19.icu
      </Typography>
      <Typography variant="overline" sx={{ mb: 0.5 }}>
        wuhan.support Certificate Verification
      </Typography>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        志愿者证书验证
      </Typography>

      <Divider sx={{ width: '100%', maxWidth: 400, my: 2 }} />

      {/* Status display */}
      <Box sx={{ color: status.color, mb: 2 }}>
        {status.icon}
        <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 0.5 }}>
          {status.title}
        </Typography>
        <Typography variant="subtitle1">{status.subtitle}</Typography>
      </Box>

      {/* Certificate details card */}
      {result !== 3 && (
        <Card sx={{ width: '100%', maxWidth: 400, position: 'relative', overflow: 'visible' }}>
          {(result === 0 || result === 2) && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: result === 0 ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.5)',
                zIndex: 1,
                borderRadius: 1,
              }}
            >
              {result === 0 ? (
                <CircularProgress sx={{ color: '#fff' }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 48, color: '#fff' }} />
              )}
              <Typography variant="h6" sx={{ color: '#fff', mt: 1 }}>
                {status.title}
              </Typography>
            </Box>
          )}
          <CardContent>
            <Typography variant="h6" gutterBottom>证书详情</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'left', mb: 1 }}>
              以下信息来自证书签名
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary={name} secondary="姓名" />
              </ListItem>
              <ListItem>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary={group} secondary="组别" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <VerifierContent />
    </Suspense>
  );
}
