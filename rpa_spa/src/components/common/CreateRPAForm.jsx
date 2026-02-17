import { getRPASchema } from '../../utils/validationSchemas.js';
import { TextField, Button, FormControl, MenuItem,
         Select, Box, Alert, InputLabel, FormHelperText } from '@mui/material';
import { Formik, Form } from 'formik';
import { createRPA, getRPATypes } from '../../api/userApi.js';
import { useState, Fragment, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import handleAxiosError from '../../utils/handleAxiosError.js';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

export default function CadastroRPA( { onDone }) {

  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rpaTypes, setRpaTypes] = useState([]);

  useEffect(() => {
    if (open) {
            const fetchRpaTypes = async () => {
                try {
                    const response = await getRPATypes();
                    setRpaTypes(response.data);
                } catch (error) {
                    setServerError(handleAxiosError(intl, error));
                }
            };
            fetchRpaTypes();
        }
    }, [open]);

  const handleClose = () => {
    setOpen(false);
    setServerError("");
    setSuccessMessage("");
  };
  
  const handleClickOpen = () => setOpen(true);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    setSuccessMessage('');
    resetForm();      
    const reqBody = {nomeRPA: values.nomeRPA, tipoRPA: values.tipoRPA};
    const response = await createRPA(reqBody);
    if (response.success) {
      setSuccessMessage(<FormattedMessage id="createRPA.successMessage"
                                          defaultMessage="RPA cadastrado." />);
      onDone();
    } else {
      setServerError(handleAxiosError(intl, response.error))
    }
    setSubmitting(false);
  }

  return (
    <Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <FormattedMessage id="createRPA.title" defaultMessage="Criar RPA" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Criar RPA</DialogTitle>
        <DialogContent>
          <Formik
          initialValues={{ nomeRPA: "", tipoRPA: "" }}
          validationSchema={getRPASchema(intl)}
          onSubmit={handleSubmit}
          >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur  }) => (
            <Form>

              {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
              {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400,
                        mx: 'auto', p: 3, border: '1px solid #eee', borderRadius: '8px' }}>
                <TextField
                  label={<FormattedMessage id="createRPA.name" defaultMessage="Nome do RPA" />}
                  name="nomeRPA"
                  value={values.nomeRPA}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.nomeRPA && Boolean(errors.nomeRPA)}
                  helperText={touched.nomeRPA && errors.nomeRPA}
                />

                <FormControl fullWidth>
                  <InputLabel>Tipo de RPA</InputLabel>
                  <Select name="tipoRPA"
                          value={values.tipoRPA}
                          label={<FormattedMessage id="createRPA.type" defaultMessage="Tipo de RPA" />}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.tipoRPA && Boolean(errors.tipoRPA)}
                          helpertext={touched.tipoRPA && errors.tipoRPA}
                          >
                      <MenuItem value="">
                        <em>
                          <FormattedMessage id="createRPA.pickType" defaultMessage="-- Escolha um tipo --" />
                        </em>
                      </MenuItem>
                      {rpaTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                              {type}
                          </MenuItem>
                      ))}
                  </Select>
                  {touched.tipoRPA && errors.tipoRPA && (
                      <FormHelperText>{errors.tipoRPA}</FormHelperText>
                  )}
                </FormControl>

                <DialogActions>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    <FormattedMessage id="createRPA.create" defaultMessage="Criar RPA" />
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