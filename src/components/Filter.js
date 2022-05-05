import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Typography, Grid } from '@material-ui/core';
import FilterCard from './FilterCard'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '15%',
    margin: '0 0px 0 0px'
  },
  grid: {
    width: '100%',
    height:'50%',
  },
  text: {
    textAlign: 'right',
    color: 'steelblue',
    marginTop: '2.5%',
    marginRight: '2.5%',
  },
}));

function Filter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container item xs={12} >
        <FilterCard className={classes.leftCard} key={'compFilter'} value={'Composition Type:'} />
        <FilterCard className={classes.rightCard} key={'visFilter'} value={'Visualization Type:'} />
      </Grid>
      <Grid className={classes.grid} container item xs={12} >
        <FilterCard className={classes.leftCard} key={'confFilter'} value={'Conference:'} />
        <FilterCard className={classes.rightCard} key={'authFilter'} value={'Authors:'} />
      </Grid>
      {/* <Typography className={classes.text}>{'Advanced filters→'}</Typography> */}
    </div>
  );
}


export default inject('d')(observer(Filter));