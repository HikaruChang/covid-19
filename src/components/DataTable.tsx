'use client';

import { useState, useMemo, useCallback, useRef, ReactNode } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Alert,
  Grid,
  InputAdornment,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlaceSelector from './PlaceSelector';
import Paginator from './Paginator';
import { locate, distance } from '@/lib/geo';
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 24;

interface DataItem {
  province?: string;
  city?: string;
  suburb?: string;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: any;
}

interface DataTableProps {
  items: DataItem[];
  enableGeolocation?: boolean;
  disableRegionSelector?: boolean;
  searchText?: string;
  children?: (props: { items: DataItem[] }) => ReactNode;
  renderItem?: (item: DataItem, index: number) => ReactNode;
  gridLayout?: boolean;
}

function cleanProvince(p: string): string {
  p = p.replace(/\s+/g, '');
  if (!/(省|市|自治区|特别行政区)/.test(p)) {
    if (/(北京|天津|上海|重庆)/.test(p)) return `${p}市`;
    if (/(澳门|香港)/.test(p)) return `${p}特别行政区`;
    return `${p}省`;
  }
  return p;
}

function cleanCity(c: string): string {
  c = c.replace(/\s+/g, '');
  if (!/(区|市|级)/.test(c)) return `${c}市`;
  return c;
}

export default function DataTable({
  items,
  enableGeolocation = false,
  disableRegionSelector = false,
  searchText,
  children,
  renderItem,
  gridLayout = false,
}: DataTableProps) {
  const t = useTranslations('dataTable');
  const effectiveSearchText = searchText ?? t('searchPlaceholder');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string[]>([]);
  const [geo, setGeo] = useState<{
    lat: number | null;
    lng: number | null;
    determining: boolean;
    failed: boolean;
  }>({ lat: null, lng: null, determining: false, failed: false });

  const contentRef = useRef<HTMLDivElement>(null);
  const hasLocation = geo.lat !== null && geo.lng !== null && !geo.failed;

  // clean data
  const cleanedData = useMemo(() => {
    return items.map((el) => {
      const item = { ...el };
      if (item.province) item.province = cleanProvince(item.province);
      if (item.city) item.city = cleanCity(item.city);
      if (item.suburb) item.suburb = item.suburb.replace(/\s+/g, '');
      return item;
    });
  }, [items]);

  // build region list from data
  const regionList = useMemo(() => {
    const list: Record<string, Record<string, string[]>> = {};
    for (const item of cleanedData) {
      if (!item.province || !item.city) continue;
      if (!list[item.province]) list[item.province] = {};
      if (!list[item.province][item.city]) list[item.province][item.city] = [];
      if (item.suburb && !list[item.province][item.city].includes(item.suburb)) {
        list[item.province][item.city].push(item.suburb);
      }
    }
    return list;
  }, [cleanedData]);

  // filtered + sorted data
  const data = useMemo(() => {
    let filtered = cleanedData;

    // region filter
    if (region[0]) filtered = filtered.filter((el) => el.province === region[0]);
    if (region[1]) filtered = filtered.filter((el) => el.city === region[1]);
    if (region[2]) filtered = filtered.filter((el) => el.suburb === region[2]);

    // search filter
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((el) =>
        Object.values(el).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q),
        ),
      );
    }

    // geo filter + distance
    if (hasLocation) {
      filtered = filtered
        .filter((el) => el.latitude && el.longitude)
        .map((el) => ({
          ...el,
          distance: distance(
            el.latitude!,
            el.longitude!,
            geo.lat!,
            geo.lng!,
          ),
        }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }

    return filtered.map((el, i) => ({ ...el, _index: i }));
  }, [cleanedData, region, search, hasLocation, geo.lat, geo.lng]);

  const pageCount = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const pagedItems = data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const doGeolocate = useCallback(async () => {
    setGeo((g) => ({ ...g, determining: true, failed: false }));
    try {
      const pos = await locate();
      setGeo({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        determining: false,
        failed: false,
      });
    } catch {
      setGeo((g) => ({ ...g, determining: false, failed: true }));
    }
  }, []);

  const handlePageChange = (newPage: number, scroll?: boolean) => {
    setPage(newPage);
    if (scroll && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box ref={contentRef}>
      {!disableRegionSelector && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
            {t('filterByRegion')}
          </Typography>
          <PlaceSelector
            value={region}
            onChange={(v) => {
              setRegion(v);
              setPage(1);
            }}
            dataset={regionList}
          />
        </Box>
      )}

      {hasLocation && (
        <Alert severity="success" sx={{ mb: 1 }}>
          {t('geoSorted')}{' '}
          <Button
            size="small"
            variant="outlined"
            onClick={() => setGeo({ lat: null, lng: null, determining: false, failed: false })}
          >
            {t('close')}
          </Button>
        </Alert>
      )}
      {geo.failed && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {t('geoFailed')}{' '}
          <Button
            size="small"
            variant="outlined"
            onClick={doGeolocate}
            disabled={geo.determining}
          >
            {t('retry')}
          </Button>
        </Alert>
      )}

      <TextField
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder={effectiveSearchText}
        label={t('search')}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: enableGeolocation ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={doGeolocate}
                disabled={geo.determining}
                color={geo.failed ? 'error' : hasLocation ? 'success' : 'default'}
              >
                {geo.determining ? (
                  <CircularProgress size={20} />
                ) : (
                  <MyLocationIcon />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />

      <Paginator
        page={page}
        pageCount={pageCount}
        itemsLength={data.length}
        onChange={handlePageChange}
      />

      {data.length === 0 && !search && (
        <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
          {t('noData')}
        </Alert>
      )}
      {data.length === 0 && search && (
        <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
          {t('noResults', { query: search })}
        </Alert>
      )}

      {renderItem ? (
        gridLayout ? (
          <Grid container spacing={2}>
            {pagedItems.map((item, i) => renderItem(item, (page - 1) * ITEMS_PER_PAGE + i))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pagedItems.map((item, i) => renderItem(item, (page - 1) * ITEMS_PER_PAGE + i))}
          </Box>
        )
      ) : children ? (
        children({ items: pagedItems })
      ) : null}

      <Paginator
        page={page}
        pageCount={pageCount}
        itemsLength={data.length}
        large
        scroll
        onChange={handlePageChange}
      />
    </Box>
  );
}
