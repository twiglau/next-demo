'use client';


import AppDashboardNav from "../../page"

type Props = {
    params: Promise<{ appId: string }>
}
export default function StorageSetting(props: Props) {
    return (
        <div className="flex justify-between items-center">
            <AppDashboardNav {...props} />
            <div>{`/ storage`}</div>
        </div>
    );
}