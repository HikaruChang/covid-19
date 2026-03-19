'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MonitorIcon from '@mui/icons-material/Monitor';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import api from '@/lib/api';

const reportCauses = ['联系不上', '信息错误', '已下线', '信息重复', '其他'];

function buildTags(el: any) {
  const tags: { icon: React.ReactNode; color: string; text: string }[] = [];
  if (el.onlineoffline?.includes('线上')) tags.push({ icon: <MonitorIcon fontSize="small" />, color: '#66bb6a', text: '线上' });
  if (el.onlineoffline?.includes('线下')) tags.push({ icon: <PersonIcon fontSize="small" />, color: '#66bb6a', text: '线下' });
  if (el.onlineoffline?.includes('电话')) tags.push({ icon: <PhoneIcon fontSize="small" />, color: '#4caf50', text: '电话' });
  if (el.onlineoffline?.includes('网上')) tags.push({ icon: <LanguageIcon fontSize="small" />, color: '#4caf50', text: '网上' });
  if (el.commercial?.includes('有偿')) tags.push({ icon: <AttachMoneyIcon fontSize="small" />, color: '#388e3c', text: '有偿' });
  if (el.commercial?.includes('无偿')) tags.push({ icon: <MoneyOffIcon fontSize="small" />, color: '#388e3c', text: '无偿' });
  return tags;
}

function regionalText(o: any) {
  if (o.regional?.includes('地方')) {
    const suffix = [o.province, o.city, o.suburb].filter(Boolean);
    return `（${suffix.join(' ')}）`;
  }
  return '';
}

export default function PsychologicalPlatformsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{ open: boolean; content: string }>({
    open: false,
    content: '',
  });

  useEffect(() => {
    api.psychologicalPlatform().then((d) => { setData(d); setLoading(false); });
  }, []);

  const renderItem = useCallback((item: any) => {
    const tags = buildTags(item);
    return (
      <Card key={item.id} sx={{ borderTop: '4px solid rgba(104, 172, 91, 0.7)' }}>
        <CardHeader
          title={<Typography variant="h6" fontWeight={900}>{item.organization}</Typography>}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ mb: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.text}
                icon={tag.icon as any}
                label={tag.text}
                size="small"
                sx={{ bgcolor: tag.color, color: '#fff', mr: 0.5, mb: 0.5, pl: 0.5 }}
              />
            ))}
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            开放时间：{item.opentime}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            服务群体：{item.group || '无指定服务群体，所有人均可咨询'}
          </Typography>
          <Typography variant="subtitle1">
            地方性：{item.regional}{regionalText(item)}
          </Typography>
          <Box
            sx={{
              bgcolor: '#2e7d32',
              color: '#fff',
              fontWeight: 700,
              p: 1.5,
              borderRadius: 1,
              my: 1,
            }}
          >
            咨询方式：{item.contact}
          </Box>
          {item.notes && (
            <Typography variant="caption">备注：{item.notes}</Typography>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button size="small" href={item.source} target="_blank" startIcon={<OpenInNewIcon />}>
            查看信息来源
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
    );
  }, []);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>线上心理咨询平台</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>线上心理咨询平台</Typography>
      <Card sx={{ mb: 2 }} elevation={0}>
        <CardContent sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
          你好呀～我们这里给你准备了一些可以帮助到你的专业人员们；如果你觉得需要心理援助的话，请一定要联系他们哦！加油！❤️
        </CardContent>
      </Card>

      <DataTable
        items={data}
        disableRegionSelector
        searchText="平台名称、地区或咨询方式"
        renderItem={renderItem}
      />

      <ReportDialog
        open={report.open}
        onClose={() => setReport({ open: false, content: '' })}
        content={report.content}
        type="psychologicalPlatform"
        causes={reportCauses}
      />
    </Box>
  );
}
