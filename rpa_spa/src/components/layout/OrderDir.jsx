import { Select, MenuItem, FormControl, Grid, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function OrderDir({ userSortOrder, setUserSortOrder }) {
    return(
    <Grid>
        <FormControl fullWidth size="small">
            <InputLabel>
                <FormattedMessage id="orderDir.order" defaultMessage="Ordem" />
            </InputLabel>
            <Select value={userSortOrder}
                    label={<FormattedMessage id="orderDir.order" defaultMessage="Ordem" />}
                    onChange={(e) => setUserSortOrder(e.target.value)}>
                <MenuItem value="asc">
                    <FormattedMessage id="orderDir.asc" defaultMessage="Ascendente" />
                </MenuItem>
                <MenuItem value="desc">
                    <FormattedMessage id="orderDir.desc" defaultMessage="Descendente" />
                </MenuItem>
            </Select>
        </FormControl>
    </Grid>
    );
}

   