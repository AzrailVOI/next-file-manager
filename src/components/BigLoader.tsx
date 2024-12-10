import {Loader2} from "lucide-react";

export default function BigLoader() {
    return (
        <div className={'fixed backdrop-blur-sm top-0 left-0 right-0 bottom-0 z-50'}>
            <div className={'animate-spin flex justify-center items-center w-full h-full'}>
                <Loader2 size={60}/>
            </div>
        </div>
    )
}