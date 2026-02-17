import { Select, MenuItem, FormControl, Grid, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function OrderBy({ userSortBy, setUserSortBy, sortableFields }) {
    return (    
        <Grid>
            <FormControl fullWidth sx={{ minWidth: 150 }}>
                <InputLabel>
                    <FormattedMessage id="orderBy.orderBy" defaultMessage="Ordernar por" />
                </InputLabel>
                <Select value={userSortBy}
                        label={<FormattedMessage id="orderBy.orderBy" defaultMessage="Ordernar por" />}
                        onChange={(e) => setUserSortBy(e.target.value)}>
                    <MenuItem value="">
                        <em>
                        <FormattedMessage id="orderBy.pickAnOption" defaultMessage="-- Escolha uma opção --" />
                        </em>
                    </MenuItem>
                    {sortableFields.map(field => (
                        <MenuItem key={field.field} value={field.field}>{field.headerName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}