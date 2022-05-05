import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Card, Input, Popover, Typography, MenuItem, IconButton, ListItemText, Checkbox } from '@material-ui/core';
import { Search, ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '15px 0 0 0px',
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '7%',
  },
  container: {
    // margin: '2.5%',
    // marginBottom: '0%',
    // margin: '5%',
    margin: '0 25px 0 25px',
    padding: '0px 20px 0px 20px',
    width: '92%',
    height: '80%',
    display: 'flex',
    justifyContent:'end',
    alignItems:'center',
    borderRadius: '50px'
  },
  icon: {
    margin: '0px 10px 0px 10px',
    // display: 'inline',
    width: '30px',
    height:'30px',
  },
  text: {
    width: '20%',
    display: 'inline',
  },
  select: {
    width: '10%',
  },
  input: {
    minWidth: '55%',
    maxWidth: '100%',
  },
  img: {

  },
  formControl: {

  },
  option: {
    textTransform: 'capitalize',
  }
}));

function SearchBar({ d }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // const resetSearchImg = () => {

  // };

  // const showDeleteIcon = () => {

  // };

  const handleClick = (e) => {
    setAnchorEl(document.getElementById('search_achorel'));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      d.updateSearchWords(e.target.value);
      d.updateFilteredImagesData();
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={classes.root}>
      <Card className={classes.container} variant="outlined">
        <IconButton className={classes.icon} onClick={handleClick} ><Search /></IconButton>
        <Typography className={classes.text} onClick={handleClick} id='search_achorel'>{d.filterState.filterBarState.searchState || 'Search All'}</Typography>
        <IconButton className={classes.icon} onClick={handleClick} ><ExpandMore /></IconButton>
        <Input className={classes.input} onKeyDown={handleInput}></Input>
        {/* <img alt='' src={d.searchImg} onClick={resetSearchImg} onHover={showDeleteIcon}></img> */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}>
          {/* <MenuItem selected={d.filterStateSelected('searchState') === Object.keys(d.filterState.searchState).length} onClick={() => d.changeFilterState('searchState','All')}>{'All'}</MenuItem> */}
          <MenuItem className={classes.option} selected={d.filterStateSelected('searchState') === Object.keys(d.filterState['searchState']).length} onClick={() => d.changeFilterState('searchState', 'All')}><ListItemText primary={'Select All'}/><Checkbox checked={d.filterStateSelected('searchState') === Object.keys(d.filterState['searchState']).length}/></MenuItem>
          {['keywords', 'title', 'abstract'].map((name) => {
            return <MenuItem className={classes.option} selected={d.filterState.searchState[name]} onClick={() => d.changeFilterState('searchState',name)} key={name}><ListItemText primary={name}/><Checkbox checked={d.filterState['searchState'][name]}/></MenuItem>
          })}
        </Popover>
      </Card>
    </div >
  );
}


export default inject('d')(observer(SearchBar));