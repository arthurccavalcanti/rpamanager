import { Select, MenuItem, FormControl, Grid, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function PageSize({ pageSize, setPageSize }) {
    return(
       <Grid>
            <FormControl fullWidth size="small">
                <InputLabel>
                    <FormattedMessage id="pageSize.itemsPerPage" defaultMessage="Itens por página" />
                </InputLabel>
                <Select value={pageSize}
                        label={<FormattedMessage id="pageSize.itemsPerPage" defaultMessage="Itens por página" />}
                        onChange={(e) => setPageSize(e.target.value)}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                </Select>
            </FormControl>
        </Grid> 
    );
}