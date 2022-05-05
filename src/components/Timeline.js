import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Slider, } from '@material-ui/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '8%',
    marginBottom: '5px',
  },
  bar: {
    marginTop: '1.8%',
    height: '70%',
    width: '100%',
  },
  slider: {
    marginLeft: '7%',
    marginRight: '9%',
  }
}));

const PrettoSlider = withStyles({
  root: {
    color: 'primary',
    height: 8,
    padding: '7px',
    // marginBottom: '5px',
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -2,
    marginLeft: -6,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% - 8px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function Timeline({ d }) {
  const classes = useStyles();
  const xAxisData = Object.keys(d.imagesYearList);
  const data = Object.keys(d.imagesYearList).map((key) => {
    return d.imagesYearList[key]
  })


  const option = {
    title: {},
    tooltip: {
    },
    legend: {},
    grid: {
      left: '4%',
      right: '4%',
      top: 0,
      bottom: '0px',
    },
    xAxis: {
      show: false,
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      show: false,
    },
    series: [{
      type: 'bar',
      data: data,
      itemStyle:{
        color:'#afafaf'
      }
    }]
  };

  let timeLine;

  React.useEffect(() => {
    const echarts = require("echarts");
    if (timeLine !== null && timeLine !== "" && timeLine !== undefined) {
      timeLine.dispose();//销毁
    }

    timeLine = echarts.init(document.getElementById('bar_chart'));
    timeLine.setOption(option);
    window.addEventListener('resize', () => {
      timeLine.resize()
    })
    timeLine.off('click');
    timeLine.on('click', (params) => {
      d.changeFilterYears(params, [params.name, params.name]);
      d.changeFilterYearsCommit();
    })
  }, [option]);

  return (
    <div className={classes.root}>
      <div className={classes.bar} id='bar_chart'></div>
      <div className={classes.slider}>
        <PrettoSlider
          min={2006}
          max={2020}
          value={d.filterState.years}
          onChange={d.changeFilterYears}
          onChangeCommitted={d.changeFilterYearsCommit}
          aria-labelledby="discrete-slider-custom"
          step={1}
          valueLabelDisplay="on"
        >
        </PrettoSlider></div>
    </div>
  );
}


export default inject('d')(observer(Timeline));