import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '8%',
        width:'100%',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 4px rgba(200, 200, 200, 1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems:'center',
        position: 'relative',
        zIndex: '0',
    },
    heading: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 'bold',
        fontSize: "32px",
        padding: '30px',
        margin: '30px'
    },
    logo: {
        margin: theme.spacing(2, 5),
        height: '3vh',
    }
}));

function AppBar({ d }) {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <Typography className={classes.heading}>Composite Visualization</Typography>
            <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/about">About</Link>
            </li>
            <li>
                <Link to="/topics">Topics</Link>
            </li>
            </ul>
        </div>
    );
}


export default inject('d')(observer(AppBar));