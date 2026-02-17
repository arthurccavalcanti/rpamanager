import { getCreateUserSchema, } from '../../utils/validationSchemas';
import { Button, Box, FormControl, Alert, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState, Fragment } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useAuth } from '../../contexts/AuthContext';
import handleAxiosError from '../../utils/handleAxiosError';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

export default function CadastroUser({ onDone }) {

    const intl = useIntl();
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleClose = () => setOpen(false);
    const handleClickOpen = () => setOpen(true);

    const { register } = useAuth();

    const handleRegister = async (values, { setSubmitting, resetForm }) => {
        setServerError('');
        setSuccessMessage('');
        setSubmitting(true);
        resetForm();
        const result = await register(values.email, values.password);
        if (result.success) {
            setSuccessMessage(<FormattedMessage id="sucessMessage"
                                                defaultMessage="Usuário cadastrado." />);
            onDone();
        } else {
          setServerError(handleAxiosError(intl, result.error));
        }
        setSubmitting(false);
    };

  return (
    <Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <FormattedMessage id="createUser.button" defaultMessage="Criar usuário" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Criar usuário</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ email: "", password: ""}}
            validationSchema={getCreateUserSchema(intl)}
            onSubmit={handleRegister}
          >
            {({  values, errors, touched, isSubmitting, handleChange, handleBlur }) => (
              <Form>

                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,
                     maxWidth: 400, mx: 'auto', p: 3, border: '1px solid #eee',
                     borderRadius: '8px' }}>

                  <FormControl fullWidth>
                    <TextField
                        label={<FormattedMessage id="email" defaultMessage="E-mail" />}
                        name="email"
                        variant="outlined"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        label={<FormattedMessage id="password" defaultMessage="Senha" />}
                        name="password"
                        type="password"
                        variant="outlined"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />
                  </FormControl>

                  <DialogActions>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                      <FormattedMessage id="createUser.button" defaultMessage="Criar usuário" />
                    </Button>
                    <Button type="button" onClick={handleClose}>
                      <FormattedMessage id="return" defaultMessage="Cancelar" />
                    </Button>
                  </DialogActions>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}