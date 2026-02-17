import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper,  CircularProgress, Grid, Alert } from '@mui/material';
import { EditItemForm } from '../../components/common/EditItemForm';
import { DeleteItemDialog } from '../../components/common/DeleteItemDialog';
import { getConfigs } from '../../utils/Configs';
import SearchBox from '../../components/layout/SearchBox';
import OrderBy from '../../components/layout/OrderBy';
import OrderDir from '../../components/layout/OrderDir';
import PageSize from '../../components/layout/PageSize';
import DataTable from '../../components/layout/DataTable';
import { deleteUser, editUserAdmin, getUsers } from '../../api/adminApi';
import CadastroUser from '../../components/common/CreateUserForm';
import { FormattedMessage, useIntl } from 'react-intl';
import handleAxiosError from '../../utils/handleAxiosError';

export default function AdminUsers() {

    const intl = useIntl();
    const CONFIGS = getConfigs(intl);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [userSortBy, setUserSortBy] = useState("");
    const [userSortOrder, setUserSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const reqBody = {sortBy:userSortBy,
                         sortDir:userSortOrder,
                         page:pageNumber,
                         size:pageSize,
                         query:searchQuery};
        try {
            const response = await getUsers(reqBody);
            setData(response.data.content);
            setPagination({
                pageNumber: response.data.pageNumber,
                pageSize: response.data.pageSize,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                isFirst: response.data.first,
                isLast: response.data.last,
            });
        } catch (err) {
            setError(handleAxiosError(intl, err));
        } finally {
            setLoading(false);
        }
    }, [userSortBy, userSortOrder, pageNumber, pageSize, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchQuery(searchInput);
        setPageNumber(0);
    };

    const closeError = () => {  setError(null); };

    // DELETE
    const handleCloseDelete = () => { setDeletingItem(null); };
    const handleDeleteClick = (id) => { setDeletingItem(id); };
    const handleDeleteConfirm = async () => {
        try {
            await deleteUser(deletingItem);
            handleCloseDelete();
            fetchData();
        } catch (err) {
            setError(<FormattedMessage id="deleteError"
                                       defaultMessage={"Erro ao deletar: " + handleAxiosError(intl, err)}
                                       values={{error:handleAxiosError(intl, err)}} />);
            handleCloseDelete();
        }
    };

    // EDIT
    const handleEditClick = (row) => { setEditingItem(row); };
    const handleCloseDialog = () => {  setEditingItem(null); };
    const handleEditSubmit = async (requestBody, itemId) => {
        try {
            const parametros = {id: itemId}; 
            await editUserAdmin(requestBody, parametros);
            handleCloseDialog();
            fetchData();
        } catch (err) {
            setError(<FormattedMessage id="editError"
                                       defaultMessage={"Erro ao editar: " + handleAxiosError(intl, err)}
                                       values={{error:handleAxiosError(intl, err)}} />);
            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',           
                    padding: 2, marginBottom: 3, borderBottom: '1px solid', borderColor: 'divider'}}
            >
                <Typography variant="h4" gutterBottom>
                    <FormattedMessage id="adminPage.users" defaultMessage="Admin Usuários" />
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                    <CadastroUser onDone={fetchData}/>
                    <Button variant="contained" onClick={fetchData} disabled={loading}>
                        {loading ? <CircularProgress />
                                 : <FormattedMessage id="update" defaultMessage="Atualizar" />}
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3, mt: 3 }}>
                <Grid container spacing={2} alignItems="center">
                   <SearchBox handleSearch={handleSearch} searchInput={searchInput} 
                               setSearchInput={setSearchInput} />
                    <OrderBy userSortBy={userSortBy} setUserSortBy={setUserSortBy}
                             sortableFields={CONFIGS.usuariosAdmin.sortableFields} />
                    <OrderDir userSortOrder={userSortOrder} setUserSortOrder={setUserSortOrder} />
                    <PageSize pageSize={pageSize} setPageSize={setPageSize} /> 
                </Grid>
            </Paper>

            {error && <Alert severity="error" variant="standard" onClose={closeError}>
                        {error}
                      </Alert>}

            {searchQuery != '' && <Typography variant="h8">
                                    <FormattedMessage id="searchQuery"
                                                      defaultMessage={"Pesquisando por " + "'" + {searchQuery} + "'"}
                                                      values={{query:searchQuery}} />               
                                   </Typography>}
            
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}

            <DataTable data={data} loading={loading} pageNumber={pageNumber} pageSize={pageSize}
                       setPageNumber={setPageNumber} pagination={pagination} columns={CONFIGS.usuariosAdmin.columns}
                       deletable={true} onDelete={handleDeleteClick} onEdit={handleEditClick} />   

            <EditItemForm
                open={!!editingItem}
                onClose={handleCloseDialog}
                onSubmit={handleEditSubmit}
                item={editingItem}
                dataType={"users"}
                editableFields={CONFIGS.usuariosAdmin.editableFields}
                validationSchema={CONFIGS.usuariosAdmin.validationSchema}
            />
            <DeleteItemDialog
                deleteOpen={!!deletingItem}
                onClose={handleCloseDelete}
                onConfirm={handleDeleteConfirm}
            />
        </Box>
    );
}
