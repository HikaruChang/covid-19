'use client';

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RoleIndex from '@/components/RoleIndex';
import { useTranslations } from 'next-intl';

export default function VolunteerIndexPage() {
  const t = useTranslations();

  const routes = [
    {
      path: '/volunteer/supplies',
      title: t('nav.volunteerSupplies'),
      subtitle: t('nav.staffSuppliesDesc'),
      icon: <LocalHospitalIcon fontSize="inherit" />,
      icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <FindInPageIcon key="f" fontSize="inherit" />],
      color: '#a20002',
    },
    {
      path: '/volunteer/supplies/submit',
      title: t('nav.volunteerSubmission'),
      subtitle: t('nav.staffSubmissionDesc'),
      icon: <NoteAddIcon fontSize="inherit" />,
      icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <NoteAddIcon key="n" fontSize="inherit" />],
    },
  ];

  return <RoleIndex title={t('nav.volunteerIndex')} routes={routes} />;
}
