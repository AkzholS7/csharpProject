import React from 'react';
import Head from 'next/head'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListOfCourse from '@/components/course';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Modal from '@mui/material/Modal';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import GroupsIcon from '@mui/icons-material/Groups';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Home() {
  //<Styles
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
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  }
  //Styles>


  //<Modal
  const [activeModal, setActiveModal] = useState("login");
  const [isLogedIn, setIsLogedIn] = useState(false);
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("id");
    if (loggedInUserId) {
      setIsLogedIn(true);
    }
  }, []);
  const Logout = () => {
    setIsLogedIn(false);
    localStorage.clear();
    setMessageAlert('Log Out Success');
    handleClickAlert('success');
  }
  const [openNewCourseDialog, setOpenNewCourseDialog] = React.useState(false);

  const handleClickOpenNewCourseDialog = () => {
    setOpenNewCourseDialog(true);
  };

  const handleCloseNewCourseDialog = () => {
    setOpenNewCourseDialog(false);
  };

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpenModal = () => {
    setModalOpen(true)
  }
  const handleCloseModal = () => {
    setModalOpen(false)
  }
  const [openEditProfileModal, setOpenEditProfileModal] = React.useState(false);
  const handleOpenEditProfileModal = () => {
    handleCloseMyProfile(false);
    setOpenEditProfileModal(true);
  }
  const handleCloseEditProfileModal = () => {
    setOpenEditProfileModal(false)
  }
  const [openMyProfile, setOpenMyProfile] = React.useState(false);
  const handleOpenMyProfile = () => {
    setOpenMyProfile(true)
  }
  const handleCloseMyProfile = () => {
    setOpenMyProfile(false)
  }


  const [courseStatus, setCourseStatus] = React.useState('Online');

  const handleChangeStatus = (event) => {
    setCourseStatus(event.target.value);
  };
  const [courseParticipant, setCourseParticipant] = React.useState('');

  const handleChangeParticipant = (event) => {
    setCourseParticipant(event.target.value);
  };
  const [coursePrice, setCoursePrice] = React.useState('');

  const handleChange = (event) => {
    setCoursePrice(event.target.value);
  };
  //Modal>

  //Alert
  const [messageAlert, setMessageAlert] = React.useState("Unkown Error.");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [statusAlert, setStatusAlert] = React.useState('info');
  const [openBackdrop, setOpenBackDrop] = React.useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }
  const handleClickAlert = (st) => {
    setStatusAlert(st);
    setOpenAlert(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusAlert('info');
    setOpenAlert(false);
  };
  //Alert



  //LoginComponent
  const Login = () => {
    const [inputsLogin, setInputsLogin] = React.useState({});
    const handleChangeLogin = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputsLogin(values => ({ ...values, [name]: value }))
    }
    const handleSubmitLogin = (event) => {
      setModalOpen(false);
      setOpenBackDrop(true);
      fetch("https://localhost:7172/api/Users/LogIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputsLogin),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setOpenBackDrop(false);
            setMessageAlert(data.mess);
            handleClickAlert('success');
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("id", data.id);
            localStorage.setItem("role", data.role);
            setIsLogedIn(true);
          }
          else {
            setOpenBackDrop(false);
            setMessageAlert(data.title);
            handleClickAlert('error');
          }
        })
        .catch((error) => {
          setOpenBackDrop(false);
          setMessageAlert(error.message);
          handleClickAlert('warning');
        });
    }
    return (
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2" align="center">
          Log in
        </Typography>
        <FormControl variant="standard" margin="normal" fullWidth >
          <InputLabel htmlFor="username">
            Email
          </InputLabel>
          <Input
            id="username"
            name='Email'
            onChange={handleChangeLogin}
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
            onChange={handleChangeLogin}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          onClick={handleSubmitLogin}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          on
        >
          Log In
        </Button>
      </Box>
    )
  }
  //RegisterComponent
  const Register = () => {
    const [inputsRegister, setInputsRegister] = React.useState({});
    const handleChangeRegister = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputsRegister(values => ({ ...values, [name]: value }))
    }
    const handleSubmitRegister = (event) => {
      setModalOpen(false);
      setOpenBackDrop(true);
      if (inputsRegister.Password === document.getElementById('ConfirmPassword').value) {
        fetch("https://localhost:7172/api/Users/Register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputsRegister),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setOpenBackDrop(false);
              setMessageAlert(data.mess);
              handleClickAlert('success');

            }
            else {
              setOpenBackDrop(false);
              setMessageAlert(data.title);
              handleClickAlert('error');
            }
          })
          .catch((error) => {
            setOpenBackDrop(false);
            setMessageAlert(error.message);
            handleClickAlert('warning');
          });
      }
      else {
        setMessageAlert("Passwords must match!");
        handleClickAlert('warning');
        setTimeout(() => {
          setOpenBackDrop(false);
          setModalOpen(true);
        }, "4000");
      }
    }
    return (
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2" align="center">
          Register
        </Typography>
        <FormControl variant="standard" margin="normal" fullWidth >
          <InputLabel htmlFor="email">
            Email
          </InputLabel>
          <Input
            id="email"
            type='email'
            name='Email'
            onChange={handleChangeRegister}
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
            onChange={handleChangeRegister}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl variant="standard" margin="normal" fullWidth >
          <InputLabel htmlFor="passwordRegister">
            Create a Password
          </InputLabel>
          <Input
            id="passwordRegister"
            type='password'
            name='Password'
            onChange={handleChangeRegister}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="standard" margin="normal" fullWidth >
          <InputLabel htmlFor="password">
            Re-Enter Password
          </InputLabel>
          <Input
            id="ConfirmPassword"
            type='password'
            name='ConfirmPassword'
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
            onChange={handleChangeRegister}
          >
            <FormControlLabel value="Student" control={<Radio />} label="Student" />
            <FormControlLabel value="Tutor" control={<Radio />} label="Tutor" />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          onClick={handleSubmitRegister}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
    )
  }
  //New Course Dialog
  function NewCourseFormDialog() {
    const [inputsNewCourse, setInputsNewCourse] = React.useState({});
    const handleChangeNewCourse = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputsNewCourse(values => ({ ...values, [name]: value }))
    }
    const [newCourseStatus, setnewCourseStatus] = React.useState('Online');
    const handleChangeNewCourseStatus = (event) => {
      setnewCourseStatus(event.target.value)
    }
    const [newCoursePhoto, setnewCoursePhoto] = React.useState([]);
    const handleChangeNewCoursePhoto = (event) => {
      setnewCoursePhoto(event.target.files[0]);
    }
    const handleSubmitNewCourse = (event) => {
      setModalOpen(false);
      setOpenBackDrop(true);
      let formData = new FormData();
      for (let name in inputsNewCourse) {
        formData.append(name, inputsNewCourse[name]);
      }
      formData.append("TutorId", localStorage.getItem("id"));
      formData.append("Status", newCourseStatus);
      formData.append("Photo", newCoursePhoto);
      fetch("https://localhost:7172/api/Courses/NewCourse", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            handleCloseNewCourseDialog();
            setOpenBackDrop(false);
            setMessageAlert(data.mess);
            handleClickAlert('success');
          }
          else {
            setOpenBackDrop(false);
            setMessageAlert(data.title);
            handleClickAlert('error');
          }
        })
        .catch((error) => {
          setOpenBackDrop(false);
          setMessageAlert(error.message);
          handleClickAlert('warning');
        });
    }
    return (
      <div>
        <Dialog open={openNewCourseDialog} fullWidth={true}
          maxWidth={'lg'} onClose={handleCloseNewCourseDialog}>
          <DialogTitle textAlign={'center'}>New Course</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Course Title"
              type="text"
              fullWidth
              variant="standard"
              name='subject'
              onChange={handleChangeNewCourse}
            />
            <Stack direction="row" spacing={2} marginTop={4} marginBottom={4}
              justifyContent="center"
              alignItems="center"
            >
              <FormControl fullWidth>
                <RadioGroup
                  row
                  value={newCourseStatus}
                  name="Status"
                  onChange={handleChangeNewCourseStatus}
                >
                  <FormControlLabel value="Online" control={<Radio />} label="Online" />
                  <FormControlLabel value="Offline" control={<Radio />} label="Offline" />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-price">Price per Lesson</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-price"
                  type="number"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Price per Lesson"
                  name='price'
                  onChange={handleChangeNewCourse}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-part-number">Max Participant Number</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-part-number"
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">
                      <GroupsIcon />
                    </InputAdornment>}
                  label="Max Participant Number"
                  name='maxParticipantNumber'
                  onChange={handleChangeNewCourse}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-part-number">Course Image</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-part-number"
                  type="file"
                  startAdornment={
                    <InputAdornment position="start">
                      <AddPhotoAlternateOutlinedIcon />
                    </InputAdornment>}
                  label="Course_Image"
                  name='Photo'
                  onChange={handleChangeNewCoursePhoto}
                />
              </FormControl>
            </Stack>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Course Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline={true}
              minRows={5}
              name='description'
              onChange={handleChangeNewCourse}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewCourseDialog}>Cancel</Button>
            <Button onClick={handleSubmitNewCourse}>Post</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  //ModalComponent
  function MyModal() {
    return (
      <>
        <Stack spacing={2} direction="row">
          {isLogedIn ?
            (
              <>
                {localStorage.getItem('role') === "Tutor" ?
                  (
                    <>
                    <Button variant="outlined" color="inherit" onClick={handleClickOpenNewCourseDialog} endIcon={< AddCircleOutlineOutlinedIcon />}>New Course</Button>
                    <Button variant="outlined" color="inherit" onClick={handleOpenMyProfile} endIcon={< AccountCircleOutlinedIcon />}>My Profile</Button>
                    </>
                  )
                  :
                  (
                    <Typography>Student</Typography>
                  )
                }
                <Button variant="outlined" color="inherit" onClick={Logout} endIcon={< LogoutIcon />}>Log out</Button>
              </>
            )
            :
            (
              <>
                <Button startIcon={< LoginIcon />} onClick={() => { setActiveModal("login"); handleOpenModal() }} color="inherit">Log in</Button>
                <Button onClick={() => { setActiveModal("register"); handleOpenModal() }} color="inherit">Register</Button>
              </>
            )
          }
        </Stack>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
        >
          {activeModal === 'login' ? <Login /> : <Register />}
        </Modal>
      </>
    )
  }

  function EditProfileModal() {
    const [inputs, setInputs] = React.useState({});
    const handleChangeInputs = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({ ...values, [name]: value }))
    }
    const [profileAvatar, setProfileAvatart] = React.useState([]);
    const handleChangeProfileAvatar = (event) => {
      setProfileAvatart(event.target.files[0]);
    }
    async function handleSubmit() {
      setOpenBackDrop(true);
      let formData = new FormData();
      formData.append("Id", localStorage.getItem('id'));
      for (let name in inputs) {
        formData.append(name, inputs[name]);
      }
      formData.append("Photo", profileAvatar);
      try {
        const response = await fetch("https://localhost:7172/api/Users/EditTutorProfile", {
          method: "PUT",
          body: formData,
        })
        if (!response.ok) {
          setOpenBackDrop(false);
          setMessageAlert('Server error');
          handleClickAlert('error');
        }
        setOpenBackDrop(false);
        handleCloseEditProfileModal();
        setMessageAlert('Profile Edited Successfully!');
        handleClickAlert('success');
      } catch (error) {
        setOpenBackDrop(false);
        setMessageAlert(error.message);
        handleClickAlert('warning');
      }
    }
    return (
      <Dialog
        open={openEditProfileModal}
        fullWidth={true}
        maxWidth='md'
        onClose={handleCloseEditProfileModal}
      >
        <DialogTitle
          sx={
            {
              display: 'flex',
              justifyContent: 'space-between'
            }
          }
        >
          <Button variant="text" onClick={handleCloseEditProfileModal}>Cancel</Button>
          <Typography variant='h6'>
            Editing Profile...
          </Typography>
          <Button variant="text" onClick={handleSubmit}>Submit</Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description"
            sx={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }
          >
            <InputLabel htmlFor="EditAvatar">
              <Avatar alt="TutorPhoto" sx={{ width: 140, height: 140 }}>
                <EditIcon />
              </Avatar>
            </InputLabel>
            <Input
              id="EditAvatar"
              type="file"
              label="Course_Image"
              name='Photo'
              sx={{ display: 'none' }}
              onChange={handleChangeProfileAvatar}
            />
            <TextField type='text' id="standard-basic" label="Name" variant="standard" name="Name" onChange={handleChangeInputs} />
            <TextField type='text' id="standard-basic" label="Occupation" variant="standard" name='Occupation' onChange={handleChangeInputs} />
            <TextField type='text' fullWidth label="About Me" id="fullWidth" variant="standard" multiline rows={5} name='AboutMe' onChange={handleChangeInputs} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
  const MyProfile = () => {
    const [courses, setCourses] = useState([]);
    const handleCourse = (data) => {
      setCourses(data);
    }
    const [tutor, setTutor] = useState({});
    const handleTutor = (data) => {
      setTutor(data);
    }
    async function GetListOfCourses() {
      await fetch("https://localhost:7172/api/Courses/GetCourseForTutor/" + localStorage.getItem('id'))
        .then((response) => response.json())
        .then((data) => {
          handleCourse(data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    async function GetTutorProfile() {
      await fetch("https://localhost:7172/api/Users/GetTutorProfile/" + localStorage.getItem('id'))
        .then((response) => response.json())
        .then((data) => {
          handleTutor(data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }



    useEffect(() => {
      GetListOfCourses();
      GetTutorProfile();
    }, [])

    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    });
    return (
      <Dialog
        open={openMyProfile}
        fullWidth={true}
        maxWidth='md'
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseMyProfile}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={
            {
              display: 'flex',
              justifyContent: 'space-between'
            }
          }
        >
          <Rating name="read-only" size='large' value={tutor.rating} readOnly />
          <Button startIcon={<EditIcon />} onClick={handleOpenEditProfileModal}>
            Edit Profile
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description"
            sx={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }
          >
            <Avatar alt="TutorPhoto" src={`data:image/png;base64,${tutor.photo}`} sx={{ width: 140, height: 140 }} />
            <Typography variant="h5">
              {tutor.name}
            </Typography>
            <Typography variant="h7" color='#555555'>
              {tutor.occupation}
            </Typography>
            <hr width='300' />
            <Typography fontSize={14} color="#000000">
              {tutor.aboutMe}
            </Typography>
          </DialogContentText>
          <Divider>
            <Chip label="Courses:" color="primary" />
          </Divider>

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {courses &&
              courses.map((course) => {
                return (
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar variant='rounded' alt="Course Photo" src={`data:image/png;base64,${course.photo}`} sx={{ width: 50, height: 50 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={course.subject}
                      secondary={
                        <Typography sx={{ display: "flex", flexDirection: "row", gap: '30px' }} variant="body2">
                          <Typography sx={{ color: '#000099' }} variant="body2" >
                            {'Status: ' + course.status}
                          </Typography>
                          <Divider orientation="vertical" flexItem />
                          <Typography sx={{ color: '#000099' }} variant="body2" >
                            {'Participats: ' + course.currentParticipantNumber + '/' + course.maxParticipantNumber}
                          </Typography>
                          <Divider orientation="vertical" flexItem />
                          <Typography sx={{ color: '#000099' }} variant="body2" >
                            {'Price: ' + course.price + '$ per lesson'}
                          </Typography>
                        </Typography>
                      }
                    />
                    <Stack direction="row" spacing={1}>

                      <IconButton onClick={() => {
                        try {
                          const response = fetch("https://localhost:7172/api/Courses/Delete/" + course.id, {
                            method: "DELETE"
                          })
                          if (!response.ok) {
                            setOpenBackDrop(false);
                            setMessageAlert('Server error');
                            handleClickAlert('error');
                          }
                          setOpenBackDrop(false);
                          handleCloseEditProfileModal();
                          setMessageAlert('Course Deleted Successfully!');
                          handleClickAlert('success');
                        } catch (error) {
                          setOpenBackDrop(false);
                          setMessageAlert(error.message);
                          handleClickAlert('warning');
                        }
                      }} aria-label="delete" sx={{ color: '#990000' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                )
              })
            }
          </List>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <>
      <Head>

      </Head>
      <Box sx={{ flexGrow: 0, position: 'sticky', top: 0 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              BilimShare
            </Typography>
            <MyModal />
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={1000} onClose={handleCloseAlert} TransitionComponent={TransitionDown}>
        <Alert onClose={handleCloseAlert} severity={statusAlert} sx={{ width: '100%' }}>
          {messageAlert}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <NewCourseFormDialog />
      <EditProfileModal />
      <MyProfile />
      <div style={divStyle}>
        <ListOfCourse isLoggedIn={isLogedIn}/>
      </div>
    </>
  )
}
