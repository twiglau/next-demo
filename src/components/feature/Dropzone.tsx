import Uppy from "@uppy/core";
import React, { HTMLAttributes } from "react";


type DropzoneProps = {
    uppy: Uppy;
    children?: (draging: boolean) =>  React.ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const Dropzone: React.FC<DropzoneProps> = (props) => {
    const { uppy, children, ...otherProps } = props;
    const timer = React.useRef<ReturnType<typeof setTimeout>>(null);
    const [dragging, setDragging] = React.useState(false);

    return (
        <div
        {...otherProps}
        onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
        }}
        onDragLeave={(e) => {
            e.preventDefault();
            if(timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            timer.current = setTimeout(() => {
                setDragging(false);
            }, 50);
        }}
        onDragOver={(e) => {
            e.preventDefault();
            // 3. 如果在 50ms 内又触发了 dragOver（说明鼠标还在区域内，只是动了一下,进入子元素区域内）
            // 立即取消那个“关闭状态”的任务
            if(timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        }}
        onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            Array.from(files).forEach((file) => {
                uppy.addFile(file);
            });
            setDragging(false);
        }}
        >
            {children && children(dragging)}
        </div>
    )
    
}

export default Dropzone;

/**
 * 3. 具体流程图解：
-  离开 A 区域 -> 进入子元素 B 区域：
   > 触发 onDragLeave -> 启动 50ms 倒计时。
   > 几乎在同一毫秒（远小于 50ms）触发了 onDragOver -> 倒计时被取消。
   > 结果：dragging 一直是 true，UI 不会闪烁。
-  真正的离开区域：
   > 触发 onDragLeave -> 启动 50ms 倒计时。
   > 鼠标彻底离开了，50ms 内没有任何 onDragOver 或 onDragEnter 来取消它。
   > 结果：50ms 后，setDragging(false) 执行，状态正确关闭。
- 总结
这是一种**防抖（Debounce）**思想的应用。它给浏览器留了一点点时间（50ms）去
确认“用户是真的离开了目标区域，还是仅仅划过了里面的某个子元素”。

[!TIP] 现代 CSS 其实有一种更简单的方案：给子元素设置 pointer-events: none;，
    这样子元素就不会触发任何鼠标/拖拽事件，也就能从根本上避免这个问题的产生。
    但使用 setTimeout 是一种更健壮、不依赖 CSS 层面的纯 JS 解决方案。
 */