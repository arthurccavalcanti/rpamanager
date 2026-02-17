import { Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,
         TextField, Box, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';


export const EditItemForm = ({ open, onClose, onSubmit, item, dataType, editableFields, validationSchema }) => {
    
    if (!item) return;

    const initialValues = editableFields.reduce((acc, editField) => {
        acc[editField.field] = item[editField.field] || '';
        return acc;
    }, {});

    const handleSubmit = (values, { setSubmitting }) => {
        if (dataType == 'users') {
            if (values.username == initialValues.username) {
                values.username = '';
            }
        }
        let requestBody = { ...values };
        if (dataType == 'processos') {
            requestBody.rpaId = item.rpaId;
        }
        onSubmit(requestBody, item.id);
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage id="editItem.title" defaultMessage="Editar item" />
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
                    <Form>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                                {editableFields.map(editableField => (
                                    <Fragment key={editableField.field}>
                                        {editableField.type == 'texto' && 
                                            <Field
                                                as={TextField}
                                                name={editableField.field}
                                                label={editableField.headerName}
                                                fullWidth
                                                variant="outlined"
                                                error={touched[editableField.field] && Boolean(errors[editableField.field])}
                                                helperText={touched[editableField.field] && errors[editableField.field]}
                                            />
                                        }

                                        {editableField.type == 'select' &&
                                            <FormControl fullWidth error={touched[editableField.field] && Boolean(errors[editableField.field])}>
                                                <Select
                                                    label={editableField.headerName}
                                                    name={editableField.field}
                                                    value={values[editableField.field]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    {editableField.options.map(option => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                                {touched[editableField.field] && errors[editableField.field] && (
                                                    <FormHelperText>{errors[editableField.field]}</FormHelperText>
                                                )}
                                            </FormControl>
                                        }
                                    </Fragment>
                                ))}
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