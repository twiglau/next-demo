import { type HTMLAttributes } from "preact";
import { useRef } from "preact/hooks";

type Props = {
    onClick?: (e: any) => void;
} & HTMLAttributes<HTMLButtonElement>

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
            <button {...props} onClick={handleClick}>
                {props.children}
            </button>
            <input 
            // 永远不会被tab键选中
            tabIndex={-1} 
            ref={inputRef}
            style={{opacity: 0, position:'fixed', left: -10000, top: 0}} 
            type="file" />
        </>
    )
}