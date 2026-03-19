'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable';
import ReportDialog from '@/components/ReportDialog';
import ContactDialog from '@/components/ContactDialog';
import SupplyDetailDialog from '@/components/SupplyDetailDialog';
import api from '@/lib/api';

export default function CommunitySuppliesPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ address: '', contacts: [] as any[] });
  const [supplyOpen, setSupplyOpen] = useState(false);
  const [supplyContent, setSupplyContent] = useState<any>(null);

  useEffect(() => {
    api.communitySupplies().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <Box>
      <Snackbar
        open={snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">感谢支持，已提交纠错信息</Alert>
      </Snackbar>

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        content={reportContent}
        onSuccess={() => setSnackbar(true)}
      />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        address={contactInfo.address}
        contacts={contactInfo.contacts}
      />

      <SupplyDetailDialog
        open={supplyOpen}
        onClose={() => setSupplyOpen(false)}
        content={supplyContent}
        type="community"
      />

      <Typography variant="h5" fontWeight={700} gutterBottom>
        社区物资需求列表
      </Typography>

      <Card sx={{ mb: 2 }} elevation={0}>
        <CardContent sx={{ bgcolor: '#ff9800', color: '#fff', fontWeight: 700 }}>
          本列表中信息均为各用户自行上传，请自行验证真伪。
        </CardContent>
      </Card>

      {loading ? (
        <Box>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
          ))}
        </Box>
      ) : (
        <DataTable items={data}>
          {({ items }) => (
            <Grid container spacing={2}>
              {items.map((o: any, i: number) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={i}>
                  <Card sx={{ border: '2px solid #a20002' }}>
                    <CardContent sx={{ bgcolor: '#f5f5f5', pb: 1 }}>
                      <Typography variant="h6">
                        <Typography component="span" variant="body2" sx={{ mr: 1 }}>
                          #{o._index + 1}
                        </Typography>
                        {o.address}
                      </Typography>
                    </CardContent>
                    <CardContent sx={{ pt: 1, minHeight: 120 }}>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {o.province} {o.city}
                      </Typography>
                      <Typography variant="body2">地址：{o.address}</Typography>
                      {o.notes && (
                        <Typography variant="caption" color="warning.main">
                          备注：{o.notes}
                        </Typography>
                      )}
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        href={`https://ditu.amap.com/search?query=${encodeURIComponent(o.address || o.name)}`}
                        target="_blank"
                        startIcon={<MapIcon />}
                      >
                        查看地图
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ContactPhoneIcon />}
                        onClick={() => {
                          setContactInfo({
                            address: o.address,
                            contacts: [
                              {
                                name: o.name || '(姓名未知)',
                                content: `电话：${o.contact_phone || '(未知)'}`,
                                link: o.contact_phone ? { href: `tel://${o.contact_phone}` } : null,
                              },
                            ],
                          });
                          setContactOpen(true);
                        }}
                      >
                        联系方式
                      </Button>
                      <Button
                        size="small"
                        startIcon={<InfoIcon />}
                        onClick={() => {
                          setReportContent(JSON.stringify(o));
                          setReportOpen(true);
                        }}
                      >
                        纠错
                      </Button>
                    </CardActions>
                    <Divider />
                    <CardActions>
                      <Button
                        fullWidth
                        sx={{ color: '#a20002' }}
                        startIcon={<FullscreenIcon />}
                        onClick={() => {
                          setSupplyContent(o);
                          setSupplyOpen(true);
                        }}
                      >
                        展开详细需求
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DataTable>
      )}

      {/* FAB */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: '50%',
          minWidth: 56,
          width: 56,
          height: 56,
        }}
        onClick={() => router.push('/people/supplies/submit')}
      >
        <AddIcon />
      </Button>
    </Box>
  );
}
