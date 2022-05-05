import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Tabs, Tab } from '@material-ui/core';
import patternData from '../resource/pattern_data.json'

const colors = {
    'juxtaposed': "#3977AF",
    'overlaid': "#EF8536",
    'nested': "#519C3E"
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '92%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        overflowY: 'scroll'
    },
    teaser: {
        width: '100%'
    },
    teaserImg: {
        width: '100%'
    },
    teaserCav: {
        width: '100%',
        zIndex: 2,
    },
    content: {
        position: 'relative',
        width: '70%',
        paddingBottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    indicator: {
        backgroundColor: "#3977AF",
    },
    tabs: {
        width: '100%',
    },
    parentDef: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0 0px 4px 3px rgba(176, 190, 197, 0.1)'
    },
    childDef: {
        width: '100%',
    },
    blockWrap: {
        width: '100%',
        padding: '10px 0 0 0',
        display: 'flex',

    },
    icon: {
        margin: '0 10px 0 0',
        width: '5vw',
        height: '5vw',
        // backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0 0px 4px 3px rgba(176, 190, 197, 0.1)'
    },
    textWrap: {
        width: '100%',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0 0px 4px 3px rgba(176, 190, 197, 0.1)'
    },
    name: {
        fontSize: '24px',
        margin: '0 0 24px'
    },
    definition: {
        fontSize: '16px',
        margin: '16px 0'
    },
    example: {
        width: '100%',
        // width: '50px',
        // height:'50px'
    },
    spanStyle: {
        fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif']
    },
    li: {
        fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
        lineHeight:1.5,
        fontWeight: 400,
        letterSpacing: '0.00938em'
    }
}));

function PatternBlock({ icon, name, definition, advantages, disadvantages, suggestions, figure }) {
    const classes = useStyles();
    // //console.log(advantages, typeof (advantages));
    return (
        <div className={classes.blockWrap}>
            <img src={icon} className={classes.icon}></img>
            <div className={classes.textWrap}>
                <Typography className={classes.name}>
                    {name}
                </Typography>
                <Typography className={classes.definition}>
                    <b className={classes.spanStyle}>Definition: </b>{definition}
                </Typography>
                <img src={figure} className={classes.example}></img>
                {advantages.length > 0 ? <b className={classes.spanStyle}>Advantages:</b> : null}
                {advantages.length > 0 ? <ol>{advantages.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
                {disadvantages.length > 0 ? <b className={classes.spanStyle}>Disadvantages:</b> : null}
                {disadvantages.length > 0 ? <ol>{disadvantages.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
                {suggestions.length > 0 ? <b className={classes.spanStyle}>Observations:</b> : null}
                {suggestions.length > 0 ? <ol>{suggestions.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
            </div>
        </div>
    )
}

function DesignPattern() {
    const classes = useStyles();
    // //console.log(patternData['juxtaposed'].advantages);
    // //console.log(patternData['juxtaposed'].advantages.length);
    const [key, setValue] = React.useState('juxtaposition');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <div className={classes.root}>
            {/* <div className={classes.teaser}>
            <img className={classes.teaserImg} src={process.env.PUBLIC_URL + `/patterns/teaser.png`}></img>
            <div className={classes.teaserCav}></div>
        </div> */}
            <div className={classes.content}>
                <Tabs className={classes.tabs}
                    value={key}
                    indicatorColor="primary"
                    onChange={handleChange}
                    centered
                >
                    {Object.keys(patternData).map(
                        value => (
                            <Tab
                                value={value}
                                label={value}
                                {...patternData[value].name} />))}
                </Tabs>
                {patternData[key].definition == '' ? null : <div className={classes.parentDef}>
                    <Typography style={{
                        fontSize: '24px',
                        margin: '24px'
                    }}>
                        {patternData[key].name}
                    </Typography>
                    <Typography style={{
                        fontSize: '16px',
                        margin: '16px 24px 20px 24px'
                    }}>
                        <b className={classes.spanStyle}>Definition: </b>{patternData[key].definition}
                    </Typography>
                    <div style={{
                        fontSize: '16px',
                        margin: '16px 24px 20px 24px'
                    }}>
                    {patternData[key].advantages.length > 0 ? <b className={classes.spanStyle}>Common Observations:</b> : null}
                    {patternData[key].advantages.length > 0 ? <ol>{patternData[key].advantages.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
                    {patternData[key].disadvantages.length > 0 ? <b className={classes.spanStyle}>Common Disadvantages:</b> : null}
                    {patternData[key].disadvantages.length > 0 ? <ol>{patternData[key].disadvantages.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
                    {patternData[key].suggestions.length > 0 ? <b className={classes.spanStyle}>Common Suggestions:</b> : null}
                    {patternData[key].suggestions.length > 0 ? <ol>{patternData[key].suggestions.map(value => (<li className={classes.li}>{value}</li>))}</ol> : null}
                    </div>
                </div>}
                <div className={classes.childDef}>
                    {
                        patternData[key].subtypes.map(subtype => {
                            const { id, name, definition, advantages, disadvantages, suggestions } = subtype;
                            // //console.log(id, definition, advantages, typeof(advantages));
                            return (<PatternBlock
                                icon={process.env.PUBLIC_URL + `/patterns/${id}-icon.png`}
                                name={name}
                                definition={definition}
                                advantages={advantages}
                                disadvantages={disadvantages}
                                suggestions={suggestions}
                                figure={process.env.PUBLIC_URL + `/patterns/${id}.png`} />)
                        })
                    }
                </div>
                {/* <PatternBlock 
                icon={logo}
                name={"Accompanied Visualization"} 
                definition='In an accompanied visualization, component visualizations share the same coordinate system.' 
                figure={acc}/> */}
            </div>
        </div>
    );
}


export default DesignPattern;