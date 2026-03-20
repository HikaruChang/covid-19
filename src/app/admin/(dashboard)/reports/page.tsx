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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Report {
  id: number;
  type: string;
  cause: string;
  content: string;
  created_at: string;
}

interface ApiResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminReportsPage() {
  const [rows, setRows] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/reports?page=${p + 1}`);
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

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除？')) return;
    await fetch(`/api/admin/reports?id=${id}`, { method: 'DELETE' });
    fetchData(page);
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        舉報紀錄
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
                  <TableCell>類型</TableCell>
                  <TableCell>原因</TableCell>
                  <TableCell>內容</TableCell>
                  <TableCell>時間</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Chip label={row.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{row.cause}</TableCell>
                    <TableCell
                      sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {row.content}
                    </TableCell>
                    <TableCell>{row.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Tooltip title="刪除">
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
