import Uppy from '@uppy/core'
import React from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

type UploadButtonProps = {
    uppy: Uppy;
};

const UploadButton: React.FC<UploadButtonProps> = (props) => {
    const { uppy } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
          <input 
          ref={inputRef}
          type="file"
          className='hidden'
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              Array.from(files).forEach((file) => {
                uppy.addFile(file);
              });
              if(inputRef.current) inputRef.current.value = '';
            }
          }}
          />
          <Button
          onClick={() => {
            if(inputRef.current) inputRef.current.click();
          }}
          >
            <Plus />
          </Button>
        </>
    )
}

export { UploadButton }