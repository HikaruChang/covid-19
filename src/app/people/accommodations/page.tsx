'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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
import MapIcon from '@mui/icons-material/Map';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import api from '@/lib/api';

export default function PeopleAccommodationsPage() {
  const t = useTranslations();
  const reportCauses = t.raw('accommodations.reportCauses') as string[];
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{ open: boolean; content: string }>({
    open: false,
    content: '',
  });

  useEffect(() => {
    api.peopleAccommodations().then((d) => { setData(d); setLoading(false); });
  }, []);

  const dataset = data.map((el) => {
    const tags = el.tags ? el.tags.replace(el.conditions || '', '').trim() : null;
    return { ...el, tags: tags && tags.length > 0 ? tags : null };
  });

  const renderItem = useCallback((item: any) => (
    <Card key={item.id ?? item.name} sx={{ borderTop: '4px solid #a20002' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={900}>
            {item.name || item.address}
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {item.status && (
          <Typography variant="subtitle1" fontWeight={700}>{t('accommodations.status')}：{item.status}</Typography>
        )}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {item.province} {item.city} {item.suburb}；{t('accommodations.address')}：{item.address || t('accommodations.noAddress')}
        </Typography>
        {item.tags && (
          <Typography variant="subtitle2">
            {t('accommodations.notes')}：{item.tags} {item.conditions || ''}
          </Typography>
        )}
        <Typography variant="subtitle2">
          {t('accommodations.phone')}：{item.phone || t('accommodations.noPhone')}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          href={`https://ditu.amap.com/search?query=${encodeURIComponent(item.name || item.address || '')}`}
          target="_blank"
          startIcon={<MapIcon />}
        >
          {t('accommodations.viewMap')}
        </Button>
        <Button
          size="small"
          startIcon={<ReportProblemIcon />}
          onClick={() => setReport({ open: true, content: JSON.stringify(item) })}
        >
          {t('accommodations.report')}
        </Button>
      </CardActions>
    </Card>
  ), []);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>{t('accommodations.peopleTitle')}</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('accommodations.peopleTitle')}</Typography>

      <DataTable
        items={dataset}
        searchText={t('accommodations.searchPlaceholder')}
        renderItem={renderItem}
      />

      <ReportDialog
        open={report.open}
        onClose={() => setReport({ open: false, content: '' })}
        content={report.content}
        type="peopleAccommodations"
        causes={reportCauses}
      />
    </Box>
  );
}
