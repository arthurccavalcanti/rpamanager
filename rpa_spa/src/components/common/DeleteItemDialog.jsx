import { Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export const DeleteItemDialog = ({ deleteOpen, onClose, onConfirm }) => {
    return(
        <Dialog open={deleteOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="deleteItem.title" defaultMessage="Deletar item" />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage id="deleteItem.dialog" defaultMessage="Deseja deletar o item?" />
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="secondary">
                    <FormattedMessage id="return" defaultMessage="Cancelar" />
                </Button>
                <Button onClick={onConfirm} variant="contained">
                    <FormattedMessage id="confirm" defaultMessage="Confirmar" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}