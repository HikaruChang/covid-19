'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface FormItemProps {
  label: string;
  required?: boolean;
  dense?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function FormItem({
  label,
  required = false,
  dense = false,
  fullWidth = false,
  children,
}: FormItemProps) {
  if (dense) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'baseline', mb: 0.5 }}>
        <Typography
          component="span"
          variant="body2"
          fontWeight={700}
          sx={{ mr: 1, whiteSpace: 'nowrap' }}
        >
          {label}
        </Typography>
        <Box
          component="span"
          sx={{ width: fullWidth ? 'calc(100% - 96px)' : 'auto' }}
        >
          {children}
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ lineHeight: '36px', mb: 1 }}>
      <Typography variant="body2" fontWeight={700}>
        {label}
        {required && (
          <Typography component="span" color="error" fontWeight={900}>
            *
          </Typography>
        )}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}
