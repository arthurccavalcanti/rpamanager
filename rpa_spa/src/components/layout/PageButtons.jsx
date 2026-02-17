import { Typography, Button, Grid} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function PageButtons({ pageNumber, setPageNumber, pagination, pageSize }) {
    return (
        <Grid container justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
            <Grid>
                <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pagination.isFirst}>
                    <FormattedMessage id="pageButtons.previousPage" defaultMessage="Página anterior" />
                </Button>
                <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pagination.isLast}>
                    <FormattedMessage id="pageButtons.nextPage" defaultMessage="Próxima página" />
                </Button>
                <Typography variant="body2" component="span" sx={{ mx: 2 }}>
                    <FormattedMessage id="pageButtons.page"
                                     defaultMessage={"Página " + (pageNumber + 1) + " de " + (pagination.totalPages)}
                                     values={{pageNum: pageNumber, totalPages: pagination.totalPages}} />
                </Typography>
                <Typography variant="body2" component="span" sx={{ mx: 2 }}>
                    <FormattedMessage id="pageButtons.itemsFound"
                                     defaultMessage={pagination.totalElements + "itens encontrados. Visualizando de " + pageSize + " em " + pageSize + "."}
                                     values={{pageSize: pageSize, totalItems: pagination.totalElements}} />
                </Typography>

            </Grid>
        </Grid>
    );
}
