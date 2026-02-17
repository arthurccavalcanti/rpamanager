import { Container, Paper,Typography, Box, Alert, Button, Stack, Divider } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HubIcon from '@mui/icons-material/Hub';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FormattedMessage } from 'react-intl';

export default function UserPage() {
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
                            to="/api/RPA"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<HubIcon />}
                        >
                            <FormattedMessage id="userPage.rpas" defaultMessage="Meus RPAs" />
                        </Button>
                        <Button
                            component={Link}
                            to="/api/processo"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<AccountTreeIcon />}
                        >
                            <FormattedMessage id="userPage.jobs" defaultMessage="Meus Processos" />
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

        </Container>
    );
}