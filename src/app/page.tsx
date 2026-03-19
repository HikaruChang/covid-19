'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import Footer from '@/components/Footer';

const roles = [
  {
    key: 'people',
    path: '/people',
    icon: <FaceIcon sx={{ fontSize: 72, color: '#fff' }} />,
    title: '我是普通市民',
    subtitle:
      '为普通市民准备的线上医疗诊断平台、线上心理咨询平台、信息看板与武汉在外人员住宿等信息',
    banner: '/images/people.jpg',
  },
  {
    key: 'staff',
    path: '/staff',
    icon: <LocalHospitalIcon sx={{ fontSize: 72, color: '#fff' }} />,
    title: '我是医护人员',
    subtitle:
      '为医护人员准备的免费住宿、心理咨询平台与医疗机构物资需求提交系统',
    banner: '/images/staff.jpg',
  },
  {
    key: 'volunteer',
    path: '/volunteer',
    icon: <VolunteerActivismIcon sx={{ fontSize: 72, color: '#fff' }} />,
    title: '我是志愿者',
    subtitle:
      '志愿者可实际使用的、经过多方验证后的医疗机构物资需求，以及可供各个志愿者使用的物资需求提交系统',
    banner: '/images/volunteers-v3.jpg',
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh' }}>
      {/* locale switcher fixed top right */}
      <Box
        sx={{ position: 'fixed', right: 16, top: 16, zIndex: 99999 }}
      >
        <LocaleSwitcher />
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 1 }}>
          <Box
            component="img"
            src="/images/logo-red.svg"
            alt="covid-19.icu"
            sx={{ maxWidth: 256, width: '100%', aspectRatio: '4.4' }}
          />
        </Box>

        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ textAlign: 'center', mb: 2 }}
        >
          驰援一线 · 传递温暖
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* PDF download card */}
        <Card sx={{ mb: 3 }}>
          <CardActionArea
            onClick={() =>
              window.open(
                '/files/Diagnosis-and-treatment-protocol-of-millitary-medical-team-version-2.pdf',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <CardMedia
              sx={{
                height: 192,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  'linear-gradient(to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)), url(/images/help.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <PictureAsPdfIcon sx={{ fontSize: 48, color: '#fff' }} />
              <DownloadIcon sx={{ fontSize: 24, color: '#fff', ml: 0.5 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Diagnosis and Treatment Protocol for Novel Coronavirus Disease
                from Military Medical Team Supporting Wuhan (Trial Version 2)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The documentation is translated by our team members to help all
                of the people around the world to fight with COVID-19. Please
                spread this document to the officials.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Role selection */}
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 2 }}>
          您是?
        </Typography>

        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} md={6} lg={4} key={role.key}>
              <Card>
                <CardActionArea onClick={() => router.push(role.path)}>
                  <CardMedia
                    sx={{
                      height: 192,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage:
                        `linear-gradient(to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)), url(${role.banner})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {role.icon}
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {role.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.subtitle}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
