'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Collapse,
  Divider,
  Typography,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PhoneIcon from '@mui/icons-material/Phone';
import { Contact, contacts as parseContacts } from '@/lib/strings';
import { useTranslations } from 'next-intl';

export interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  address: string;
  contacts?: Contact[];
  contactName?: string;
  contactContent?: string;
}

export default function ContactDialog({
  open,
  onClose,
  address,
  contacts: contactsProp,
  contactName,
  contactContent,
}: ContactDialogProps) {
  const [showRaw, setShowRaw] = useState(false);
  const t = useTranslations();
  const contacts = contactsProp ?? (contactName || contactContent ? parseContacts(contactName, contactContent) : []);
  const rawName = contactName ?? contactsProp?.map((c) => c.name).join(', ') ?? '';
  const rawContent = contactContent ?? contactsProp?.map((c) => c.content).join(', ') ?? '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('accommodations.contact')}</DialogTitle>
      <DialogContent>
        <List>
          <ListItemButton
            component="a"
            href={`https://ditu.amap.com/search?query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemAvatar>
              <Avatar>
                <MapIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t('accommodations.address')} secondary={address} />
          </ListItemButton>

          {contacts.map((c, i) => (
            <ListItemButton
              key={i}
              component={c.link ? 'a' : 'div'}
              {...(c.link || {})}
            >
              <ListItemAvatar>
                <Avatar>
                  <ContactPhoneIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={c.name} secondary={c.content} />
              {c.link && <PhoneIcon color="action" />}
            </ListItemButton>
          ))}
        </List>

        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowRaw((v) => !v)}
          sx={{ mt: 1 }}
        >
          {showRaw ? t('contact.collapse') : t('contact.formatError')}
        </Button>
        <Collapse in={showRaw}>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="subtitle1">{t('contact.rawDataTitle')}</Typography>
          <Typography variant="body2">{t('contact.contactPerson')}：{rawName}</Typography>
          <Typography variant="body2">{t('contact.phone')}：{rawContent}</Typography>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('partials.dialog.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
