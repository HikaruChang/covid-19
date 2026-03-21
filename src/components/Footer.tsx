'use client';

import { Box, Typography, Button, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTranslations } from 'next-intl';

export default function Footer({ variant = 'default' }: { variant?: 'psychological' | 'default' }) {
  const t = useTranslations('footer');
  const bgColor = variant === 'psychological' ? '#66bb6a' : '#eeeeee';
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 3,
        textAlign: 'center',
        bgcolor: bgColor,
      }}
    >
      <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>
        {t('slogan')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
        <Typography
          component="a"
          href="https://wuhan.support/eula/"
          target="_blank"
          rel="noopener"
          variant="body2"
          fontWeight={700}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {t('eula')}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography
          component="a"
          href="https://wuhan.support/privacy/"
          target="_blank"
          rel="noopener"
          variant="body2"
          fontWeight={700}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {t('privacy')}
        </Typography>
      </Box>

      <Typography variant="body2">
        <a
          href="https://wuhan.support/"
          target="_blank"
          rel="noopener"
          style={{ textDecoration: 'none', fontWeight: 700, color: 'inherit' }}
        >
          {t('team')}
        </a>
      </Typography>

      <Button
        variant="outlined"
        size="small"
        href="https://github.com/wuhan-support/"
        target="_blank"
        startIcon={<GitHubIcon />}
        sx={{ mt: 1 }}
      >
        {t('source')}
      </Button>
    </Box>
  );
}
