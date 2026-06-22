// src/components/auth/Login.jsx
import { useContext, useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';

const Login = () => {
    const { token, login, logOut, tokenData } = useContext(AuthContext);
    
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" align="center">Login</Typography>
                <Box component="form" sx={{ mt: 1 }}>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => login()}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
