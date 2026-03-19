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
  const contacts = contactsProp ?? (contactName || contactContent ? parseContacts(contactName, contactContent) : []);
  const rawName = contactName ?? contactsProp?.map((c) => c.name).join(', ') ?? '';
  const rawContent = contactContent ?? contactsProp?.map((c) => c.content).join(', ') ?? '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>联系方式</DialogTitle>
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
            <ListItemText primary="地址" secondary={address} />
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
          {showRaw ? '收起' : '排版有误？'}
        </Button>
        <Collapse in={showRaw}>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="subtitle1">以下是未经排版的数据</Typography>
          <Typography variant="body2">联系人：{rawName}</Typography>
          <Typography variant="body2">电话：{rawContent}</Typography>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
