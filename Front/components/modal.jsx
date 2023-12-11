import React, { useState } from 'react';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Modal from '@mui/material/Modal';
import LogoutIcon from '@mui/icons-material/Logout';
import Signin from './sign_in';
import Signup from './sign_up';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Stack from '@mui/material/Stack';

export default function MyModal({ children, props }) {
    const [activeModal, setActiveModal] = useState("signin");
    const [isLogedIn, setisLogedIn] = useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleOpen = () => {
        setModalOpen(true)
    }
    const handleClose = () => {
        setModalOpen(false)
    }

    return (
        <>
            <Stack spacing={2} direction="row">
                {isLogedIn ? 
                    (
                        <>
                            <Button variant="outlined" color="inherit" endIcon={< AccountCircleOutlinedIcon />}>My Profile</Button>
                            <Button onClick={() => { setActiveModal("signup"); handleOpen() }} variant="outlined" color="inherit" endIcon={< LogoutIcon />}>Log out</Button>
                        </>
                    )
                    : 
                    (
                        <>
                            <Button startIcon={< LoginIcon />} onClick={() => { setActiveModal("signin"); handleOpen() }}  color="inherit">Log in</Button>
                            <Button onClick={() => { setActiveModal("signup"); handleOpen() }}  color="inherit">Register</Button>
                        </>
                    )
                }
            </Stack>

            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                {activeModal === 'signin' ? <Signin /> : <Signup />}
            </Modal>
        </>
    )
}