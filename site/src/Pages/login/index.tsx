import {
    ThemeProvider,
    createTheme,
    Box,
    Button,
    TextField,
    Typography,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import "./index.scss";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Link } from "react-router-dom";

export default function Login({
    setPage,
}: {
    setPage: (page: string) => void;
}) {
    setPage("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("password");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const tooglePassword = () => {
        if (type === "password") {
            setType("text");
        } else {
            setType("password");
        }
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    const handleLogin = async () => {
        console.log("handleLogin", email, password);
        // check if email is valid

        if (!isValidEmail(email)) {
            setEmailError("Invalid email");

            if (!isValidPassword(password)) {
                setPasswordError("Invalid password");
            }

            return;
        }

        emailError && setEmailError("");

        if (!isValidPassword(password)) {
            setPasswordError("Invalid password");
            return;
        }

        setPasswordError("");

        const { data } = await fetch(
            "https://content-management-sepia.vercel.app/https://cmt-backend.usersatoshi.repl.co/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            },
        ).then((res) => res.json());

        console.log("data", data);

        if (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        window.location.href = "/";
    };

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Box className="login">
                <Typography variant="h4">Login</Typography>

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
                        Don't have an account?{" "}
                        <Link to="/register" className="link">
                            Register
                        </Link>
                    </Typography>
                    <Button variant="contained" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </Box>
        </ThemeProvider>
    );
}
