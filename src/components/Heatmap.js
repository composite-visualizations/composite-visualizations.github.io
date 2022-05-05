import React from 'react';
import { makeStyles, createMuiTheme, createStyles, withStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import OverviewTab from './OverviewTab.js'
import { Button } from '@material-ui/core';
import { LabelToName, ReverseLabelToName } from "../store/Categories";
import echarts from 'echarts/lib/echarts';
import closeIcon from '../resource/closeIcon.png'
import 'echarts/lib/chart/heatmap';

const useStyles = makeStyles((theme) => (
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }), {

    root: {
      width: '100%',
      height: '66%',
      position: 'relative',
    },
    optionWrap: {
      position: 'relative',
      zIndex: 99,
      display: 'flex',
    },
    optionbar: {

    },
    checkbox: {

    },
    heatmapWrap: {
      width: '30vw',
      height: '90%',
    },
    heatmap: {
      zIndex: 1,
      width: '100%',
      height: '100%',
    },
    bar: {
      width: '100%',
      height: '38%',
    },
    icon: {
      marginLeft: '5%',
    },
    btnGrp: {
      justifyContent: 'flex-end'
    },
    OverviewTab: {
    }
  }));

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#2179B6',
      main: '#2179B6',
      dark: '#2179B6',
      // contrastText: '#fff',
    },
  },
});



function Heatmap({ d }) {
  const classes = useStyles();


  const transformLabel = (value) => {
    switch (value) {
      case 'coOccurrence': return 'Co-occurrence';
      case 'juxtaposed': return 'Juxtaposed';
      case 'overlaid': return 'Overlaid';
      case 'nested': return 'Nested';
      default: return;
    }
  }

  const getClientBarData = () => {
    return Object.keys(d.heatmapData).map((client) => {
      let cnt = [];
      Object.keys(d.heatmapData[client]).forEach(host => {
        cnt = [...cnt, ...d.heatmapData[client][host]]
      })
      return new Set(cnt).size;
    })
  }

  const getHostBarData = () => {
    let hostResult = {}
    Object.keys(d.heatmapData).forEach((client, idx) => {
      Object.keys(d.heatmapData[client]).forEach(host => {
        if (idx === 0) hostResult[host] = []
        hostResult[host] = [...hostResult[host], ...d.heatmapData[client][host]]
      })
    })
    return Object.keys(hostResult).map(host => {
      return new Set(hostResult[host]).size
    })
  }

  //option for heatmap
  const option = {
    tooltip: {
      position: 'top',
      trigger: 'item',
      formatter: params => {
        if (params.seriesType === 'heatmap') {
          const data = params.data;
          if (!data) return//sometimes params don't have proper data
          return `${data[2]} results</br>` + params.marker +
            // `${d.dataState.balanced ? '' : 'Child: '}${d.indexToClient[data[0]]}</br>` +
            // params.marker + `${d.dataState.balanced ? '' : 'Parent: '}${d.indexToHost[data[1]]}`
            `${'Child: '}${LabelToName[d.indexToClient[data[0]]]}</br>` +
            params.marker + `${'Parent: '}${LabelToName[d.indexToHost[data[1]]]}`
        }
        else {//bars' tooltip
          return params.marker + `${params.name} ${params.data}`
        }
      }
    },
    grid: [{
      top: '30%',//heatmap postion
      left: '30%',
      right: '7%',
      bottom: '10%',
    }, {
      top: '3%',//client bar postion
      bottom: '70%',
      left: '30%',
      right: '7%',
    }, {
      left: '3%',//host bar postion
      top: '30%',
      right: '70%',
      bottom: '10%',
    },],
    xAxis: [{
      gridIndex: 0,//heatmap xAixs
      show: false,
      type: 'category',
      data: Object.keys(d.filteredVisType).map(visType => {
        return LabelToName[visType]
      }),
      inverse: true,
    }, {
      show: false,//client bar xAixs
      gridIndex: 1,
      type: 'category',
      data: Object.keys(d.filteredVisType).map(visType => {
        return LabelToName[visType]
      }),
      inverse: true,
    }, {
      gridIndex: 2,//host bar xAixs
      show: false,
      inverse: true,
    }],
    yAxis: [{
      gridIndex: 0,//heatmap yAixs
      show: false,
      type: 'category',
      data: Object.keys(d.filteredVisType).map(visType => {
        return LabelToName[visType]
      }),
    }, {
      gridIndex: 1,//client bar yAixs
      show: false,
    }, {
      show: false,//host bar yAixs
      gridIndex: 2,
      type: 'category',
      data: Object.keys(d.filteredVisType).map(visType => {
        return LabelToName[visType]
      })
    }],
    visualMap: {
      // type: 'continuous',
      show: false,
      seriesIndex: 0,
      inRange: {
        color: ['#ffffff', d.dataState.matrixColor],//this array determine the heatmap's color
      },
      min: 0,
      max: 10,
    },
    dataZoom: [{
      type: 'inside',//inside type means you can use mouse wheel
      xAxisIndex: [0, 1],
      filterMode: 'none',
    }, {
      type: 'inside',//inside type means you can use mouse wheel
      yAxisIndex: [0, 2],
      filterMode: 'none',
    }, {
      show: true,
      realtime: true,
      filterMode: 'none',
      xAxisIndex: [0, 1],//bind axis
      left: '30%',
      top: '91%',
      bottom: '5%',
      right: '7%',
    }, {
      show: true,
      realtime: true,
      filterMode: 'none',
      yAxisIndex: [0, 2],//bind axis
      left: '94%',
      top: '30%',
      bottom: '10%',
      right: '2%',
    }],
    series: [{
      name: 'composization',
      type: 'heatmap',
      data: d.heatmapViewData,
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        borderWidth: '0.5',
        borderColor: '#ffffff'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 5)'
        }
      },
    }, {
      name: 'ClientBar',
      label: {
        show: 'true',
        color: '#6F6F6F',
        formatter: '{b}',
        rotate: 90,
        position: 'insideBottom',
        verticalAlign: 'middle',
        align: 'top'
      },
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      barCategoryGap: '1px',
      itemStyle: {
        color: '#f1f1f1',
      },
      emphasis: {
        itemStyle: {
          color: '#f1f1f1',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 5)'
        }
      },
      // showBackground: true,
      // backgroundStyle: {
      //   color: 'rgba(180, 180, 180, 0.2)'
      // },
      data: getClientBarData(),
    }, {
      name: 'HostBar',
      label: {
        show: true,
        color: '#6F6F6F',
        formatter: '{b}',
        position: 'insideRight',
      },
      xAxisIndex: 2,
      yAxisIndex: 2,
      type: 'bar',
      barCategoryGap: '1px',
      itemStyle: {
        color: '#f1f1f1',
      },
      emphasis: {
        itemStyle: {
          color: '#f1f1f1',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 5)'
        }
      },
      // showBackground: true,
      // backgroundStyle: {
      //   color: 'rgba(180, 180, 180, 0.2)',
      // },
      data: getHostBarData(),
    },]
  };

  const barOption = {
    title: {//example: Host: bar_chart
      text: `${d.detailsBar.type}: ${LabelToName[d.detailsBar.visType]}`,
      left: 15
    },
    toolbox: {
      show: true,
      right: '15px',
      iconStyle: {
        color: '#515151',
        borderColor: null,
      },
      feature: {
        myTool2: {// close detailsBar
          show: true,
          right: 50,
          title: 'close',
          icon: 'path d="M0.355223 0.40915C0.843863 -0.115599 1.52415 -0.156779 2.1215 0.40915L6.50133 4.81775L10.8812 0.40915C11.4785 -0.156779 12.1599 -0.115599 12.6452 0.40915C13.1338 0.932724 13.1024 1.8175 12.6452 2.30931C12.1902 2.80112 7.38334 7.60622 7.38334 7.60622C7.26888 7.73077 7.13169 7.82982 6.97995 7.89748C6.82822 7.96513 6.66506 8 6.50021 8C6.33535 8 6.17219 7.96513 6.02046 7.89748C5.86873 7.82982 5.73153 7.73077 5.61707 7.60622C5.61707 7.60622 0.812482 2.80112 0.355223 2.30931C-0.103157 1.8175 -0.133417 0.932724 0.355223 0.40915Z',
          // onclick: () => {
          //   document.getElementById('heatmap_wrap').style.height = '90%';//echarts is in canvas,So I simply resize the wrap
          //   d.resetDetailsBar();
          // }
        }
      }
    },
    dataZoom: [{
      start: 70,//detailsBar's dataZoom
      end: 100,
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'none',
      left: '94%',
      top: '12%',
      bottom: '10%',
      right: '2%'
    },
    {
      type: 'inside',
      yAxisIndex: 0,
      filterMode: 'none'
    },
    ],
    tooltip: {
      position: 'top',
    },
    grid: {
      top: '12%',//position
      bottom: 0,
      left: '30%',
      // right: 0,
    },
    yAxis: {
      show: true,
      type: 'category',
      data: d.detailsBarData.map(dict => {
        if (d.detailsBar.type === 'Parent')
          return LabelToName[d.indexToClient[dict.idx]]
        else if (d.detailsBar.type === 'Child')
          return LabelToName[d.indexToHost[dict.idx]]
      }),
    },
    xAxis: {
      show: false,
    },
    series: {
      name: 'DetailsBar',
      type: 'bar',
      data: d.detailsBarData.map(dict => {
        return dict.num
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 5)'
        }
      },
    }
  }



  React.useEffect(() => {
    const echarts = require("echarts");
    let myChart = echarts.init(document.getElementById('heat_map'));
    myChart.setOption(option);
    myChart.off('click');//if not off, echarts will rerender for many times
    myChart.on('click', (params) => {
      // //console.log(params)
      if (params.seriesType === 'bar') {
        // d.detailsBar.visType = ReverseLabelToName[params.name];
        // d.detailsBar.show = true;
        d.detailsBar.type = params.seriesIndex === 1 ? 'Child' : 'Parent';
        // d.updateDetailsBarData();
        // document.getElementById('heatmap_wrap').style.height = '50%';//echarts is in canvas,So I simply resize the wrap
        // myChart.resize();
        d.detailsBar.type === 'Child' ? d.updateImgList(ReverseLabelToName[params.name], null) : d.updateImgList(null, ReverseLabelToName[params.name])//Client:Host

        // d.highlightIndexList = params.seriesIndex === 1 ? Object.keys(d.filteredVisType).map((visType, index) => {
        //   return index + params.dataIndex * Object.keys(d.filteredVisType).length;
        // }) : Object.keys(d.filteredVisType).map((visType, index) => {
        //   return index * Object.keys(d.filteredVisType).length + params.dataIndex;
        // })
      } 
      else if (params.seriesType === 'heatmap') {
        const value = params.value;
        if (value[2] == 0) return;
        const client = d.indexToClient[value[0]];
        const host = d.indexToHost[value[1]];
        // //console.log(client, host)
        d.updateImgList(client, host)
        // d.highlightIndexList = params.dataIndex
      }
    })
    window.addEventListener('resize', () => {//resize when window resize
      myChart.resize()
    })
    if (!d.detailsBar.show) {//resize when click detailBar's close button
      myChart.resize()
    }
    myChart.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: [1, 2],
      // start: 50,
      start: 0,
      end: 100,
    })
    myChart.dispatchAction({//close existed highlight
      type: 'downplay',
    })
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: d.highlightIndexList
    })
  }, [option, d.detailsBar.show, d.detailsBar.select, d.highlightIndexList, d.dataState.matrixColor]);

  // React.useEffect(() => {
  //   const echarts = require("echarts");
  //   let detailsBar = echarts.init(document.getElementById('details_bar'));
  //   detailsBar.setOption(barOption);
  //   detailsBar.off('click');//if not off, echarts will rerender for many times
  //   detailsBar.on('click', (params) => {
  //     // //console.log(params)
  //     if (d.detailsBar.type === 'Child') {
  //       d.updateImgList(d.detailsBar.visType, ReverseLabelToName[params.name])
  //     } else if (d.detailsBar.type === 'Parent') {
  //       d.updateImgList(ReverseLabelToName[params.name], d.detailsBar.visType)
  //     }
  //   })
  //   window.addEventListener('resize', () => {//resize when window resize
  //     detailsBar.resize()
  //   })
  // }, [barOption, d.detailsBar.show]);



  return (
    <div className={classes.root}>
      <div className={classes.optionWrap}>
        <OverviewTab className={classes.OverviewTab}></OverviewTab>
      </div>
      <div className={classes.heatmapWrap} id='heatmap_wrap'>
        <div className={classes.heatmap} id='heat_map'></div>
      </div>

      {/* <div className={classes.bar} id='details_bar'></div> */}
    </div>
  );
}


export default inject('d')(observer(Heatmap));