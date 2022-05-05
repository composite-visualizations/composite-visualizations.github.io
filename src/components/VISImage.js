import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Typography, IconButton, TextField } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Close } from '@material-ui/icons';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import RelationTree from './RelationTree.js';

// const url = uri => `https://compvis.zjuidg.org${uri}`;  //local version

const url = (imageName) => {
    console.log(imageName)
    const deImageName = imageName.split("_")
    return `https://github.com/composite-visualizations/data/blob/main/${deImageName[0]}/${deImageName[1]}.png?raw=true`
}

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: '65vw',
        top: '13.2vh',
        width: '35vw',
        height: '88vh',
        backgroundColor: 'black',
    },
    img: {
        // objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%',
        boxShadow: '-3px 4px 3px 4px rgba(200, 200, 200, 1)',
    },
    imgView: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '40%',
        // marginBottom: '40px',
        // backgroundColor: 'lightgrey'
    },
    imgWrapping: {
        position: 'relative',
        maxWidth: '98%',
        maxHeight: '98%',
        display: 'flex',
        // width: '35vw',
        // height: '35vh',
    },
    icon: {
        color: 'white'
    },
    button: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    infoBlock: {
        display: 'block',
        position: 'relative',
        margin: '20px 0 0 0',
        maxHeight: '45%',
        padding: '0px 20px 0px 20px',
        overflowY: 'scroll',
    },
    caption: {
        margin: '5px',
        width: '100%',
        color: 'white',
        backgroundColor: 'black',
        lineHeight: 1.25
    },
    textWrap: {
        display: 'flex',
        height: '100%',
        maxHeight: '30%',
    },
    text: {
        display: 'inline',
        margin: '5px',
        maxWidth: '80%',
        color: 'white',
        wordWrap: 'break-word',
    },
    textType: {
        width: '70px',
        display: 'inline',
        textTransform: 'capitalize',
        margin: '5px',
        maxWidth: '50%',
        color: '#7689EF',
        fontWeight: 'bold',
        wordWrap: 'break-word',
    },
    bottomBtn: {
        display: 'inline',
        color: 'white',
    },
    index: {
        display: 'inline',
        color: 'white',
    },
    btnG: {
        position: 'absolute',
        bottom: '3%',
        left: '40%',
    },
    multilineColor: {
        color: 'white',
    },
    input: {
        width: '50px',
    },
    canvasOnImg: {
        position: "absolute",
        width: '100%',
        height: '100%',
    },
    relTable: {
        maxHeight: '10vh'
    },
}));


const Rectangle = ({ shapeProps, isSelected, isHighlighted, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();


    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);
    // //console.log(shapeProps)
    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                stroke={isHighlighted ? "#3977AF" : shapeProps.stroke}
                fillEnabled={isHighlighted}//subfigures enabled
                strokeScaleEnabled={false}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    keepRatio={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

function VISImage({ d, top }) {
    const classes = useStyles();


    const handleSelect = ({ target: Rect }) => {
        //console.log(Rect.index)
        // d.transformVisualizationsFromRaw(Rect.index);
    }

    const preImage = () => {
        d.changeImgId(-1)
    }

    const nxtImage = () => {
        d.changeImgId(+1)
    }

    const onImgLoad = ({ target: img }) => {
        // const clientHeight = document.getElementById('imgView').clientHeight;
        // const clientHeight = document.getElementById('imgWrapping').clientHeight;
        // const clientWidth = document.getElementById('imgWrapping').clientWidth;
        const maxHeight = 0.98 * document.getElementById('imgView').clientHeight;
        const maxWidth = 0.98 * document.getElementById('imgView').clientWidth;

        const scale = Math.min(maxHeight / img.naturalHeight, maxWidth / img.naturalWidth);
        d.imgState.imgSize.height = img.naturalHeight;
        d.imgState.imgSize.width = img.naturalWidth;
        d.imgState.viewDimension.height = scale * img.naturalHeight;
        d.imgState.viewDimension.width = scale * img.naturalWidth;
        console.log(d.imgState)
        d.getImgDetails(d.imgState.imgId.split('.')[0])
    };


    return (
        <div className={classes.root}>
            <div className={classes.button}><IconButton onClick={d.closeSelectedImgState}><Close className={classes.icon} /></IconButton></div>
            <div className={classes.imgView} id="imgView">
                <div className={classes.imgWrapping} id="imgWrapping">
                    <img
                        onLoad={onImgLoad}
                        className={classes.img}
                        src={url(d.imgState.imgId)}
                        alt={''}
                        style={{
                            width: d.imgState.viewDimension.width,
                            height: d.imgState.viewDimension.height
                        }}>
                    </img>
                    <Stage
                        className={classes.canvasOnImg}
                        width={d.imgState.viewDimension.width}
                        height={d.imgState.viewDimension.height}>
                        <Layer>
                            {d.imgState.subfigures && d.imgState.subfigures.map((rect, i) => {
                                return (
                                    <Rectangle
                                        key={rect.id}
                                        shapeProps={rect}
                                        isSelected={false}
                                        isHighlighted={true}
                                        onSelect={handleSelect}
                                    />
                                );
                            })}
                            {d.imgState.visualizations && d.imgState.visualizations.map((rect, i) => {
                                return (
                                    <Rectangle
                                        key={rect.id}
                                        shapeProps={rect}
                                        isSelected={false}
                                        isHighlighted={false}
                                    //   onSelect={handleSelect}
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>
            </div>
            {/* {//console.log(d.imgState.imgId)} */}
            <div className={classes.infoBlock}>
                {/* <RelationTable className={classes.relTable} relationsTree={d.imgState.relations}></RelationTable> */}
                <RelationTree className={classes.relTable} d={d} relationsTree={d.imgState.relations}></RelationTree>
                <TextField
                    // rows={4}
                    className={classes.caption}
                    value={`${d.imgState['caption']}`}
                    multiline
                    color={'primary'}
                    InputProps={{
                        classes: {
                            input: classes.multilineColor,
                        },
                    }}
                ></TextField >
                <div className={classes.textWrap}>
                    <Typography className={classes.textType}>{`Title:`}</Typography>
                    <Typography className={classes.text}>{`${d.imgState['title']}`}</Typography>
                </div>
                <div className={classes.textWrap}>
                    <Typography className={classes.textType}>{`Abstract:`}</Typography>
                    <Typography className={classes.text}>{`${d.imgState['abstract']}`}</Typography>
                </div>
                <div className={classes.textWrap}>
                    <Typography className={classes.textType}>{`Authors:`}</Typography>
                    <Typography className={classes.text}>{d.imgState.authors ? d.imgState.authors.join(', ') : d.imgState.authors}</Typography>
                </div>
                <div className={classes.textWrap}>
                    <Typography className={classes.textType}>{`Year:`}</Typography>
                    <Typography className={classes.text}>{`${d.imgState['year']}`}</Typography>
                </div>
            </div>
            <div className={classes.btnG}>
                <IconButton className={classes.bottomBtn} onClick={preImage}><ChevronLeft /></IconButton>
                <Typography className={classes.index}>{`${d.imgList.indexOf(d.imgState.imgId)} / ${d.imgList.length - 1}`}</Typography>
                <IconButton className={classes.bottomBtn} onClick={nxtImage}><ChevronRight /></IconButton>
            </div>
        </div>
    )
}

export default inject('d')(observer(VISImage));