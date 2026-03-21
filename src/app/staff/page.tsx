'use client';

import HotelIcon from '@mui/icons-material/Hotel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RoleIndex from '@/components/RoleIndex';
import { useTranslations } from 'next-intl';

export default function StaffIndexPage() {
  const t = useTranslations();

  const routes = [
    {
      path: '/staff/accommodations',
      title: t('nav.staffAccommodations'),
      subtitle: t('nav.staffAccommodationsDesc'),
      icon: <HotelIcon fontSize="inherit" />,
    },
    {
      path: '/staff/platforms/psychological',
      title: t('nav.staffPsychological'),
      subtitle: t('nav.staffPsychologicalDesc'),
      icon: <FavoriteIcon fontSize="inherit" />,
    },
    {
      path: '/staff/supplies',
      title: t('nav.staffSupplies'),
      subtitle: t('nav.staffSuppliesDesc'),
      icon: <FindInPageIcon fontSize="inherit" />,
      icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <FindInPageIcon key="f" fontSize="inherit" />],
      color: '#a20002',
    },
    {
      path: '/staff/supplies/submit',
      title: t('nav.staffSubmission'),
      subtitle: t('nav.staffSubmissionDesc'),
      icon: <NoteAddIcon fontSize="inherit" />,
      icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <NoteAddIcon key="n" fontSize="inherit" />],
    },
  ];

  return <RoleIndex title={t('nav.staffIndex')} routes={routes} />;
}
