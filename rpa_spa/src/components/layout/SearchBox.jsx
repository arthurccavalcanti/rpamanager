import { Search as SearchIcon} from '@mui/icons-material';
import { Box, IconButton, Grid, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
 
export default function SearchBox({ handleSearch, searchInput, setSearchInput }) {
    return (
        <Grid>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label={<FormattedMessage id="search" defaultMessage="Pesquisar" />}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <IconButton type="submit">
                    <SearchIcon />
                </IconButton>
            </Box>
        </Grid>
    );
}