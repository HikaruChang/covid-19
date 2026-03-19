'use client';

import { Box, Typography, Button, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer({ variant = 'default' }: { variant?: 'psychological' | 'default' }) {
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
        驰援一线 · 传递温暖
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
          最终用户许可协议
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
          隐私声明
        </Typography>
      </Box>

      <Typography variant="body2">
        <a
          href="https://wuhan.support/"
          target="_blank"
          rel="noopener"
          style={{ textDecoration: 'none', fontWeight: 700, color: 'inherit' }}
        >
          wuhan.support 团队
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
        项目源代码
      </Button>
    </Box>
  );
}
