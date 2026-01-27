import React from 'react';
import { Slider } from "@/components/ui/Slider";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';


export function ImageUrlMaker({id}: {id: string}) {
    const [rotate, setRotate] = React.useState(0);
    const [width, setWidth] = React.useState(100);
    const [url, setUrl] = React.useState<string | null>(`/image/${id}?width=${width}&rotate=${rotate}`);
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-2">
                    <span>Rotate:</span>
                    <Slider
                    className="relative flex h-5 w-[200px] touch-none select-none items-center"
                    value={[rotate]}
                    onValueChange={v => setRotate(v[0] || 0)}
                    max={180}
                    min={-180}
                    step={5}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor='widthInput' className='mr-2'>{`Width:`}</label>
                    <input 
                    id='widthInput'
                    type='number'
                    width={width}
                    max={2000}
                    min={100}
                    className='input input-bordered input-sm'
                    onChange={e => setWidth(Number(e.target.value))}
                    />
                </div>
                <Button onClick={() => {
                    setUrl(`/image/${id}?width=${width}&rotate=${rotate}`)
                }}>
                    Make
                </Button>
            </div>
            <div>
                <div className='flex justify-center items-center'>
                    <img src={url} alt="" className='max-w-full max-h-[50vh]'/>
                </div>
            </div>
            <div className='flex justify-between items-center gap-2'>
                <Input value={location.host + url} readOnly />
                <Button onClick={() => {
                    copy(location.host + url);
                    toast('Copy Success!');
                }}>
                    Copy
                </Button>
            </div>
        </div>
    )
}