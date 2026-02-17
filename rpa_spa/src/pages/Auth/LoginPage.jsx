import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { getLoginSchema } from '../../utils/validationSchemas';
import { Formik, Form } from 'formik';
import { TextField, Button, Box, Alert, CircularProgress, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import handleAxiosError from '../../utils/handleAxiosError';
import { useIntl } from 'react-intl';

const LoginPage = () => {

  const intl = useIntl();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting }) => {
    setServerError('');
    setSuccessMessage('');
    setSubmitting(true);
    const result = await login(values.email, values.password);
    if (result.success) {
      setSuccessMessage(<FormattedMessage id="login.successMessage" defaultMessage="Entrando..." />);
      setTimeout(() => navigate('/api/user'), 1000);
    } else {
      setServerError(<FormattedMessage id="login.error" values={{error: handleAxiosError(intl, result.error)}} />);
    }
    setSubmitting(false);    
  };

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={getLoginSchema(intl)}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
              {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
              {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600,
                          mx: 'auto', p: 3, border: '1px solid #eee', borderRadius: '8px',
                          paddingTop: 2, paddingBottom: 2, marginTop: 5, marginBottom: 5 }}>

                <Typography sx={{ mx: 'auto' }} variant="h4" gutterBottom>
                  <FormattedMessage id="loginPage.login" defaultMessage="Login" />
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
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} />
                                : <FormattedMessage id="loginPage.loginButton" defaultMessage="Entrar" />
                  }
                </Button>
              </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginPage;