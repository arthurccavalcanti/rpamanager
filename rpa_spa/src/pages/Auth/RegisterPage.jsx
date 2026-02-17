import { Formik, Form } from 'formik';
import { getRegisterSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../contexts/AuthContext'; 
import { TextField, Button, Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import handleAxiosError from '../../utils/handleAxiosError';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

const RegisterPage = () => {

  const intl = useIntl();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    setSuccessMessage('');
    resetForm();
    const result = await register(values.email, values.password);
    if (result.success) {
      setSuccessMessage('Cadastro realizado. Encaminhando para o login...');
      setTimeout(() => navigate('/api/auth/login'), 1000);
    } else {
      setServerError(handleAxiosError(intl, result.error));
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword:'' }}
        validationSchema={getRegisterSchema(intl)}
        onSubmit={handleRegister}
      >
        {({ values, errors, touched, isSubmitting, handleChange, handleBlur  }) => (
          <Form>
            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600,
                      mx: 'auto', p: 3, border: '1px solid #eee', borderRadius: '8px',
                      paddingTop: 2, paddingBottom: 2, marginTop: 5, marginBottom: 5 }}>

              <Typography sx={{ mx: 'auto' }} variant="h4" gutterBottom>
                <FormattedMessage id="registerPage.register" defaultMessage="Cadastre-se" />
              </Typography>
              
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

              <TextField
                label={<FormattedMessage id="confirmPassword" defaultMessage="Confirme a senha" />}
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} />
                              : <FormattedMessage id="registerPage.registerButton" defaultMessage="Cadastrar" />
                }
              </Button>
              
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterPage;