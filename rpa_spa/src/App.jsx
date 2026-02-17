import { Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline, Button } from '@mui/material';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminPage from './pages//AdminPages/AdminPage';
import AdminRPAs from './pages/AdminPages/AdminRPAs';
import AdminUsers from './pages/AdminPages/AdminUsers';
import AdminProcessos from './pages/AdminPages/AdminProcessos';
import UserPage from './pages/UserPages/UserPage';
import RPAPage from './pages/UserPages/RPAPage';
import ProcessoPage from './pages/UserPages/ProcessoPage';
import Header from './components/layout/Header'; 
import Footer from './components/layout/Footer';
import { AuthWrapper } from './contexts/AuthWrapper';
import {AdminWrapper} from './contexts/AdminWrapper';
import ChangePasswordPage from './pages/UserPages/ChangePasswordPage';
import {FormattedMessage} from 'react-intl'


export default function App() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
        <CssBaseline />
        <Header />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route exact path="/" element={<RegisterPage />} />
              <Route exact path="/api" element={<RegisterPage />} />
              <Route exact path="/api/auth/register" element={<RegisterPage />} />
              <Route exact path="/api/auth/login" element={<LoginPage />} />
              
              <Route element={<AuthWrapper />}>
                <Route path="/api/user/*" element={<UserPage />} />
                <Route path="/api/RPA/*" element={<RPAPage />} />
                <Route path="/api/changePassword/*" element={<ChangePasswordPage />} />
                <Route path="/api/processo/*" element={<ProcessoPage />} />
              </Route>

              <Route element={<AdminWrapper />}>
                <Route exact path="/api/admin/" element={<AdminPage />} />
                <Route path="/api/admin/users" element={<AdminUsers />} />
                <Route path="/api/admin/processos" element={<AdminProcessos />} />
                <Route path="/api/admin/RPAs" element={<AdminRPAs />} />
              </Route>

              <Route path="*" element={<Box sx={{ display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  minHeight: '100vh',
                                                  textAlign: 'center',
                                                  p: 3,}}>
                                          <FormattedMessage id="404Page.404Message" defaultMessage="404: Página não encontrada." />
                                          <Button variant="contained" component={Link} to="/">
                                            <FormattedMessage id="404Page.goHome" defaultMessage="Voltar para a página inicial." />
                                          </Button>
                                        </Box>} 
              />
            </Routes>
        </Box>
        
        <Footer /> 
    </Box>
  );
}