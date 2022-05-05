import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { LazyLoadImage } from 'react-lazy-load-image-component';



const imgStyle = {
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const selectedImgStyle = {
    transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const cont = {
    backgroundColor: "#eee",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative"
};

const SelectedImage = ({
    d,
    index,
    photo,
    margin,
    direction,
    top,
    left
}) => {
    //calculate x,y scale
    const sx = (100 - (30 / photo.width) * 100) / 100;
    const sy = (100 - (30 / photo.height) * 100) / 100;
    selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

    let imgList = d.zoomInState.activate? d.zoomInImgList:d.imgList
    const imgId = imgList[index]

    const handleClick = () => {
        d.activeSelectedImgState(imgId);
        document.getElementById('gallery_wrap').style.width = '49%';
    }

    if (direction === "column") {
        cont.position = "absolute";
        cont.left = left;
        cont.top = top;
    }


    return (
        <div
            style={{ margin, height: photo.height, width: photo.width, ...cont }}
            className={""}
            onClick={handleClick}
        >
            <LazyLoadImage
                alt={photo.title}
                style={
                    { ...imgStyle, ...selectedImgStyle }
                }
                {...photo}
            />
            <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style>
        </div>
    );
};

export default inject('d')(observer(SelectedImage));
