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
  Chip,
  TablePagination,
  Alert,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import GppBadIcon from '@mui/icons-material/GppBad';

interface CommunitySupply {
  id: number;
  name: string;
  city: string;
  contact_phone: string;
  verified: number;
  created_at: string;
}

interface ApiResponse {
  data: CommunitySupply[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminCommunitySuppliesPage() {
  const [rows, setRows] = useState<CommunitySupply[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/community-supplies?page=${p + 1}`);
      const json = await res.json() as ApiResponse;
      setRows(json.data);
      setTotal(json.total);
    } catch {
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const handleToggleVerify = async (row: CommunitySupply) => {
    await fetch(`/api/admin/community-supplies?id=${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: row.verified ? 0 : 1 }),
    });
    fetchData(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除？')) return;
    await fetch(`/api/admin/community-supplies?id=${id}`, { method: 'DELETE' });
    fetchData(page);
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        社區物資
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>聯絡人</TableCell>
                  <TableCell>城市</TableCell>
                  <TableCell>聯絡電話</TableCell>
                  <TableCell>核實</TableCell>
                  <TableCell>建立時間</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.contact_phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.verified ? '已核實' : '未核實'}
                        color={row.verified ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title={row.verified ? '取消核實' : '標記核實'}>
                          <IconButton size="small" onClick={() => handleToggleVerify(row)}>
                            {row.verified ? <GppBadIcon fontSize="small" /> : <VerifiedIcon fontSize="small" color="success" />}
                          </IconButton>
                        </Tooltip>
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
          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={20}
            rowsPerPageOptions={[20]}
            onPageChange={(_, p) => setPage(p)}
          />
        </Paper>
      )}
    </>
  );
}
