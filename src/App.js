import React, { useState } from 'react';
import { ButtonBase,Button, ButtonGroup, Divider, makeStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { Typography } from '@material-ui/core';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';
import Timeline from './components/Timeline';
import Heatmap from './components/Heatmap';
import VISGallery from './components/VISGallery';
import DesignPattern from './components/DesignPattern'
import {
  BrowserRouter as Router,
  Switch,
  // Route,
  // Link
} from "react-router-dom";
import { Route, MemoryRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  App: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  appBar: {
    height: '8%',
    width: '100%',
  },
  mainView: {
    width: '100%',
    height: '92%',
    display: 'flex',
  },
  leftView: {
    width: '30%',
    height: '100%',
    boxShadow: '0 0px 4px 4px rgba(176, 190, 197, 0.48)',
  },
  rightView: {
    width: '70%',
    height: '100%',
  },
  root: {
    height: '8%',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '0 0px 4px 4px rgba(176, 190, 197, 0.48)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: '1',
  },
  buttonGroup:{
    padding:'20px',
    marginRight: '15px'
  },
  button:{
    fontSize:'20px',
  },
  heading: {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: 'bold',
    fontSize: "32px",
    padding: '30px',
    margin: '30px'
  },
  linkNoraml: {
    margin: '10px',
    padding:'20px',
    fontSize: '0.875em',
    fontSize:'20px',
    letterSpacing: '0.02875em',
    textTransform: 'none',
    // textDecoration: "none",
    paddingBottom: 10,
    color: "black",
    // "&:active": {
    //   backgroundColor: "black"
    // }
  },
  linkSelected: {
    margin: '10px',
    padding:'20px',
    fontSize: '0.875em',
    fontSize:'20px',
    letterSpacing: '0.02875em',
    textTransform: 'none',
    // textDecoration: "none",
    paddingBottom: 10,
    borderBottom: "3px solid #3f51b5",
    color: "#3f51b5",
    // "&:active": {
    //   backgroundColor: "black"
    // }
  },
  logo: {
    margin: theme.spacing(2, 5),
    height: '3vh',
  },
  btnSelected: {
    padding:'12px',
    borderBottom: '2px solid #3f51b5'
  },
  btnNoraml: {
    padding: '12px',
  }
}))

function ButtonLink(props) {
  const { icon, primary, to, selectedLink, setSelectedLink } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );
  const classes = useStyles();
  // //console.log(selectedLink)
  return (
    <Button style={{borderRadius:0}} className={selectedLink === primary?classes.linkSelected:classes.linkNoraml} onClick={() => setSelectedLink(primary)} component={renderLink} >
        {primary}
    </Button>
  );
}

function App({ d }) {
  const classes = useStyles();
  const [selectedLink, setSelectedLink] = useState("Explorer");

  // const CustomLink = React.useMemo(
  //   () =>
  //     React.forwardRef((linkProps, ref) => (
  //       <Link ref={ref} to={to} {...linkProps} />
  //     )),
  //   [to],
  // );

  return (
    <MemoryRouter initialEntries={['/explorer']} initialIndex={0}>
      <div className={classes.App}>
        <div className={classes.root}>
          <Typography className={classes.heading}>Composite Visualization</Typography>
          
          <ButtonGroup className={classes.buttonGroup}>
            <ButtonLink to="/explorer" primary="Explorer" selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
            <ButtonLink to="/pattern" primary="Design Patterns"  selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
          </ButtonGroup>
        </div>
        <Switch>
          <Route path="/explorer">
            <div className={classes.mainView}>
              <div className={classes.leftView}>
                <SearchBar />
                <Filter />
                <Divider />
                <Timeline />
                <Divider />
                <Heatmap />
              </div>
              <div className={classes.rightView}>
                <VISGallery />
              </div>
            </div>
          </Route>
          <Route path="/pattern">
            <DesignPattern />
          </Route>
        </Switch>
      </div>
      </MemoryRouter>
  );
}


export default inject('d')(observer(App));
