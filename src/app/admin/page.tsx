'use client';

import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface Stats {
  hospital_supplies: number;
  community_supplies: number;
  accommodations: number;
  reports: number;
  epidemic_subscriptions: number;
}

const statCards = (s: Stats) => [
  { label: '醫院物資', value: s.hospital_supplies, icon: <LocalHospitalIcon />, color: '#e53935' },
  { label: '社區物資', value: s.community_supplies, icon: <PeopleIcon />, color: '#43a047' },
  { label: '住宿資源', value: s.accommodations, icon: <HotelIcon />, color: '#1e88e5' },
  { label: '舉報紀錄', value: s.reports, icon: <ReportIcon />, color: '#fb8c00' },
  { label: '疫情訂閱', value: s.epidemic_subscriptions, icon: <NotificationsIcon />, color: '#8e24aa' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json() as Promise<Stats>)
      .then(setStats)
      .catch(() => setError('載入失敗'));
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!stats) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        儀表板
      </Typography>
      <Grid container spacing={3}>
        {statCards(stats).map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: card.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography color="text.secondary">{card.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
