'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import HomeDescription from './HomeDescription';

interface RoleRoute {
  path: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  icons?: React.ReactNode[];
  color?: string;
}

interface RoleIndexProps {
  title: string;
  routes: RoleRoute[];
}

export default function RoleIndex({ title, routes }: RoleIndexProps) {
  const router = useRouter();

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          variant="h4"
          sx={{ color: '#a20002', fontWeight: 900, letterSpacing: 2, mb: 2 }}
        >
          covid-19.icu
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 2 }}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={route.path}>
            <Card>
              <CardActionArea onClick={() => router.push(route.path)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    height: 96,
                    color: route.color || 'text.primary',
                  }}
                >
                  {route.icons
                    ? route.icons.map((ic, i) => (
                      <Box key={i} sx={{ fontSize: 36, mx: 0.5 }}>
                        {ic}
                      </Box>
                    ))
                    : <Box sx={{ fontSize: 48 }}>{route.icon}</Box>}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {route.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {route.subtitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="caption"
        sx={{ display: 'block', textAlign: 'center', mt: 2 }}
      >
        下拉了解项目详情
      </Typography>

      <Divider sx={{ my: 3 }} />

      <HomeDescription />
    </Box>
  );
}
