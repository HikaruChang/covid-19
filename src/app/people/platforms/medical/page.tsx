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
import { useTranslations } from 'next-intl';

function redirection(item: any, t: any) {
  if (item.address?.startsWith('http')) return { label: t('platforms.medical.linkType.link'), l: item.address };
  if (item.address?.includes('微信')) return { label: t('platforms.medical.linkType.wechat'), l: 'weixin://' };
  if (item.address?.includes('京东')) return { label: t('platforms.medical.linkType.jd'), l: 'openapp.jdmobile://' };
  if (item.address?.includes('支付宝')) return { label: t('platforms.medical.linkType.alipay'), l: 'alipay://' };
  return null;
}

export default function MedicalPlatformsPage() {
  const t = useTranslations();
  const reportCauses = t.raw('platforms.medical.reportCauses') as string[];
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
    const link = redirection(item, t);
    return (
      <Card key={item.id} sx={{ borderTop: '4px solid #a20002' }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={900}>
              {item.platformname}{' '}
              <Typography component="span" variant="caption" fontWeight={700}>
                {t('platforms.medical.diagnosisPlatform')}
              </Typography>
            </Typography>
          }
        />
        {!item.address?.startsWith('http') && (
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2">{t('platforms.medical.howToUse')}{item.address}</Typography>
          </CardContent>
        )}
        <Divider />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          {link && (
            <Button size="small" href={link.l} target="_blank" startIcon={<OpenInNewIcon />}>
              {t('platforms.medical.open')}{link.label}
            </Button>
          )}
          <Button
            size="small"
            startIcon={<ReportProblemIcon />}
            onClick={() => setReport({ open: true, content: JSON.stringify(item) })}
          >
            {t('accommodations.report')}
          </Button>
        </CardActions>
      </Card>
    );
  }, [t]);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>{t('platforms.medical.title')}</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={140} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('platforms.medical.title')}</Typography>

      <DataTable
        items={data}
        disableRegionSelector
        searchText={t('platforms.medical.searchPlaceholder')}
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
