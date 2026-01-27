import Uppy from '@uppy/core'
import React from 'react';
import { Button, buttonVariants } from '../ui/Button';
import { Plus } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

type UploadButtonProps = {
    uppy: Uppy;
} & React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const UploadButton: React.FC<UploadButtonProps> = (props) => {
    const { uppy, ...otherProps } = props;
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
              e.target.value = "";
            }
          }}
          />
          <Button
          variant="outline"
          {...otherProps}
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


/**
 * if(inputRef.current) inputRef.current.value = '';
 * 
 * 这条代码的作用是 “重置文件输入框的状态”。具体来说，它解决了 Web 开发中一个非常经典的小问题：无法重复选择同一个文件。
 * 详细解释：
 * 1. inputRef.current: 这是一个 React ref，指向页面上那个隐藏的 <input type="file" /> 元素。
 * 2. inputRef.current.value = '': 将输入框的值清空。
 * 为什么需要它？
 * 在浏览器中，<input type="file" /> 的 onChange 事件只有在选中的内容发生变化时才会触发。
 * - 场景 A（如果没有这行代码）：
 * 1. 你选择了一个名为 photo.jpg 的文件，触发 onChange，文件进入上传队列。
 * 2. 你觉得选错了，在预览界面删除了 photo.jpg。
 * 3. 你再次点击上传按钮，想重新选择 photo.jpg。
 * 4. 结果： 什么都不会发生。因为输入框里记录的值依然是 photo.jpg，浏览器认为值没变，所以不会再次触发 onChange。
 * - 场景 B（有了这行代码）：
 * 1. 你选择了 photo.jpg，代码处理完文件后立即执行 value = ''。
 * 2. 此时输入框被清空了。
 * 3. 你再次选择 photo.jpg，浏览器发现值从 "" 变成了 "photo.jpg"，于是成功触发 onChange。
 */