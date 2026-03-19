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
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import ContactDialog from '@/components/ContactDialog';
import SupplyDetailDialog from '@/components/SupplyDetailDialog';
import api from '@/lib/api';

const reportCauses = [
  '地址不存在/未找到',
  '联系不上医院方',
  '物资被拒收或拦截',
  '物资已够用',
  '信息重复',
  '其他',
];

function processData(raw: any[]): any[] {
  return raw
    .map((el) => {
      const tags: { c: string; t: string }[] = [];
      const meta: { trueness: number; urge: number } = { trueness: 1, urge: 3 };

      // trueness tags
      if (el.trueness && !el.trueness.includes('未') && !el.trueness.includes('需确认')) {
        if (el.trueness === '已核实' || el.trueness === '核实') {
          tags.push({ c: '#4caf50', t: '已核实' });
        } else {
          tags.push({ c: '#4caf50', t: `已核实：${el.trueness}` });
        }
        meta.trueness = 0;
      } else if (el.trueness) {
        tags.push({ c: '#9e9e9e', t: el.trueness });
      } else {
        tags.push({ c: '#9e9e9e', t: '暂未与官方核实' });
      }

      // urge tags
      const urge = el.urge || '';
      if (urge === '裸奔') {
        tags.push({ c: '#c62828', t: '非常紧急：库存为零' });
        meta.urge = 0;
      } else if (urge === '紧缺') {
        tags.push({ c: '#f44336', t: '紧缺' });
        meta.urge = 1;
      } else if (urge) {
        tags.push({ c: '#ff5722', t: urge });
        meta.urge = 2;
      }

      // supplies count
      const supplies = el.items || [];
      let suppliesCount = 0;
      let suppliesCountBias = false;
      for (const s of supplies) {
        if (typeof s.a === 'number') {
          suppliesCount += s.a;
        } else {
          suppliesCountBias = true;
        }
      }

      return { ...el, tags, meta, suppliesCount, suppliesCountBias };
    })
    .sort((a, b) => a.meta.urge - b.meta.urge);
}

export default function HospitalSuppliesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{ open: boolean; content: string }>({ open: false, content: '' });
  const [contact, setContact] = useState<{ open: boolean; address: string; contactName: string; contactContent: string }>({
    open: false, address: '', contactName: '', contactContent: '',
  });
  const [detail, setDetail] = useState<{ open: boolean; item: any }>({ open: false, item: null });

  useEffect(() => {
    api.supplies().then((d) => { setData(processData(d)); setLoading(false); });
  }, []);

  const urgeBgColor = (urge: number) => {
    if (urge === 0) return '#a93c33';
    if (urge === 1) return '#ff5722';
    return '#f5f5f5';
  };

  const renderItem = useCallback((item: any, index: number) => {
    const supplies = item.items || [];
    const breatheAnim = item.meta.urge === 0
      ? 'red-breathe 5s ease-in-out alternate infinite'
      : item.meta.urge === 1
        ? 'warning-breathe 5s ease-in-out alternate infinite'
        : undefined;
    return (
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={item.id ?? item.name ?? index}>
        <Card sx={{ borderTop: item.meta.urge >= 2 ? undefined : '4px solid #a20002', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            sx={{
              bgcolor: urgeBgColor(item.meta.urge),
              color: item.meta.urge <= 1 ? '#fff' : undefined,
              mb: 1,
              animation: breatheAnim,
              animationDelay: breatheAnim ? `-${index * 0.75}s` : undefined,
            }}
            title={
              <Typography variant="h6" fontWeight={900}>
                <Typography component="span" variant="body2">#{index + 1}</Typography>{' '}
                {item.urge === '裸奔' ? '[库存为零] ' : ''}{item.name}
              </Typography>
            }
          />
          {/* Surplus info + background icon */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: -48, right: 8, textAlign: 'right', fontSize: '0.75rem', color: item.meta.urge <= 1 ? '#ffffff99' : 'text.secondary' }}>
              {supplies.length > 0 && <Box><strong>{supplies.length}种</strong> 种类</Box>}
              {item.suppliesCount > 0 && <Box><strong>{item.suppliesCount}{item.suppliesCountBias ? '+' : ''}</strong> 数量</Box>}
            </Box>
            <LocalHospitalIcon sx={{ position: 'absolute', top: -40, right: 4, fontSize: 80, opacity: 0.06, color: '#333' }} />
          </Box>

          <CardContent sx={{ pt: 0, flex: 1 }}>
            {item.tags.length > 0 && (
              <Box sx={{ mb: 1 }}>
                {item.tags.map((tag: any) => (
                  <Chip key={tag.t} label={tag.t} size="small" sx={{ bgcolor: tag.c, color: '#fff', mr: 0.5, mb: 0.5, fontWeight: 700 }} />
                ))}
              </Box>
            )}
            <Typography variant="subtitle1">{item.province} {item.city}</Typography>
            <Typography variant="subtitle2">
              地址：{item.address || '（暂无详细地址，可点击下方搜索）'}
            </Typography>
            {item.alert && <Typography variant="caption" color="error">特别备注：{item.alert}</Typography>}
            {item.notes && <Typography variant="caption" sx={{ color: '#ff5722', display: 'block' }}>备注：{item.notes}</Typography>}
          </CardContent>

          <Divider />
          <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Button size="small" href={`https://ditu.amap.com/search?query=${encodeURIComponent(item.name)}`} target="_blank" startIcon={<MapIcon />}>
              {item.address ? '查看' : '搜索'}地图
            </Button>
            <Button size="small" startIcon={<ContactPhoneIcon />} onClick={() => setContact({
              open: true,
              address: item.address || '暂无详细地址，可点击搜索',
              contactName: item.contact || '',
              contactContent: item.phone || '',
            })}>
              联系方式
            </Button>
            <Button size="small" startIcon={<ReportProblemIcon />} onClick={() => setReport({ open: true, content: JSON.stringify(item) })}>
              信息纠错
            </Button>
          </CardActions>
          <Divider />
          <CardActions>
            <Button
              fullWidth
              size="large"
              sx={{ color: '#a20002' }}
              startIcon={<FullscreenIcon />}
              disabled={!supplies.length}
              onClick={() => setDetail({ open: true, item })}
            >
              展开详细需求{supplies.length ? '' : ' (无需求数据)'}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }, []);

  if (loading && !data.length) {
    return (
      <Box sx={{ mx: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>医疗机构物资需求</Typography>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 1 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>医疗机构物资需求</Typography>

      <Card elevation={0} sx={{ mb: 1 }}>
        <CardContent sx={{ bgcolor: '#f44336', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
          本列表中的所有医院均存在
          <Typography component="span" variant="h6" fontWeight={900}> 非常紧急 </Typography>
          的物资缺口状况，急需社会各界紧急援助！若您身边有相关资源（包括物流资源、消耗品资源等）请速与这些医院进行联系！
        </CardContent>
      </Card>
      <Card elevation={0} sx={{ mb: 1 }}>
        <CardContent sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
          为保证需求真实性，本列表中大部分数据均通过【真人电话/微信视频/带相片工作证照片/医院官方电话】的方式核验联系人信息；同时已通过标签方式标明需求核验状况，便于各位捐赠者查验
        </CardContent>
      </Card>
      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ bgcolor: '#9e9e9e', color: '#fff', fontSize: '0.75rem' }}>
          若您发现信息有不完整、已过期等情况，请点击相应数据卡片右下角的
          <ReportProblemIcon sx={{ fontSize: 14, verticalAlign: 'middle', mx: 0.3, color: '#eee' }} />
          纠错按钮发起纠错请求，我们将再次与医院进行二次审核，以保证消息时效性。
        </CardContent>
      </Card>

      <DataTable
        items={data}
        renderItem={renderItem}
        gridLayout
      />

      <Box sx={{ textAlign: 'right', mt: 4, color: '#9e9e9e', fontSize: '0.7rem' }}>
        此页面数据合作方<br />
        <a href="https://mp.weixin.qq.com/s/U_IAuov_AR13S87cJYjlSg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          WeStar 公益团队
        </a>
      </Box>

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
        type="supplies"
        causes={reportCauses}
      />

      <SupplyDetailDialog
        open={detail.open}
        onClose={() => setDetail({ open: false, item: null })}
        item={detail.item}
        type="hospital"
      />
    </Box>
  );
}
