import Uppy from '@uppy/core';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { LocalFileItem } from './FileItem';
import { useUppyState } from '@/hooks/use-uppy-state';

type UploadPreviewProps = {
    uppy: Uppy;
}

const UploadPreview: React.FC<UploadPreviewProps> = (props) => {
    const { uppy } = props;
    const files = Object.values(useUppyState(uppy, (s) => s.files));
    const open = files.length > 0;
    const [index, setIndex] = React.useState(0);
    const file = files[index];
    if(file == null) return null;

    const clear = () => {
        files.forEach((file) => {
            uppy.removeFile(file.id);
        })
        setIndex(0);
    }

    return (
        <Dialog 
        open={open} 
        onOpenChange={(flag) => {
            if(flag === false) {
                clear();
            }
        }}
        >
            <DialogContent
            onPointerDownOutside={(e) => {
                e.preventDefault();
            }}
            >
                <DialogHeader>
                    <DialogTitle>Upload Preview</DialogTitle>
                </DialogHeader>
                {/* 中间内容 */}
                <div className='flex items-center justify-between'>
                    <Button variant="ghost">
                        <ChevronLeft 
                        onClick={() => {
                            if(index === 0) {
                                setIndex(files.length - 1);
                            } else {
                                setIndex(index - 1);
                            }
                        }}
                        />
                    </Button>
                    <div className='size-56 flex justify-center items-center border'>
                        {file.data instanceof Blob && <LocalFileItem file={file.data} />}
                    </div>
                    <Button 
                    variant="ghost"
                    onClick={() => {
                        if(index === files.length - 1) {
                            setIndex(0);
                        } else {
                            setIndex(index + 1);
                        }
                    }}
                    >
                        <ChevronRight />
                    </Button>
                </div>
                {/* 底部内容 */}
                <DialogFooter>
                    <Button 
                    variant="destructive"
                    onClick={() => {
                        uppy.removeFile(file.id);
                        setIndex((oldIdx) => {
                            if(oldIdx < files.length - 1 && oldIdx !== 0) {
                                return oldIdx - 1;
                            } else {
                                return 0;
                            }
                        });
                    }}
                    >
                        Delete This
                    </Button>
                    <Button 
                    onClick={() => {
                        uppy.upload().then(() => {
                            files.forEach((file) => {
                                uppy.removeFile(file.id);
                            })
                        });
                    }}
                    >
                        Upload All
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default UploadPreview;