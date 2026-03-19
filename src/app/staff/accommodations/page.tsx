'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Icon,
  Skeleton,
  Typography,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StraightenIcon from '@mui/icons-material/Straighten';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import ContactDialog from '@/components/ContactDialog';
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

export default function StaffAccommodationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAvailable, setFilterAvailable] = useState(true);
  const [filterLinBao, setFilterLinBao] = useState(true);
  const [report, setReport] = useState<{ open: boolean; content: string }>({ open: false, content: '' });
  const [contact, setContact] = useState<{ open: boolean; address: string; contactName: string; contactContent: string }>({
    open: false,
    address: '',
    contactName: '',
    contactContent: '',
  });

  useEffect(() => {
    api.accommodations().then((d) => { setData(d); setLoading(false); });
  }, []);

  const dataset = useMemo(() => {
    let filtered = data.filter((el) => el.name?.length > 0).map((el) => ({
      ...el,
      notes: el.notes ? el.notes.toString() : '',
    }));
    if (filterAvailable) filtered = filtered.filter((el) => !/住满|不接待|征用/.test(el.notes));
    if (filterLinBao) filtered = filtered.filter((el) => !/([34三四])件套/.test(el.notes));
    return filtered;
  }, [data, filterAvailable, filterLinBao]);

  const renderItem = useCallback((item: any) => (
    <Card key={item.id ?? item.name} sx={{ borderTop: '4px solid #a20002', position: 'relative' }}>
      {/* Surplus info in top right */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, textAlign: 'right', fontSize: '0.75rem', color: 'text.secondary' }}>
        {item.beds && (
          <Box><Typography variant="h6" component="span" fontWeight={900} color="text.primary">{item.beds}</Typography> 剩余床位</Box>
        )}
        {item.room && (
          <Box><Typography variant="h6" component="span" fontWeight={900} color="text.primary">{item.room}</Typography> 剩余房间</Box>
        )}
        {item.distance != null && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            <StraightenIcon sx={{ fontSize: 14 }} />
            {item.distance.toFixed(1)}km
          </Box>
        )}
      </Box>

      <CardHeader
        title={<Typography variant="h6" fontWeight={900} sx={{ pr: 10 }}>{item.name}</Typography>}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Typography variant="subtitle2">
          {item.province} {item.city} {item.suburb}
          <br />地址：{item.address}
        </Typography>
        {item.notes && (
          <Typography variant="subtitle2" color="error" sx={{ mt: 0.5 }}>
            备注：{item.notes}
          </Typography>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Button
          size="small"
          href={`https://ditu.amap.com/search?query=${encodeURIComponent(item.name)}`}
          target="_blank"
          startIcon={<MapIcon />}
        >
          查看地图
        </Button>
        <Button
          size="small"
          startIcon={<ContactPhoneIcon />}
          onClick={() => setContact({
            open: true,
            address: item.address,
            contactName: item.contacts || '',
            contactContent: item.phone || '',
          })}
        >
          联系方式
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
        <Typography variant="h5" fontWeight={700} gutterBottom>医护人员免费住宿</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={180} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>医护人员免费住宿</Typography>
      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ bgcolor: '#a20002', color: '#fff', fontWeight: 700 }}>
          请注意：大多数住宿地点均要求各位携带相关证件（医护工作证 + 身份证）实名入住；请记得准备好上述证件后，致电相关住宿提供方确认空房情况哦～ 您辛苦啦～
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 1, mb: 1 }}>
        <FormControlLabel
          control={<Checkbox checked={filterAvailable} onChange={(_, v) => setFilterAvailable(v)} />}
          label="只看有房"
        />
        <FormControlLabel
          control={<Checkbox checked={filterLinBao} onChange={(_, v) => setFilterLinBao(v)} />}
          label="不需自带三件套"
        />
      </Box>

      <DataTable
        items={dataset}
        enableGeolocation
        renderItem={renderItem}
      />

      <ContactDialog
        open={contact.open}
        onClose={() => setContact((c) => ({ ...c, open: false }))}
        address={contact.address}
        contactName={contact.contactName}
        contactContent={contact.contactContent}
      />

      <ReportDialog
        open={report.open}
        onClose={() => setReport({ open: false, content: '' })}
        content={report.content}
        type="accommodations"
        causes={reportCauses}
      />
    </Box>
  );
}
