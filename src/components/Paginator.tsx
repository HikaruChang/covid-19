'use client';

import { Box, Button, Grid, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PaginatorProps {
  page: number;
  pageCount: number;
  itemsLength: number;
  large?: boolean;
  scroll?: boolean;
  onChange: (page: number, scroll?: boolean) => void;
}

export default function Paginator({
  page,
  pageCount,
  itemsLength,
  large,
  scroll,
  onChange,
}: PaginatorProps) {
  return (
    <Grid container alignItems="center" justifyContent="center" sx={{ my: 1 }}>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          fullWidth
          size={large ? 'large' : 'medium'}
          disabled={page <= 1}
          onClick={() => onChange(page - 1, scroll)}
          startIcon={<ChevronLeftIcon />}
        >
          上页
        </Button>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center', lineHeight: 1 }}>
        <Typography variant="body2">
          第 {page} 页，共 {pageCount} 页
        </Typography>
        <Typography variant="caption">(共 {itemsLength} 条记录)</Typography>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          fullWidth
          size={large ? 'large' : 'medium'}
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1, scroll)}
          endIcon={<ChevronRightIcon />}
        >
          下页
        </Button>
      </Grid>
    </Grid>
  );
}
