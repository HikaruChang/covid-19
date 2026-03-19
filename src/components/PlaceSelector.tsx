'use client';

import { useMemo } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface PlaceSelectorProps {
  value: string[]; // [province, city, area]
  onChange: (val: string[]) => void;
  dataset: Record<string, Record<string, string[]>>;
}

export default function PlaceSelector({
  value,
  onChange,
  dataset,
}: PlaceSelectorProps) {
  const province = value[0] || '';
  const city = value[1] || '';
  const area = value[2] || '';

  const provinces = useMemo(() => Object.keys(dataset || {}), [dataset]);
  const cities = useMemo(
    () => (province ? Object.keys(dataset[province] || {}) : []),
    [dataset, province],
  );
  const areas = useMemo(
    () =>
      province && city ? dataset[province]?.[city] || [] : [],
    [dataset, province, city],
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} sm={4} md={3} lg={2}>
        <FormControl fullWidth size="small">
          <InputLabel>省</InputLabel>
          <Select
            value={province}
            label="省"
            onChange={(e) => onChange([e.target.value, '', ''])}
          >
            <MenuItem value="">全部</MenuItem>
            {provinces.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} sm={4} md={3} lg={2}>
        <FormControl fullWidth size="small">
          <InputLabel>市</InputLabel>
          <Select
            value={city}
            label="市"
            onChange={(e) => onChange([province, e.target.value, ''])}
          >
            <MenuItem value="">全部</MenuItem>
            {cities.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} sm={4} md={3} lg={2}>
        <FormControl fullWidth size="small">
          <InputLabel>区</InputLabel>
          <Select
            value={area}
            label="区"
            onChange={(e) => onChange([province, city, e.target.value])}
          >
            <MenuItem value="">全部</MenuItem>
            {areas.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
