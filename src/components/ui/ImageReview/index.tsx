import React from 'react';
import RcImage, { ImagePreviewType, ImageProps } from 'rc-image';
import { defaultIcons } from './common';


const ImageReview: React.FC<ImageProps> = (props) => {
    let previewProps: ImagePreviewType|boolean;

    if(typeof props.preview === 'boolean') {
        previewProps = props.preview;
    }else {
        previewProps = {
            ...defaultIcons,
            ...props.preview?.icons
        } as ImagePreviewType;
    }
    return  <RcImage {...props} preview={previewProps} />
}

export default ImageReview;