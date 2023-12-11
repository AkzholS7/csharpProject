import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from "react";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    justifySelf: 'left',
    marginRight: 350,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: '400px',
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
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function SearchFeild() {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetch("https://localhost:7172/api/Courses/SearchCourse?" + new URLSearchParams({
            q: event.target.value
        }))
            .then((response) => response.json())
            .then((data) => {
                handleCourse(data);
                console.log(courses);
            })
            .catch((error) => {
                console.log("Fetch Error.");
            });
          }
        
    }
 
    return (
        <>
            <IconButton aria-label="delete" color='inherit'>
                <SortOutlinedIcon />
            </IconButton>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    type='search'
                    name='q'
                    onKeyDown={handleKeyDown}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
        </>
    )
}