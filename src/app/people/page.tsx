'use client';

import RoleIndex from '@/components/RoleIndex';
import SearchIcon from '@mui/icons-material/Search';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HotelIcon from '@mui/icons-material/Hotel';
import { useTranslations } from 'next-intl';

export default function PeoplePage() {
  const t = useTranslations();

  const routes = [
    {
      path: '/people/supplies',
      title: t('nav.communitySupplies'),
      subtitle: t('community.subtitle'),
      icon: <SearchIcon sx={{ fontSize: 'inherit' }} />,
    },
    {
      path: '/people/supplies/submit',
      title: t('nav.communitySubmission'),
      subtitle: t('nav.communitySubmissionDesc'),
      icon: <NoteAddIcon sx={{ fontSize: 'inherit' }} />,
    },
    {
      path: '/people/platforms/medical',
      title: t('nav.medicalPlatform'),
      subtitle: t('platforms.medical.subtitle'),
      icon: <LocalHospitalIcon sx={{ fontSize: 'inherit' }} />,
    },
    {
      path: '/people/platforms/psychological',
      title: t('nav.psychologicalPlatform'),
      subtitle: t('platforms.psychological.subtitle'),
      icon: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
    },
    {
      path: '/people/accommodations',
      title: t('nav.peopleAccommodations'),
      subtitle: t('nav.peopleAccommodationsDesc'),
      icon: <HotelIcon sx={{ fontSize: 'inherit' }} />,
    },
  ];

  return <RoleIndex title={t('nav.peopleIndex')} routes={routes} />;
}
