import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import PageButtons from './PageButtons';
import CollapsibleCell from './CollapsibleCell';
import { Box, Typography, Paper,Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, IconButton, CircularProgress } from '@mui/material';
         import { FormattedMessage } from 'react-intl';

export default function DataTable ( { data, loading, pageNumber,
                                      pageSize, setPageNumber, pagination,
                                      columns, deletable, onDelete, onEdit } ) {

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }

    if (!data.length) {
        return <Typography sx={{ textAlign: 'center', my: 4 }}>
                    <FormattedMessage id="dataTable.noDataFound" defaultMessage="Nenhum dado encontrado." />
                </Typography>;
    }

    return (
        <Paper sx={{ mt: 2 }}>

           <PageButtons pageNumber={pageNumber} setPageNumber={setPageNumber}
                        pagination={pagination} pageSize={pageSize} />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.field} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    {col.headerName}
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} hover>
                                {columns.map((col) =>
                                    col.collapsible ? (<CollapsibleCell key={col.field}
                                                           content={row[col.field]} />)
                                                    : (<TableCell sx={{ whiteSpace: 'nowrap' }} key={col.field}>
                                                            {row[col.field] == null ? "" : row[col.field]}
                                                       </TableCell>)
                                )}
                                <TableCell align="right">          
                                    <IconButton color="primary" onClick={() => onEdit(row)}>     
                                        <EditIcon />
                                    </IconButton>

                                    {deletable && 
                                        <IconButton color="error" onClick={() => onDelete(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};