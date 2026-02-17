import { Typography, Link, Container, Box } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.dark'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="secondary.light" align="center">
            {'Copyright © '}
            <Link color='inherit' href="#" target="_blank" rel="noopener noreferrer">
              Rpa Manager
            </Link>{'   '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
      </Container>
    </Box>
  );
}