import { type HTMLAttributes } from "preact";
import { useRef, type MutableRef } from "preact/hooks";

type CommonPreactComponentProps = {
    setChildrenContainer?: (ele: HTMLElement | null) => void;
}

export type UploaderButtonProps = {
    onClick?: (e: any) => void;
    onFileChoosed?: (files: File[]) => void;
    inputRef?: MutableRef<HTMLInputElement|null>
} & HTMLAttributes<HTMLButtonElement> & CommonPreactComponentProps

export function UploadButton(props: UploaderButtonProps) {
    const inputRef = useRef<HTMLInputElement|null>(null);

    const handleClick = (e: any) => {
        inputRef.current?.click();
        if(props.onClick) {
            props.onClick(e);
        }
    }
    return (
        <>
            <button {...props} onClick={handleClick} ref={e => {
                props.setChildrenContainer?.(e as any);
            }}/>
            <input 
            // 永远不会被tab键选中
            tabIndex={-1} 
            ref={e => {
                inputRef.current = e;
                const ref = props.inputRef;
                if (ref) {
                    ref.current = e;
                }
            }}
            onChange={(e) => {
                const filesFromEvent = (e.target as HTMLInputElement).files;
                if(filesFromEvent) {
                    props.onFileChoosed?.(Array.from(filesFromEvent));
                }
            }}
            style={{opacity: 0, position:'fixed', left: -10000, top: 0}} 
            type="file" />
        </>
    )
}