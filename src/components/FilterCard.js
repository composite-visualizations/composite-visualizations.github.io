import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Checkbox, ListItemText, Card, Typography, Icon, Popover, MenuItem, IconButton, Button, Divider, TextField } from '@material-ui/core';
import { ViewCompact, BarChart, People, Person, ExpandMore } from '@material-ui/icons';
import { LabelToName, ReverseLabelToName } from "../store/Categories";
// import { List } from 'react-virtualized';
import LazyLoad from 'react-lazy-load';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
        height: '100%',
    },
    cardContentLeft: {
        display: 'flex',
        height: '70%',
        margin: '8px 8px 5px 20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '7px'
    },
    cardContentRight: {
        display: 'flex',
        height: '70%',
        margin: '8px 20px 5px 5px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '7px'
    },
    text: {
        // display: 'inline',
        minWidth: '120px',
        maxWidth: '160px',
        overflow: 'hidden'
    },
    icon: {
        margin: '0px 10px 0px 10px',
        // display: 'inline',
        width: '30px',
        height: '30px',
    },
    option: {
        height: '50px',
        width: '230px'
    },
    popover: {
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
    list: {

    },
    optGrp: {
        paddingLeft: '5%',
        textTransform: 'capitalize',
        height: '50px',
        fontWeight: 'bold',
    },
    logic: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
        paddingLeft: '6%',
        paddingRight: '3%',
        width: '30%',
        display: 'inline',
    },
    btn: {
        margin: '6px',
    },
    textField: {
        margin: '4px',
        marginRight: 0
    },
    logicWrap: {
        backgroundColor: 'rgba(180, 180, 180, 0.2)'
    },
    textFieldWrap: {
        backgroundColor: 'rgba(180, 180, 180, 0.2)'
    }
}));

function FilterCard({ value, d }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [maxLength, setMaxLength] = React.useState(50);

    const handleClick = (e) => {
        setAnchorEl(document.getElementById(value));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLengthAddition = () => {
        setMaxLength(maxLength + 50)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const selectIcon = () => {
        switch (value) {
            case 'Composition Type:': return <ViewCompact />;
            case 'Visualization Type:': return <BarChart />;
            case 'Conference:': return <People />;
            case 'Authors:': return <Person />;
            default: return;
        }
    }
    const selectType = () => {
        switch (value) {
            case 'Composition Type:': return 'compType';
            case 'Visualization Type:': return 'visType';
            case 'Conference:': return 'conference';
            case 'Authors:': return 'authors';
            default: return;
        }
    }

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            d.updateSearchAuthors(e.target.value);
        }
    }

    const type = selectType();

    return (
        <div className={classes.root}>
            <Card className={type === 'compType' || type === 'conference' ? classes.cardContentLeft : classes.cardContentRight} variant="outlined">
                <div style={{ display: "flex", alignItems: "center", width: '100%', justifyContent: 'space-between' }}>

                    <IconButton className={classes.icon} onClick={handleClick}>{selectIcon()}</IconButton>
                    <Typography noWrap className={classes.text} id={value} onClick={handleClick}>{`${value} ${d.filterState.filterBarState[type]}`}</Typography>
                    <IconButton className={classes.icon} onClick={handleClick}><ExpandMore /></IconButton>
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
                        {type === 'authors' ? <div className={classes.textFieldWrap}>
                            <TextField
                                className={classes.textField}
                                size="small"
                                label={"author..."}
                                onKeyDown={handleInput}
                                variant="outlined"></TextField>
                        </div> : null}
                        {type !== 'conference' ? <div className={classes.logicWrap}>
                            <Typography className={classes.logic}>logic</Typography>
                            {['or', 'and'].map(filterType => {
                                return <Button
                                    className={classes.btn}
                                    variant="contained"
                                    size={'small'}
                                    color={d.filterState.filterType[type] === filterType ? 'primary' : 'default'}
                                    onClick={() => d.changeFilterType(type, filterType)}
                                    disableElevation>
                                    {filterType}
                                </Button>
                            })}
                            {/* <Button 
                        className={classes.btn} 
                        variant="contained" size={'small'} 
                        disableElevation>{'or'}</Button>
                        <Button className={classes.btn} variant="contained" size={'small'} disableElevation>{'and'}</Button> */}
                            <Divider></Divider>
                        </div> : null}
                        {/* <MenuItem className={classes.option} selected={d.filterStateSelected(type) === Object.keys(d.filterState[type]).length} onClick={() => d.changeFilterState(type, 'All')}><ListItemText primary={'Select All'} /><Checkbox checked={d.filterStateSelected(type) === Object.keys(d.filterState[type]).length} /></MenuItem> */}
                        {(type === 'visType' || type === 'conference') && Object.keys(d.filterState[type]).map((key) => {
                            return <MenuItem className={classes.option} selected={d.filterState[type][key]} onClick={() => d.changeFilterState(type, key)} key={key}><ListItemText primary={LabelToName[key]} /><Checkbox checked={d.filterState[type][key]} secondary/></MenuItem>
                        })}
                        {type === 'authors' && d.searchedAuthorsList.slice(0,maxLength).map((key) => {
                            return <MenuItem className={classes.option} selected={d.filterState[type][key]} onClick={() => d.changeFilterState(type, key)} key={key}><ListItemText primary={key} /><Checkbox checked={d.filterState[type][key]} /></MenuItem>
                        })}
                        {type === 'compType' ? <div>
                            <MenuItem className={classes.optGrp} selected={d.filterState[type]['repeated'] && d.filterState[type]['stacked'] && d.filterState[type]['mirrored']} key={'juxtaposed'}>{'juxtaposed'}</MenuItem>
                            {['repeated', 'stacked', 'mirrored'].map(key => {
                                return <MenuItem className={classes.option} selected={d.filterState[type][key]} onClick={() => d.changeFilterState(type, key)} key={key}><ListItemText primary={LabelToName[key]} /><Checkbox checked={d.filterState[type][key]} /></MenuItem>
                            })}
                            <MenuItem className={classes.optGrp} selected={d.filterState[type]['large_view'] && d.filterState[type]['annotated'] && d.filterState[type]['coordinated'] && d.filterState[type]['accompanied']} key={'overlaid'}>{'overlaid'}</MenuItem>
                            {['large_view', 'annotated', 'coordinated', 'accompanied'].map(key => {
                                return <MenuItem className={classes.option} selected={d.filterState[type][key]} onClick={() => d.changeFilterState(type, key)} key={key}><ListItemText primary={LabelToName[key]} /><Checkbox checked={d.filterState[type][key]} /></MenuItem>
                            })}
                            <MenuItem className={classes.optGrp} selected={d.filterState[type]['nested']} key={'nested_father'}>{'nested'}</MenuItem>
                            {['nested'].map(key => { return <MenuItem className={classes.option} selected={d.filterState[type][key]} onClick={() => d.changeFilterState(type, key)} key={key}><ListItemText primary={LabelToName[key]} /><Checkbox checked={d.filterState[type][key]} /></MenuItem> })}
                        </div> : null}
                        {type === 'authors' && d.searchedAuthorsList.length > maxLength?<MenuItem className={classes.option} onClick={() => handleLengthAddition()}><ListItemText primary={'...'} /></MenuItem>:null}
                    </Popover>
                </div>
            </Card>
        </div>
    )
}

export default inject('d')(observer(FilterCard));