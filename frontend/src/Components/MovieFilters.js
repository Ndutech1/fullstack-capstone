import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  // Add more genres as needed
];

export default function MovieFilters({ filters, onChange }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ width: '100%' }}>
        Filter Movies
      </Typography>

      {/* Genre Filter */}
      <FormControl sx={{ minWidth: 150, flex: 1 }}>
        <InputLabel>Genre</InputLabel>
        <Select name="genre" value={filters.genre} onChange={handleChange}>
          <MenuItem value="">All</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sort By Filter */}
      <FormControl sx={{ minWidth: 150, flex: 1 }}>
        <InputLabel>Sort By</InputLabel>
        <Select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="popularity.desc">Popularity</MenuItem>
          <MenuItem value="vote_average.desc">Rating</MenuItem>
          <MenuItem value="primary_release_date.desc">Release Date</MenuItem>
        </Select>
      </FormControl>

      {/* Year Filter */}
      <FormControl sx={{ minWidth: 120, flex: 1 }}>
        <InputLabel>Year</InputLabel>
        <Select name="year" value={filters.year} onChange={handleChange}>
          <MenuItem value="">All</MenuItem>
          {[...Array(15)].map((_, i) => {
            const year = 2025 - i;
            return (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* Min Rating Filter */}
      <FormControl sx={{ minWidth: 120, flex: 1 }}>
        <InputLabel>Min Rating</InputLabel>
        <Select name="rating" value={filters.rating} onChange={handleChange}>
          <MenuItem value="">All</MenuItem>
          {[...Array(9)].map((_, i) => (
            <MenuItem key={i} value={i + 1}>
              {i + 1}+
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
