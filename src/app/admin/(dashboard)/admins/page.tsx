'use client';

import { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';

interface Admin {
  id: number;
  username: string;
  display_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

export default function AdminsPage() {
  const [rows, setRows] = useState<Admin[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState<number | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwValue, setPwValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/admins');
      const json = await res.json() as { data: Admin[]; currentAdminId?: number };
      setRows(json.data);
      if (json.currentAdminId != null) setCurrentAdminId(json.currentAdminId);
    } catch {
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!newUsername || !newPassword) return;
    setSaving(true);
    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, displayName: newDisplayName || newUsername }),
    });
    const json = await res.json() as { message: string };
    setSaving(false);
    if (res.ok) {
      setAddOpen(false);
      setNewUsername(''); setNewDisplayName(''); setNewPassword('');
      setMsg('新增成功');
      fetchData();
    } else {
      setMsg(json.message ?? '新增失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除此管理員？')) return;
    const res = await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' });
    const json = await res.json() as { message: string };
    if (res.ok) {
      setMsg('已刪除');
      fetchData();
    } else {
      setMsg(json.message ?? '刪除失敗');
    }
  };

  const handleChangePassword = async () => {
    if (!pwOpen || !pwValue) return;
    setSaving(true);
    const res = await fetch(`/api/admin/admins?id=${pwOpen}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwValue }),
    });
    const json = await res.json() as { message: string };
    setSaving(false);
    if (res.ok) {
      setPwOpen(null); setPwValue('');
      setMsg('密碼已更新');
    } else {
      setMsg(json.message ?? '更新失敗');
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">管理員帳號</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          新增管理員
        </Button>
      </Stack>

      {msg && <Alert severity="info" onClose={() => setMsg('')} sx={{ mb: 2 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? <CircularProgress /> : (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>帳號</TableCell>
                  <TableCell>顯示名稱</TableCell>
                  <TableCell>建立時間</TableCell>
                  <TableCell>最後登入</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.display_name}</TableCell>
                    <TableCell>{row.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>{row.last_login_at?.slice(0, 10) ?? '—'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {row.id === currentAdminId && (
                          <Tooltip title="修改密碼">
                            <IconButton size="small" onClick={() => { setPwOpen(row.id); setPwValue(''); }}>
                              <KeyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="刪除">
                          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* 新增管理員 Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新增管理員</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="帳號" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} sx={{ mt: 1, mb: 2 }} />
          <TextField fullWidth label="顯示名稱（選填）" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="密碼（至少 8 字元）" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving || !newUsername || newPassword.length < 8}>
            {saving ? <CircularProgress size={20} /> : '新增'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 修改密碼 Dialog */}
      <Dialog open={pwOpen !== null} onClose={() => setPwOpen(null)} maxWidth="xs" fullWidth>
        <DialogTitle>修改密碼</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="新密碼（至少 8 字元）" type="password" value={pwValue} onChange={(e) => setPwValue(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwOpen(null)}>取消</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={saving || pwValue.length < 8}>
            {saving ? <CircularProgress size={20} /> : '更新'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
