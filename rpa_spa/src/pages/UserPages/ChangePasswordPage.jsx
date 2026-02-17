import { ResetPassword } from '../../components/common/ResetPassword';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useState } from 'react';
import { editUserPassword } from '../../api/userApi';
import { Box, Alert, Button } from '@mui/material';
import handleAxiosError from '../../utils/handleAxiosError';
import { FormattedMessage, useIntl } from 'react-intl';

export default function ChangePasswordPage() {

    const intl = useIntl();
    const [error, setError] = useState(null);
    const [successMessage, setSucessMessage] = useState();
    const [isEditing, setEditing] = useState();

    const handleEdit = async (reqBody) => {
            setError(null);
            setSucessMessage(null);
            try {
                const response = await editUserPassword(reqBody);
                setSucessMessage(response);
            } catch (err) {
                setError(handleAxiosError(intl, err));
            } finally {
                handleCloseDialog();
            }            
    };

    const handleCloseDialog = () => {  setEditing(false); };
    const handleOpenDialog = () => {  setEditing(true); };

    const closeError = () => {  setError(null); };
    const closeSucess = () => {  setSucessMessage(null); };

    return (
    <Box sx={{display: 'grid', placeItems: 'center',           
              padding: 2, marginBottom: 3, borderBottom: '1px solid', borderColor: 'divider'}}
    >
        <Box sx={{ width: '100%', maxWidth: '500px' }}>
            {error && (
                <Alert severity="error" variant="standard" onClose={closeError}>
                    {error}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success" variant="standard" onClose={closeSucess}>
                    {successMessage}
                </Alert>
            )}
        </Box>
        <Button
            onClick={handleOpenDialog}
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<VpnKeyIcon />}
        >
            <FormattedMessage id="resetPasswordPage.button" defaultMessage="Redefinir a senha" />
        </Button>
        <ResetPassword open={isEditing} onClose={handleCloseDialog} onSubmit={handleEdit} /> 
    </Box>                 
    );
}