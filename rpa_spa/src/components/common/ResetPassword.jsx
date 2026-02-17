import { Formik, Form } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,
         TextField, Box, CircularProgress } from '@mui/material';
import { getResetPasswordSchema } from '../../utils/validationSchemas';
import { FormattedMessage, useIntl } from 'react-intl';


export const ResetPassword = ({ open, onClose, onSubmit }) => {
    
    const intl = useIntl();
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const reqBody = {currentPassword: values.currentPassword,
                         newPassword: values.password};
        resetForm();
        onSubmit(reqBody);
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="resetPassword.title" defaultMessage="Reset de senha" />
            </DialogTitle>
            <Formik
                initialValues={{ currentPassword: '', password: '', confirmPassword: '' }}
                validationSchema={getResetPasswordSchema(intl)}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
                    <Form>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                                <TextField
                                    label={<FormattedMessage id="resetPassword.currentPass" defaultMessage="Senha atual" />}
                                    name="currentPassword"
                                    type="password"
                                    variant="outlined"
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.currentPassword && Boolean(errors.currentPassword)}
                                    helperText={touched.currentPassword && errors.currentPassword}
                                />

                                <TextField
                                    label={<FormattedMessage id="resetPassword.newPass" defaultMessage="Nova senha" />}
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
                                    label={<FormattedMessage id="resetPassword.confirmPass" defaultMessage="Confirme a nova senha" />}
                                    name="confirmPassword"
                                    type="password"
                                    variant="outlined"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: '16px 24px' }}>
                            <Button onClick={onClose} color="secondary">
                                <FormattedMessage id="return" defaultMessage="Cancelar" />
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? <CircularProgress size={24} />
                                              : <FormattedMessage id="confirmChanges" defaultMessage="Salvar alterações" />}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};