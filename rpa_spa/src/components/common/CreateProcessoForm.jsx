import { getProcessoSchema } from '../../utils/validationSchemas';
import { Button, Box, FormControl, InputLabel, MenuItem,
         Select, Alert, TextField, FormHelperText } from '@mui/material';
import { Formik, Form } from 'formik';
import { createProcesso, getUserRPAsData } from '../../api/userApi';
import { useState, Fragment, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { getConfigs } from '../../utils/Configs';
import handleAxiosError from '../../utils/handleAxiosError';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

export default function CadastroProcesso({ onDone }) {

  const intl = useIntl();
  const CONFIGS = getConfigs(intl);
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rpasData, setRpasData] = useState([]);

  useEffect(() => {
    if (open) {
            const fetchRpaNames = async () => {
                try {
                    const response = await getUserRPAsData();
                    setRpasData(response.data);
                } catch (error) {
                    setServerError(handleAxiosError(intl, error));
                }
            };
            fetchRpaNames();
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
    const reqBody = {url: values.url, rpaId: values.rpa};
    const response = await createProcesso(reqBody);
    if (response.success) {
      setSuccessMessage(<FormattedMessage id="createJob.successMessage"
                                          defaultMessage="Processo cadastrado." />);
      onDone();
    } else {
      setServerError(handleAxiosError(intl, response.error));
    }
    setSubmitting(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <FormattedMessage id="createJob.button" defaultMessage="Criar processo" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <FormattedMessage id="createJob.title" defaultMessage="Criar processo" />
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ url: "", rpa: "", detalhes: ""}}
            validationSchema={getProcessoSchema(intl)}
            onSubmit={handleSubmit}
          >
            {({  values, errors, touched, isSubmitting, handleChange, handleBlur }) => (
              <Form>

                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,
                     maxWidth: 400, mx: 'auto', p: 3, border: '1px solid #eee',
                     borderRadius: '8px' }}>

                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage id="createJob.rpaLabel" defaultMessage="RPA" />
                    </InputLabel>
                    <Select name="rpa"
                            value={values.rpa}
                            label={<FormattedMessage id="createJob.rpaLabel" defaultMessage="RPA" />}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.rpa && Boolean(errors.rpa)}
                            helpertext={touched.rpa && errors.rpa}
                            >
                        <MenuItem value="">
                          <em>
                            <FormattedMessage id="createJob.pickRPA" defaultMessage="-- Escolha um RPA --" />
                          </em>
                        </MenuItem>
                        {rpasData.map((rpa) => (
                            <MenuItem key={Object.values(rpa)[0]} value={Object.values(rpa)[0]}>
                                {Object.keys(rpa)[0]}
                            </MenuItem>
                        ))}
                    </Select>
                    {touched.rpa && errors.rpa && (
                      <FormHelperText>{errors.rpa}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage id="createJob.urlLabel" defaultMessage="URL" />
                    </InputLabel>
                    <Select name="url"
                            value={values.url}
                            label={<FormattedMessage id="createJob.urlLabel" defaultMessage="URL" />}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.url && Boolean(errors.url)}
                            helpertext={touched.url && errors.url}
                            >
                        <MenuItem value="">
                          <em>
                          <FormattedMessage id="createJob.pickURL" defaultMessage="-- Escolha uma URL --" />
                          </em>
                        </MenuItem>
                        {CONFIGS.processos.editableFields[0].options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {touched.url && errors.url && (
                      <FormHelperText>{errors.url}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    label={<FormattedMessage id="createJob.detailsLabel" defaultMessage="Detalhes" />}
                    name="detalhes"
                    value={values.detalhes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.detalhes && Boolean(errors.detalhes)}
                    helperText={touched.detalhes && errors.detalhes}
                  />

                  <DialogActions>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                      <FormattedMessage id="createJob.create" defaultMessage="Criar processo" />
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