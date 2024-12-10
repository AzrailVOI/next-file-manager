'use client'
import {Settings as SettingsIcon} from "lucide-react";
import {clsx} from "clsx";
import {useOutside} from "@/hooks/useOutside";
import SettingsMenu from "@/components/Settings/SettingsMenu";


export default function Settings() {
    const {ref, isShow: isOpen, setIsShow: setIsOpen} = useOutside(false)

    function toggleSettingsMenu() {
        setIsOpen(!isOpen)
    }

    return (
        <aside ref={ref} className={'fixed top-2 right-2'}>
            <button
                className={clsx('transition-all duration-300 hover:rotate-90', {
                    'rotate-90': isOpen
                })}
                onClick={toggleSettingsMenu}
            >
                <SettingsIcon size={26}/>
            </button>
            <div className={'relative'}>
                <SettingsMenu isOpen={isOpen}/>
            </div>

        </aside>
    )
}