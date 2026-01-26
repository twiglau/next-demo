import { type HTMLAttributes } from "preact";
import { useRef } from "preact/hooks";

type CommonPreactComponentProps = {
    setChildrenContainer?: (ele: HTMLElement | null) => void;
}

type Props = {
    onClick?: (e: any) => void;
    onFileChoosed?: (files: File | File[]) => void;
} & HTMLAttributes<HTMLButtonElement> & CommonPreactComponentProps

export function UploadButton(props: Props) {
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
            ref={inputRef}
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