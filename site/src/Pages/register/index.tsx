import { Box, Button, TextField, Typography,ThemeProvider,createTheme,FormHelperText } from "@mui/material";
import { useState } from "react";
import "./index.scss";

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Link,redirect } from "react-router-dom";

export default function Register({setPage}: {setPage: (page: string) => void}) {
    setPage('register');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const tooglePassword = () => {
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const isValidPassword = (password: string) => {
        return password.length >= 8;
    }

    const isValidUsername = (username: string) => {
        return username.length >= 4;
    }


    const handleLogin = async () => {
        console.log('handleLogin', email, password);
        // check if email is valid

        if(!isValidEmail(email)) {
            setEmailError('Invalid email');

            if(!isValidPassword(password)) {
                setPasswordError('Invalid password');
            }

            if(!isValidUsername(username)) {
                setUsernameError('Invalid username');
            }

            return;
        }

        emailError && setEmailError('');

        if(!isValidUsername(username)) {
            setUsernameError('Invalid username');

            if(!isValidPassword(password)) {
                setPasswordError('Invalid password');
            }
            return;
        }

        if(!isValidPassword(password)) {
            setPasswordError('Invalid password');
            return;
        }

        setPasswordError('');

        const {data} = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, username, password})
        }).then(res => res.json());
        console.log('data', data);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        window.location.href = '/';
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Box className="login">
                <Typography variant="h4">Register</Typography>

                <TextField
                    label="Email"
                    variant="standard"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="field"
                    error={emailError !== ""}
                    color={emailError !== "" ? "error" : "primary"}
                />
                <FormHelperText
                    sx={{
                        color: "red",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        marginTop: "10px",
                        display: emailError !== "" ? "block" : "none",
                    }}
                >
                    {emailError}
                </FormHelperText>

                <TextField
                    label="Username"
                    variant="standard"
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    className="field"
                    error={usernameError !== ""}
                    color={usernameError !== "" ? "error" : "primary"}
                />
                <FormHelperText
                    sx={{
                        color: "red",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        marginTop: "10px",
                        display: usernameError !== "" ? "block" : "none",
                    }}
                >
                    {usernameError}
                </FormHelperText>
                <div className="box">
                    <TextField
                        label="Password"
                        variant="standard"
                        value={password}
                        type={type}
                        onChange={(e) => setPassword(e.target.value)}
                        className="field"
                        error={passwordError !== ""}
                        color={passwordError !== "" ? "error" : "primary"}
                    />
                    <FormHelperText
                        sx={{
                            color: "red",
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginLeft: "10px",
                            marginTop: "10px",
                            display: passwordError !== "" ? "block" : "none",
                        }}
                    >
                        {passwordError}
                    </FormHelperText>
                    <Button onClick={tooglePassword} className="btn">
                        {type === "password" ? (
                            <VisibilityOutlinedIcon />
                        ) : (
                            <VisibilityOffOutlinedIcon />
                        )}
                    </Button>
                </div>
                <div className="actions">
                    <Typography variant="subtitle1" className="register">
                        Already have an account?{" "}
                        <Link to="/login" className="link">
                            Login
                        </Link>
                    </Typography>
                    <Button variant="contained" onClick={handleLogin}>
                        Register
                    </Button>
                </div>
            </Box>
        </ThemeProvider>
    );
}