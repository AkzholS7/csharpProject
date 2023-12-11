import React from 'react'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Signup = () => {
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
        setOpenBackDrop(true);
        fetch("https://localhost:7172/api/Users/SignIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setOpenBackDrop(false);
                    setMessage(data.mess);
                    handleClick('success');
                }
                else {
                    setOpenBackDrop(false);
                    setMessage(data.mess);
                    handleClick('error');
                }
            })
            .catch((error) => {
                setOpenBackDrop(false);
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
    const [openBackdrop, setOpenBackDrop] = React.useState(false);
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
                Sign Up
            </Typography>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={TransitionDown}>
                <Alert onClose={handleClose} severity={status} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <FormControl variant="standard" margin="normal" fullWidth >
                <InputLabel htmlFor="email">
                    Email
                </InputLabel>
                <Input
                    id="email"
                    type='email'
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
                <InputLabel htmlFor="username">
                    Name
                </InputLabel>
                <Input
                    id="username"
                    type='text'
                    name='Username'
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl variant="standard" margin="normal" fullWidth >
                <InputLabel htmlFor="password">
                    Create a Password
                </InputLabel>
                <Input
                    id="password"
                    type='password'
                    name='Password'
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>

            <FormControl variant="standard" margin="normal" fullWidth >
                <InputLabel htmlFor="password">
                    Confirm your Password
                </InputLabel>
                <Input
                    id="password"
                    type='password'
                    name='ConfirmPassword'
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>

            <FormControl>
                <FormLabel id="radio-buttons-group-label">I'm a ...</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="Role"
                    onChange={handleChange}
                >
                    <FormControlLabel value="Student" control={<Radio />} label="Student" />
                    <FormControlLabel value="Tutor" control={<Radio />} label="Tutor" />
                </RadioGroup>
            </FormControl>
            <Button
                type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign Up
            </Button>
        </Box>
    )
}

export default Signup
