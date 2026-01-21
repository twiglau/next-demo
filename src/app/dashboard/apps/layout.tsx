import React from "react"


type Props = {
    children: React.ReactNode,
    intercepting: React.ReactNode
}
export default function AppsLayout(props: Props) {
    const {children, intercepting} = props;
    return <>
        {children}
        {intercepting}
    </>
}