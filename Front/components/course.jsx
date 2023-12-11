import * as React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useEffect, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Chip from '@mui/material/Chip';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.info.dark, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.info.dark, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: 10,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export default function ListOfCourses({ isLoggedIn }) {
  const [openFeedback, setOpenFeedback] = React.useState(false);
  const [currentFeedback, setCurrentFeedback] = React.useState(0);

  function handleClickOpenFeedback(id) {
    if (isLoggedIn) {
      setCurrentFeedback(id);
      setOpenFeedback(true);
      GetFeedbacks(id);
    }
    else {
      setMessageAlert("Please Log In or Sign Up.");
      handleClickAlert('warning');
    }
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
  };
  const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
  const [messageAlert, setMessageAlert] = React.useState("Unkown Error.");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [statusAlert, setStatusAlert] = React.useState('info');

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

  function FeedbackFormDialog(courseId) {
    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);

    const [comment, setComment] = React.useState("");
    const handleChangeComment = (event) => {
      setComment(event.target.value);
    }

    const handleSubmitFeedback = (event) => {
      fetch("https://localhost:7172/api/Feedback/PostFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AuthotId: parseInt(localStorage.getItem("id")),
          Stars: value,
          Comment: comment,
          TargetId: currentFeedback
        }),
      })
        .then((response) => {
          if (response.ok) {
            setMessageAlert("Feedback Submited.");
            handleClickAlert('success');

          }
          else {
            setMessageAlert("There was some error on client side.");
            handleClickAlert('error');
          }
        })
        .catch((error) => {
          setMessageAlert("There was some error on server side.");
          handleClickAlert('warning');
        });
    }

    return (
      <Dialog fullWidth scroll='paper'
        maxWidth={'sm'} open={openFeedback} onClose={handleCloseFeedback}>
        <DialogTitle>
          <Typography variant="h6">Feedback From</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              size="large"
              precision={1}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
              <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Comment"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={2}
              maxRows={4}
              onChange={handleChangeComment}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center' }}>Other Feedbacks:</Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {feedbacks &&
              feedbacks.map((feedback) => {
                return (
                  <>
                    <ListItem sx={{ width: '100%' }} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`data:image/png;base64,${feedback.authorAvatar}`} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              sx={{ display: 'inline', marginRight: '20px' }}
                              component="span"
                              variant="h6"
                              color="text.primary"
                            >
                              {feedback.authorName}
                            </Typography>
                            <Rating name="read-only" size="small" value={feedback.stars} readOnly />
                          </>
                        }
                        secondary={
                          <React.Fragment>
                            {feedback.comment}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </>
                )
              })
            }
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseFeedback}>Cancel</Button>
          <Button onClick={handleSubmitFeedback}>POST</Button>
        </DialogActions>
      </Dialog>
    );
  }
  const [courses, setCourses] = useState([]);
  const handleCourse = (data) => {
    setCourses(data);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetch("https://localhost:7172/api/Courses/SearchCourse?" + new URLSearchParams({
        q: event.target.value
      }))
        .then((response) => response.json())
        .then((data) => {
          if (data.length == 0) {
            setMessageAlert("No Results.");
            handleClickAlert('warning');
            GetList();
          }
          else {
            handleCourse(data);
          }
        })
        .catch((error) => {
          console.log("Fetch Error.");
        });
    }

  }

  async function GetList() {
    await fetch("https://localhost:7172/api/Courses/GetCourse")
      .then((response) => response.json())
      .then((data) => {
        handleCourse(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const [feedbacks, setFeedbacks] = React.useState([]);
  function handleFeedback(d) {
    setFeedbacks(d)
  }
  async function GetFeedbacks(courseId) {
    await fetch("https://localhost:7172/api/Feedback/GetFeedbacksForCourse?Id=" + courseId)
      .then((response) => response.json())
      .then((data) => {
        handleFeedback(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  useEffect(() => {
    GetList();
  }, [])


  const [minPrice, setMin] = React.useState(0);
  const [maxPrice, setMax] = React.useState(20);
  async function openSortAndFilter() {
    await fetch("https://localhost:7172/api/Courses/GetMaxMinOfPrice")
      .then((response) => response.json())
      .then((data) => {
        setMin(data.min);
        setMax(data.max);
      })
      .catch((error) => {
        console.log(error.message);
      });
    let x = document.getElementById('sortAndFilter');
    if (x.style.display === 'flex') {
      x.style.display = 'none';
    }
    else {
      x.style.display = 'flex';
    }
  }

  const [valueSort, setValueSort] = React.useState("Reverse-Date");
  const handleChangeSort = (event) => {
    setValueSort(event.target.value);
  };
  const [valueFilterByStatus, setValueFilterByStatus] = React.useState("Both");
  const handleChangeFilterByStatus = (event) => {
    setValueFilterByStatus(event.target.value);
  };
  const [valueFilterPrice, setValueFilterPrice] = React.useState([0, 20]);

  const handleChangeFilterPrice = (event, newValue) => {
    setValueFilterPrice(newValue);
  };

  async function applySortAndFilter() {
    await fetch("https://localhost:7172/api/Courses/GetCourse?valueSort=" + valueSort +
      "&FilterByStatus=" + valueFilterByStatus +
      "&FilterByPriceMin=" + valueFilterPrice[0] +
      "&FilterByPriceMax=" + valueFilterPrice[1])
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          setMessageAlert("No Results.");
          handleClickAlert('warning');
        }
        else {
          handleCourse(data);
        }

      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  const marks = [
    {
      value: 0,
      label: 'Min',
    },
    {
      value: 20,
      label: 'Max',
    }
  ];

  const [openMyProfile, setOpenMyProfile] = React.useState(false);
  const handleOpenMyProfile = (id) => {
    setOpenMyProfile(true);
    GetTutorProfile(id);
  }
  const handleCloseMyProfile = () => {
    setOpenMyProfile(false)
  }
  const [tutor, setTutor] = useState({});
  const handleTutor = (data) => {
    setTutor(data);
  }
  async function GetTutorProfile(id) {
    await fetch("https://localhost:7172/api/Users/GetTutorProfile/" + id)
      .then((response) => response.json())
      .then((data) => {
        handleTutor(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  const MyProfile = () => {
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

        </DialogContent>
      </Dialog>
    )
  }

  const [openGetContactDialog, setOpenGetContactDialog] = React.useState(false);

  const handleClickOpenGetContactDialog = (id) => {
    setOpenGetContactDialog(true);
    GetTutorProfile(id);
  };

  const handleCloseGetContactDialog = () => {
    setOpenGetContactDialog(false);
  };
  function GetContactDialog() {
    return (
      <div>
        <Dialog
          open={openGetContactDialog}
          onClose={handleCloseGetContactDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Contact with "+tutor.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Here the Email address: "+tutor.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseGetContactDialog} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Search sx={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '30px'
        }}>
          <Button variant="outlined" onClick={openSortAndFilter}>
            Sort and Filter
          </Button>

          <Divider orientation="vertical" flexItem />

          <StyledInputBase
            placeholder="Search…"
            onKeyDown={handleKeyDown}
            inputProps={{ 'aria-label': 'search' }}
          />

        </Search>
        <Box id='sortAndFilter' sx={{ display: 'none', flexDirection: 'column', width: '600px' }}>
          <div>
            <FormControl sx={{ width: '50%' }}>
              <FormLabel id="demo-radio-buttons-group-label">Sort by Name:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="valueSort"
                value={valueSort}
                onChange={handleChangeSort}
              >
                <FormControlLabel value="Name" control={<Radio />} label="alphabetical descending" />
                <FormControlLabel value="Reverse-Name" control={<Radio />} label="alphabetical ascending" />
                <FormLabel id="demo-radio-buttons-group-label">Sort by Date:</FormLabel>
                <FormControlLabel value="Date" control={<Radio />} label="chronological" />
                <FormControlLabel value="Reverse-Date" control={<Radio />} label="reverse-chronological" />

              </RadioGroup>

            </FormControl>

            <FormControl sx={{ width: '50%' }}>
              <FormLabel id="demo-radio-buttons-group-label">Filter by Status:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="FilterByStatus"
                value={valueFilterByStatus}
                onChange={handleChangeFilterByStatus}
              >
                <FormControlLabel value="Online" control={<Radio />} label="Online" />
                <FormControlLabel value="Offline" control={<Radio />} label="Offline" />
                <FormControlLabel value="Both" control={<Radio />} label="Both" />
              </RadioGroup>
              <FormLabel id="demo-radio-buttons-group-label">Filter by Price:</FormLabel>
              <Slider
                value={valueFilterPrice}
                onChange={handleChangeFilterPrice}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={minPrice}
                max={maxPrice}
              />

            </FormControl>
          </div>

          <Stack direction="row" justifyContent={'space-around'}>
            <Button variant="outlined" onClick={openSortAndFilter}>Close</Button>
            <Button variant="outlined" onClick={GetList}>Reset</Button>
            <Button variant="outlined" onClick={applySortAndFilter}>Apply</Button>
          </Stack>
        </Box>
      </div>
      {courses &&
        courses.map((course) => {
          return (
            <Card sx={{ maxWidth: 600, margin: 2 }}>
              <CardHeader
                title={course.subject}
                subheader={
                  <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} variant="body2" color="text.secondary">
                    <Typography sx={{}} variant="body2" color="text.secondary">
                      {'Status: ' + course.status}
                    </Typography>
                    <Typography sx={{}} variant="body2" color="text.secondary">
                      {'MaxParticipats: ' + course.maxParticipantNumber}
                    </Typography>
                    <Typography sx={{}} variant="body2" color="text.secondary">
                      {'Price: ' + course.price + '$/lesson'}
                    </Typography>
                    <Typography sx={{}} variant="body2" color="text.secondary">
                      {'Tutor: '}
                      <Link
                        onClick={
                          () => {
                            handleOpenMyProfile(course.tutorId);
                          }
                        }
                        underline="hover" color='text.secondary'>
                        {course.tutorName}
                      </Link>
                    </Typography>
                  </Typography>
                }
              />
              < CardMedia
                component="img"
                height="400"
                image={`data:image/png;base64,${course.photo}`}
                alt="Course Image"
              />
              <CardContent sx={{ minWidth: 600 }}>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 5 }} variant="body2" color="text.secondary">
                  {'Published: ' + course.publishedDate}
                </Typography>
              </CardContent>
              <CardActions spacing={5} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                  <Button onClick={
                    () => {
                      handleClickOpenGetContactDialog(course.tutorId);
                    }
                  }>
                    Get Contacts
                  </Button>

                  <Button onClick={
                    () => {
                      handleClickOpenFeedback(course.id);
                    }
                  }>
                    Feedback
                  </Button>
                </div>
                <div>
                  <Rating name="read-only" size="large" value={course.likesAmount} readOnly />
                </div>
              </CardActions>

            </Card >
          )
        })
      }
      <FeedbackFormDialog />
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={1000} onClose={handleCloseAlert} TransitionComponent={TransitionDown}>
        <Alert onClose={handleCloseAlert} severity={statusAlert} sx={{ width: '100%' }}>
          {messageAlert}
        </Alert>
      </Snackbar>
      <MyProfile />
      <GetContactDialog/>
    </>
  );
}