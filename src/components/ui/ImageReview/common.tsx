import React from 'react';
import { PreviewProps } from 'rc-image/lib/Preview';
import {
    X,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    RotateCw,
    ZoomIn,
    ZoomOut,
    FlipHorizontal,
    FlipVertical,
} from 'lucide-react'

// TODO: rc-image 是什么类型库？
export const defaultIcons: PreviewProps['icons'] = {
    rotateLeft: <RotateCcw />,
    rotateRight: <RotateCw />,
    zoomIn: <ZoomIn />,
    zoomOut: <ZoomOut />,
    close: <X />,
    left: <ChevronLeft />,
    right: <ChevronRight />,
    flipX: <FlipHorizontal />,
    flipY: <FlipVertical />,
}