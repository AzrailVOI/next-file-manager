import {Loader2} from "lucide-react";
import {clsx} from "clsx";

interface IMiniLoaderProps {
    className?: string
}

export default function MiniLoader({className}: IMiniLoaderProps) {
    return (
        <div className={clsx('animate-spin inline-flex justify-center items-center', className)}>
            <Loader2 size={20}/>
        </div>
    )
}