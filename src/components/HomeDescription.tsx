'use client';

import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function HomeDescription() {
  const t = useTranslations('description');
  const features = t.raw('features') as string[];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('whoAreWe')}
      </Typography>
      <Typography variant="subtitle1" sx={{ lineHeight: 1.8, mb: 3 }}>
        {t('whoAreWeContent')}
        <br />
        {t('whoAreWeHashtag')} |{' '}
        <a href="https://covid-19.icu">https://covid-19.icu</a>
      </Typography>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('targetTitle')}
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1.8, mb: 3 }}>
        <strong>{t('targetPeople')}</strong>
        {t('targetPeopleContent')}
        <br />
        <strong>{t('targetStaff')}</strong>
        {t('targetStaffContent')}
        <br />
        <strong>{t('targetVolunteer')}</strong>
        {t('targetVolunteerContent')}
      </Typography>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('featuresTitle')}
      </Typography>
      <Box component="ul" sx={{ lineHeight: 1.8, mb: 3, fontSize: '1.05rem' }}>
        {features.map((f, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: f }} />
        ))}
      </Box>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('shareTitle')}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: t('shareContent') }}
      />
    </Box>
  );
}
