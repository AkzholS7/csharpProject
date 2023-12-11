import React from 'react'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';

const Signin = () => {

    const style = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 2,
    };
    const [inputs, setInputs] = React.useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = (event) => {
        fetch("https://localhost:7172/api/Users/LogIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setMessage(data.mess);
                    handleClick('success');
                    localStorage.setItem("jwt", data.jwt);
                }
                else {
                    setMessage(data.mess);
                    handleClick('error');
                }
            })
            .catch((error) => {
                setMessage(error.message);
                handleClick('warning');
            });
    }
    const [message, setMessage] = React.useState("Unkown Error.");

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState('info');

    const handleClick = (st) => {
        setStatus(st);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setStatus('info');
        setOpen(false);
    };

    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2" align="center">
                Sign in
            </Typography>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={2000} onClose={handleClose} TransitionComponent={TransitionDown}>
                <Alert onClose={handleClose} severity={status} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <FormControl variant="standard" margin="normal" fullWidth >
                <InputLabel htmlFor="username">
                    Email
                </InputLabel>
                <Input
                    id="username"
                    name='Email'
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <EmailIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl variant="standard" margin="normal" fullWidth >
                <InputLabel htmlFor="password">
                    Password
                </InputLabel>
                <Input
                    id="password"
                    name='Password'
                    type='password'
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                on
            >
                Sign In
            </Button>
        </Box>
    )
}

export default Signin
