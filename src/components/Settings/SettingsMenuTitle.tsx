import {clsx} from "clsx";

interface SettingsMenuTitleProps {
    title: string
    className?: string
}

export default function SettingsMenuTitle({title, className}: SettingsMenuTitleProps) {
    return (
        <>
            <h3 className={clsx('text-base font-extrabold relative', className, {})}>{title}</h3>
        </>
    )
}