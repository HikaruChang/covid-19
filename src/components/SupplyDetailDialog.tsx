'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface SupplyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  content?: any;
  item?: any;
  type?: 'hospital' | 'community';
}

function SupplyCard({
  supply,
  index,
}: {
  supply: any;
  index: number;
}) {
  return (
    <Card sx={{ border: '2px solid #cf5355', height: '100%' }}>
      <CardContent>
        <Typography variant="h6">
          <Typography component="span" variant="body2">
            #{index + 1}
          </Typography>{' '}
          <strong>{supply.name || supply.n}</strong>
        </Typography>
        {supply.abbr && (
          <Typography variant="body2">又名：{supply.abbr}</Typography>
        )}
        {(supply.a !== undefined || supply.need) && (
          <Typography
            variant="h4"
            color="error"
            fontWeight={700}
          >
            {supply.a !== undefined
              ? typeof supply.a === 'number'
                ? `× ${supply.a.toLocaleString()} ${supply.u || ''}`
                : supply.a
              : null}
            {supply.need && (
              <>
                <Typography component="span" variant="body2">需要</Typography>{' '}
                × {supply.need} {supply.unit || ''}
              </>
            )}
          </Typography>
        )}
        {supply.daily && (
          <Typography variant="h6" color="error" fontWeight={700}>
            <Typography component="span" variant="body2">每日消耗</Typography>{' '}
            × {supply.daily} {supply.unit || ''}
          </Typography>
        )}
        {supply.have && (
          <Typography variant="h6" color="error" fontWeight={700}>
            <Typography component="span" variant="body2">现剩余</Typography>{' '}
            × {supply.have} {supply.unit || ''}
          </Typography>
        )}
        {(supply.r || supply.requirements) && (
          <Typography variant="body2">
            物资要求：<strong>{supply.r || supply.requirements}</strong>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function SupplyDetailDialog({
  open,
  onClose,
  content: contentProp,
  item,
  type = 'hospital',
}: SupplyDetailDialogProps) {
  const content = contentProp ?? item;
  if (!content) return null;

  const title =
    type === 'hospital'
      ? '医疗机构物资需求 — 需求列表'
      : '社区物资需求 — 需求详细信息';
  const name = type === 'hospital' ? content.name : content.address;

  const hospitalSupplies = content.items || content.supplies || [];
  const medicalSupplies = content.medicalSupplies || content.medicalsupplies || [];
  const liveSupplies = content.liveSupplies || content.livesupplies || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle
        sx={{
          bgcolor: '#a14042',
          color: '#fff',
          pb: 2,
        }}
      >
        <Typography variant="overline" display="block">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {name}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {type === 'hospital' && hospitalSupplies.length > 0 && (
          <Grid container spacing={2}>
            {hospitalSupplies.map((s: any, i: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                <SupplyCard supply={s} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {type === 'community' && (
          <>
            {medicalSupplies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  医疗物资需求
                </Typography>
                <Grid container spacing={2}>
                  {medicalSupplies.map((s: any, i: number) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                      <SupplyCard supply={s} index={i} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            {liveSupplies.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  生活物资需求
                </Typography>
                <Grid container spacing={2}>
                  {liveSupplies.map((s: any, i: number) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                      <SupplyCard supply={s} index={i} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          sx={{ color: '#a20002' }}
          size="large"
          startIcon={<CloseIcon />}
          onClick={onClose}
        >
          收起详细需求
        </Button>
      </DialogActions>
    </Dialog>
  );
}
