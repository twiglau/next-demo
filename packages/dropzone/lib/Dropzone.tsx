
import { useRef, useState, useEffect } from "preact/hooks";
import type { ReactNode, HTMLAttributes } from "preact/compat"


type CommonPreactComponentProps = {
    setChildrenContainer?: (ele: HTMLElement | null) => void;
}

export type DropzoneProps = {
    onDraggingChange: (dragging: boolean) => void;
    onFileChoosed?: (files: File[]) => void;
    children: ReactNode | ((props: { dragging: boolean }) => ReactNode);
} & Omit<HTMLAttributes<HTMLDivElement>, "children">& CommonPreactComponentProps

export function Dropzone(props: DropzoneProps) {
    const [dragging, setDragging] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const {
        onDraggingChange,
        onFileChoosed,
        setChildrenContainer,
        children,
        ...restProps
    } = props;


    useEffect(() => {
        onDraggingChange?.(dragging);
    }, [dragging, onDraggingChange]);

    return (
        <div  
        ref={(e) => {
            setChildrenContainer?.(e);
        }} 
        {...restProps}
        onDragEnter={e => {
            e.preventDefault();
            setDragging(true);
        }}
        onDragLeave={e => {
            e.preventDefault();
            if(timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            timerRef.current = setTimeout(() => {
                setDragging(false);
            }, 50);
        }}
        onDragOver={e => {
            e.preventDefault();
            if(timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }}
        onDrop={e => {
            e.preventDefault();
            const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
            onFileChoosed?.(files);
            setDragging(false);
        }}
        >
        </div>
    )
}