import React, { useEffect, useCallback } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { inject, observer } from "mobx-react";
import { Typography, Chip, Divider } from '@material-ui/core';
import { LabelToName} from "../store/Categories";
import SelectedImage from "./SelectedImage";
import VISImage from './VISImage'
import Gallery from 'react-photo-gallery';

const url = (imageName) => {
  const deImageName = imageName.split("_")
  return `https://github.com/composite-visualizations/data/blob/main/${deImageName[0]}/${deImageName[1]}.png?raw=true`
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  galleryBar: {
    marginTop: '0.6vh',
    marginBottom: '0.6vh',
    width: '100%',
    height: '4vh',
    display: 'flex',
    alignItems: 'center'
  },
  galleryWrap: {
    margin: '1%',
    width: '99%',
    marginRight: 0,
    height: '94%',
    overflowY: 'scroll',
  },
  galleryTest:{
    display: 'flex',
  },
  slider: {
    top: '1%',
    left: '40%',
    width: '20%',
  },
  text: {
    marginLeft: '3%',
  },
  gallery: {
    marginLeft: '3%',
    fontWeight: 500,
    lineHeight: 1.85
  },
  tile: {
    margin: '',
  },
  chip: {
    margin: '10px'
  }
}));


function VISGallery({ d }) {
  const classes = useStyles();
  const scaleWidth = 500;
  const scaleHeight = 500;

  let imgList = d.zoomInState.activate? d.zoomInImgList:d.imgList

  imgList = imgList.length === 0 ? [] : imgList.map(imgId => {
    const Width = d.getImageSize(imgId)['width'] / scaleWidth * d.imgState.galleryScale;
    const Height = d.getImageSize(imgId)['height'] / scaleHeight * d.imgState.galleryScale;
    return { src: url(imgId), width: Width, height: Height, imgId: imgId};
  })

  
  const imageRenderer = useCallback(
    ({ index, left, top, photo }) => (
      <SelectedImage
        index={index}
        margin={"2px"}
        photo={photo}
        left={left}
        top={top}
      />
    ),[]
  );

  const handleDelete = () => {
    d.zoomInState = {
      activate: false,
      levelName: null,
      client: null,
      host: null
    }
  };


  return (
    <div className={classes.root}>
      <div className={classes.galleryBar}>
        <Typography className={classes.gallery} variant='h5'>{'Gallery '}</Typography>
        <Typography className={classes.text}>{`${imgList.length} figures found`}</Typography>
        {d.zoomInState.activate && <Chip
          label={`${LabelToName[d.zoomInState.levelName]}: ${LabelToName[d.zoomInState.client]}/${LabelToName[d.zoomInState.host]}`}
          onDelete={handleDelete}
          className={classes.chip}
        />}
      </div>
      <Divider id='gallery_divider'></Divider>
      <div className={classes.galleryWrap} id={"gallery_wrap"}>
        <Gallery className={classes.galleryTest} photos={imgList} margin={10} renderImage={imageRenderer}></Gallery>
      </div>
      {d.dataState.selectGalleryImg && <VISImage className={classes.visImage} key={d.imgState.imgId}></VISImage>}
    </div>
  );
}


export default inject('d')(observer(VISGallery));