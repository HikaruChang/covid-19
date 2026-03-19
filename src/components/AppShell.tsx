'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Collapse,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import FaceIcon from '@mui/icons-material/Face';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SearchIcon from '@mui/icons-material/Search';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HotelIcon from '@mui/icons-material/Hotel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppContext } from './Providers';
import LocaleSwitcher from './LocaleSwitcher';

const DRAWER_WIDTH = 254;

interface NavChild {
  path: string;
  label: string;
  icon: React.ReactNode;
  hide?: boolean;
}

interface NavSection {
  key: string;
  label: string;
  icon: React.ReactNode;
  basePath: string;
  children: NavChild[];
}

const sections: NavSection[] = [
  {
    key: 'people',
    label: '普通市民',
    icon: <FaceIcon />,
    basePath: '/people',
    children: [
      { path: '/people', label: '市民信息主页', icon: <HomeIcon /> },
      { path: '/people/supplies', label: '社区物资需求列表', icon: <SearchIcon /> },
      { path: '/people/supplies/submit', label: '提交社区物资需求', icon: <NoteAddIcon /> },
      { path: '/people/platforms/medical', label: '线上医疗诊断平台', icon: <LocalHospitalIcon /> },
      { path: '/people/platforms/psychological', label: '线上心理咨询平台', icon: <FavoriteIcon /> },
      { path: '/people/accommodations', label: '武汉在外人员住宿', icon: <HotelIcon /> },
    ],
  },
  {
    key: 'staff',
    label: '医护人员',
    icon: <LocalHospitalIcon />,
    basePath: '/staff',
    children: [
      { path: '/staff', label: '医护人员信息主页', icon: <HomeIcon /> },
      { path: '/staff/accommodations', label: '医护人员免费住宿', icon: <HotelIcon /> },
      { path: '/staff/platforms/psychological', label: '线上心理咨询平台', icon: <FavoriteIcon /> },
      { path: '/staff/supplies', label: '医疗机构物资需求', icon: <SearchIcon /> },
      { path: '/staff/supplies/submit', label: '提交医疗物资需求', icon: <NoteAddIcon /> },
    ],
  },
  {
    key: 'volunteer',
    label: '志愿者',
    icon: <VolunteerActivismIcon />,
    basePath: '/volunteer',
    children: [
      { path: '/volunteer', label: '志愿者信息主页', icon: <HomeIcon /> },
      { path: '/volunteer/supplies', label: '医疗机构物资需求', icon: <SearchIcon /> },
      { path: '/volunteer/supplies/submit', label: '提交医疗物资需求', icon: <NoteAddIcon /> },
    ],
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { error, setError } = useAppContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isHome = pathname === '/';

  const currentTitle = useMemo(() => {
    for (const section of sections) {
      for (const child of section.children) {
        if (child.path === pathname) return child.label;
      }
    }
    if (pathname === '/verify') return 'wuhan.support 证书验证';
    return 'covid-19.icu';
  }, [pathname]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const drawerContent = (
    <Box sx={{ pt: '21px', width: DRAWER_WIDTH }}>
      <Box sx={{ mx: 'auto', textAlign: 'center', mb: 2, px: 2 }}>
        <Box
          component="img"
          src="/images/logo-red.svg"
          alt="covid-19.icu"
          sx={{ width: '100%', maxWidth: 180, display: 'block', mx: 'auto' }}
        />
      </Box>
      <List disablePadding>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemIcon>
            <ChevronLeftIcon />
          </ListItemIcon>
          <ListItemText
            primary="回到欢迎界面"
            primaryTypographyProps={{ fontWeight: 700 }}
          />
        </ListItemButton>

        {sections.map((section) => {
          const isActive = pathname.startsWith(section.basePath);
          const isOpen = openSections[section.key] ?? isActive;
          return (
            <Box key={section.key}>
              <ListItemButton onClick={() => toggleSection(section.key)}>
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.label} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.children
                    .filter((c) => !c.hide)
                    .map((child) => (
                      <ListItemButton
                        key={child.path}
                        sx={{
                          pl: 3,
                          height: 48,
                          borderLeft: '7px solid transparent',
                          ...(pathname === child.path && {
                            bgcolor: '#a20002',
                            borderLeftColor: '#910002',
                            color: '#fff',
                            '&:hover': { bgcolor: '#910002' },
                            '& .MuiListItemIcon-root': { color: '#fff' },
                          }),
                        }}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: pathname === child.path ? 700 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                </List>
              </Collapse>
            </Box>
          );
        })}

        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mx: 2 }}>
          <LocaleSwitcher />
        </Box>
      </List>
    </Box>
  );

  if (isHome) {
    return (
      <>
        {children}
        <ErrorSnackbar error={error} onClose={() => setError(null)} />
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: '#fff',
          color: '#333E48',
          boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 50 }}>
          <IconButton edge="start" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"PingFang SC", Roboto, sans-serif',
              fontWeight: 500,
              flexGrow: 1,
            }}
          >
            {currentTitle}
          </Typography>
          <Typography sx={{ color: '#a20002', fontWeight: 700, fontSize: 20 }}>
            ●
          </Typography>
        </Toolbar>
      </AppBar>

      {/* mobile drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: 50,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '50px',
          mb: 8,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {children}
      </Box>

      <ErrorSnackbar error={error} onClose={() => setError(null)} />
    </Box>
  );
}

function ErrorSnackbar({
  error,
  onClose,
}: {
  error: string | null;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={20000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="error"
        onClose={onClose}
        action={
          <Button color="inherit" size="small" onClick={() => location.reload()}>
            刷新
          </Button>
        }
      >
        数据加载失败
      </Alert>
    </Snackbar>
  );
}
