'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import api from '@/lib/api';

function redirection(item: any) {
  if (item.address?.startsWith('http')) return { t: '链接', l: item.address };
  if (item.address?.includes('微信')) return { t: '微信', l: 'weixin://' };
  if (item.address?.includes('京东')) return { t: '京东APP', l: 'openapp.jdmobile://' };
  if (item.address?.includes('支付宝')) return { t: '支付宝APP', l: 'alipay://' };
  return null;
}

const reportCauses = ['联系不上', '链接失效', '信息重复', '其他'];

export default function MedicalPlatformsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{ open: boolean; content: string }>({
    open: false,
    content: '',
  });

  useEffect(() => {
    api.medicalPlatform().then((d) => { setData(d); setLoading(false); });
  }, []);

  const renderItem = useCallback((item: any) => {
    const link = redirection(item);
    return (
      <Card key={item.id} sx={{ borderTop: '4px solid #a20002' }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={900}>
              {item.platformname}{' '}
              <Typography component="span" variant="caption" fontWeight={700}>
                诊断平台
              </Typography>
            </Typography>
          }
        />
        {!item.address?.startsWith('http') && (
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2">使用方法：{item.address}</Typography>
          </CardContent>
        )}
        <Divider />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          {link && (
            <Button size="small" href={link.l} target="_blank" startIcon={<OpenInNewIcon />}>
              打开{link.t}
            </Button>
          )}
          <Button
            size="small"
            startIcon={<ReportProblemIcon />}
            onClick={() => setReport({ open: true, content: JSON.stringify(item) })}
          >
            信息纠错
          </Button>
        </CardActions>
      </Card>
    );
  }, []);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>线上医疗诊断平台</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={140} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>线上医疗诊断平台</Typography>

      <DataTable
        items={data}
        disableRegionSelector
        searchText="平台名称"
        renderItem={renderItem}
      />

      <ReportDialog
        open={report.open}
        onClose={() => setReport({ open: false, content: '' })}
        content={report.content}
        type="medicalPlatform"
        causes={reportCauses}
      />
    </Box>
  );
}
