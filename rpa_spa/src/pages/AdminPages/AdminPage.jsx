import { Button, Container, Paper,Typography, Stack, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HubIcon from '@mui/icons-material/Hub';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FormattedMessage } from 'react-intl';

export default function AdminPage() {

    const { user } = useAuth();
    const username = user.username.split('@')[0];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2
                }}
            >
                <Stack spacing={3} sx={{ width: '100%', alignItems: 'center' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        color="text.primary"
                        sx={{ fontWeight: 'bold' }}
                    >
                        <FormattedMessage id="welcome"
                                          defaultMessage={"Bem-vindo(a), " + username}
                                          values={{user: username}} />
                    </Typography>

                    <Divider sx={{ width: '80%' }} />

                    <Stack direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            component={Link}
                            to="/api/admin/RPAs"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<HubIcon />}
                        >
                            <FormattedMessage id="adminPage.rpas" defaultMessage="Admin RPAs" />
                        </Button>
                        <Button
                            component={Link}
                            to="/api/admin/users"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<PersonIcon />}
                        >
                            <FormattedMessage id="adminPage.users" defaultMessage="Admin Usuários" />
                        </Button>
                        <Button
                            component={Link}
                            to="/api/admin/processos"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<AccountTreeIcon />}
                        >
                            <FormattedMessage id="adminPage.jobs" defaultMessage="Admin Processos" />
                        </Button>

                    </Stack>
                </Stack>
            </Paper>
        </Container> 
    );
}
