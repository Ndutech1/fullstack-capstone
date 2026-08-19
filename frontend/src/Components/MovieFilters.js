import {
  Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, Typography,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const movieGenres = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

const sortOptions = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Top rated' },
  { value: 'primary_release_date.desc', label: 'Newest releases' },
];

export default function MovieFilters({ filters, onChange, onClear }) {
  const updateFilter = (event) => onChange({ ...filters, [event.target.name]: event.target.value });
  const selectedGenre = movieGenres.find((genre) => String(genre.id) === String(filters.genre));
  const activeFilters = [
    selectedGenre && { key: 'genre', label: selectedGenre.name },
    filters.sortBy && { key: 'sortBy', label: sortOptions.find((option) => option.value === filters.sortBy)?.label },
    filters.year && { key: 'year', label: filters.year },
    filters.rating && { key: 'rating', label: `${filters.rating}+ rating` },
  ].filter(Boolean);

  return (
    <Box className="discover-filter-panel">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAltOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>Refine your feed</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">Pick a mood, year, rating, or sorting style.</Typography>
        </Box>
        {activeFilters.length > 0 && <Button onClick={onClear} startIcon={<RestartAltIcon />} size="small" sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>Clear all</Button>}
      </Stack>

      <Box className="discover-filter-grid">
        <FormControl fullWidth size="small"><InputLabel>Genre</InputLabel><Select name="genre" label="Genre" value={filters.genre} onChange={updateFilter}><MenuItem value="">Any genre</MenuItem>{movieGenres.map((genre) => <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>)}</Select></FormControl>
        <FormControl fullWidth size="small"><InputLabel>Sort by</InputLabel><Select name="sortBy" label="Sort by" value={filters.sortBy} onChange={updateFilter}><MenuItem value="">Recommended</MenuItem>{sortOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</Select></FormControl>
        <FormControl fullWidth size="small"><InputLabel>Release year</InputLabel><Select name="year" label="Release year" value={filters.year} onChange={updateFilter}><MenuItem value="">Any year</MenuItem>{Array.from({ length: 15 }, (_, index) => new Date().getFullYear() - index).map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}</Select></FormControl>
        <FormControl fullWidth size="small"><InputLabel>Minimum rating</InputLabel><Select name="rating" label="Minimum rating" value={filters.rating} onChange={updateFilter}><MenuItem value="">Any rating</MenuItem>{Array.from({ length: 9 }, (_, index) => index + 1).map((rating) => <MenuItem key={rating} value={rating}>{rating}+ stars</MenuItem>)}</Select></FormControl>
      </Box>

      {activeFilters.length > 0 && <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.25 }}>{activeFilters.map((filter) => <Chip key={filter.key} label={filter.label} onDelete={() => onChange({ ...filters, [filter.key]: '' })} color="primary" variant="outlined" />)}</Stack>}
    </Box>
  );
}
