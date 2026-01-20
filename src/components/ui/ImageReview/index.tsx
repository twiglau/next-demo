import React from 'react';
import RcImage, { ImagePreviewType, ImageProps } from 'rc-image';
import { defaultIcons } from './common';

/**
 * rc-image 是由 React Component (rc) 社区（也是 Ant Design 的底层组件库）提供的一个 React 图片组件
 * 它的核心作用是提供强大的图片预览和查看功能。
 */
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