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
import MapIcon from '@mui/icons-material/Map';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import api from '@/lib/api';

const reportCauses = [
  '地址不存在/未找到',
  '联系不上',
  '已被征用',
  '已住满',
  '其他原因无法接待',
  '缺少必需物资无法营业',
  '信息重复',
  '其他',
];

export default function PeopleAccommodationsPage() {
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
          <Typography variant="subtitle1" fontWeight={700}>状态：{item.status}</Typography>
        )}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {item.province} {item.city} {item.suburb}；地址：{item.address || '暂无。可点击下方【查看地图】前往查看地址'}
        </Typography>
        {item.tags && (
          <Typography variant="subtitle2">
            备注：{item.tags} {item.conditions || ''}
          </Typography>
        )}
        <Typography variant="subtitle2">
          联系电话：{item.phone || '暂无。可点击下方【查看地图】前往查看电话'}
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
          查看地图
        </Button>
        <Button
          size="small"
          startIcon={<ReportProblemIcon />}
          onClick={() => setReport({ open: true, content: JSON.stringify(item) })}
        >
          信息纠错
        </Button>
      </CardActions>
    </Card>
  ), []);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>武汉在外人员住宿</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>武汉在外人员住宿</Typography>

      <DataTable
        items={dataset}
        searchText="住宿名称、地址"
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
