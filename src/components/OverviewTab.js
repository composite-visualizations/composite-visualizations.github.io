import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Tabs, Tab, Typography, Hidden, } from '@material-ui/core';
import repeatedIcon from '../resource/1.png';
import mirroredIcon from '../resource/2.png';
import stackedIcon from '../resource/3.png';
import annotatedIcon from '../resource/4.png';
import accompaniedIcon from '../resource/5.png';
import large_viewIcon from '../resource/6.png';
import coordinatedIcon from '../resource/7.png';
import nestedIcon from '../resource/8.png';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: '0px',
        height: '8vh'
    },
    tabs: {
        width: '100%'
    },
    tab: {
        textTransform: 'none',
        minWidth: '0px',
    },
    btnGrp: {
    },
    label: {
        display: 'flex',
        alignItems: 'center'
    },
    labelText: {
        fontSize: '0.875rem',
        letterSpacing: '0.02857em',
        lineHeight: 1.75,
        fontWeight: 500
    },
    img: {
        width: '42px',
        height: '42px',
        padding: '0 8px 0 0px'
    }
}));

const switchIcon = (relation) => {
    switch (relation) {
        case 'Repeated':
            return repeatedIcon
        case 'Mirrored':
            return mirroredIcon
        case 'Stacked':
            return stackedIcon
        case 'Large Panel':
            return large_viewIcon
        case 'Coordinated':
            return coordinatedIcon
        case 'Accompanied':
            return accompaniedIcon
        case 'Annotated':
            return annotatedIcon
        case 'Nested':
            return nestedIcon
        default:
            break;
    }
}

const StyledTabs = withStyles({
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      '& > span': {
        // position: 'absolute',
        position: 'relative',
        // bottom: '1px',
        height: '1.5px',
        // maxWidth: '180px',
        width: '180px',
        backgroundColor: '#3f51b5',
      },
    },
  })((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

function OverviewTab({ d }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [detailValue, setDetailValue] = React.useState(-1);
    const handleChange = (event, newValue) => {
        d.dataState.overviewDetailState = false;
        d.changeOverviewState(mapValue[event.target.textContent]);
        setValue(newValue);
        setDetailValue(-1);
        if(mapValue[event.target.textContent] === 'nested'){
            setDetailValue(0);
        }
    };

    const handleDetailChange = (event, newValue) => {
        // //console.log(event.target.id)
        event.target.textContent?d.dataState.overviewDetailState = mapValue[event.target.textContent]:d.dataState.overviewDetailState = mapValue[event.target.id];
        d.updateHeatmapData()
        setDetailValue(newValue);
    };

    const checkDisabled = (value) => {
        let cnt = 0
        if(d.filterState.filterType.compType === 'and' && d.filterStateSelected('compType') === 0)return false
        if (value === 'coOccurrence') {
            return false
        } else if (value === 'juxtaposed') {
            ['repeated', 'stacked', 'mirrored'].forEach(compType => {
                if (d.filterState.compType[compType] === false) cnt += 1
            })
            if (cnt === 3) return true
        } else if (value === 'overlaid') {
            ['large_view', 'annotated', 'coordinated', 'accompanied'].forEach(compType => {
                if (d.filterState.compType[compType] === false) cnt += 1
            })
            if (cnt === 4) return true
        } else if (value === 'nested') {
            return !d.filterState.compType[value]
        }
        return false
    }

    const checkDetailDisabled = (value) => {
        if(d.filterState.filterType.compType === 'and' && d.filterStateSelected('compType') === 0)return false
        value = mapValue[value]
        //console.log(value, d.filterState.compType[value])
        return !d.filterState.compType[value]
    }

    const getTabValue = () => {
        switch (value) {
            case 0: return [];
            case 1: return ['Repeated', 'Stacked', 'Mirrored'];
            case 2: return ['Large Panel', 'Annotated', 'Coordinated', 'Accompanied'];
            case 3: return ['Nested'];
            default: return []
        }
    }
    const mapValue = {
        'Co-occurrence': 'coOccurrence',
        Repeated: 'repeated',
        Stacked: 'stacked',
        Mirrored: 'mirrored',
        'Large Panel': 'large_view',
        Annotated: 'annotated',
        Coordinated: 'coordinated',
        Accompanied: 'accompanied',
        Nested: 'nested',
        Juxtaposed: 'juxtaposed',
        Overlaid: 'overlaid',
        Nested: 'nested'
    }
    const tabValue = getTabValue();

    return (
        <div className={classes.root}>
            <Tabs
                className={classes.tabs}
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            // variant="scrollable"
            // scrollButtons="auto"
            // aria-label="scrollable auto tabs"
            >
                <Tab className={classes.tab} disabled={checkDisabled('coOccurrence')} label="Co-occurrence" />
                <Tab className={classes.tab} disabled={checkDisabled('juxtaposed')} label="Juxtaposed" />
                <Tab className={classes.tab} disabled={checkDisabled('overlaid')} label="Overlaid" />
                <Tab className={classes.tab} disabled={checkDisabled('nested')} label="Nested" />
            </Tabs>
            <StyledTabs
                className={classes.tabs}
                value={detailValue}
                onChange={handleDetailChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
            >
                {tabValue.map(detailType => {
                    return (<Tab className={classes.tab}
                        disabled={checkDetailDisabled(detailType)}
                        label={<div className={classes.label}>
                            <img className={classes.img} src={switchIcon(detailType)} id={detailType}></img>
                            <Typography className={classes.labelText} id={detailType}>{detailType}</Typography>
                        </div>} />)
                })}
            </StyledTabs>
        </div>
    )
}

export default inject('d')(observer(OverviewTab));