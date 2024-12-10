'use server'
import {Fragment} from "react";
import Home from "@/app/Home";

export default async function Root() {
    return (
        <Fragment>
            <Home/>
        </Fragment>
    );
}
