'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

const locales = [
  { id: 'zh', name: '中文' },
  { id: 'en', name: 'English' },
];

export default function LocaleSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSelect = async (localeId: string) => {
    setAnchorEl(null);
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: localeId }),
    });
    location.reload();
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <ListSubheader sx={{ lineHeight: '36px' }}>
          <TranslateIcon sx={{ fontSize: 14, mr: 0.5, color: 'grey.400' }} />
          语言选择
        </ListSubheader>
        {locales.map((loc) => (
          <MenuItem key={loc.id} onClick={() => handleSelect(loc.id)}>
            <ListItemText>{loc.name}</ListItemText>
            <Typography variant="caption" sx={{ ml: 2, fontFamily: 'monospace' }}>
              {loc.id}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
