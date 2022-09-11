import React from 'react'
import { AppContext } from '../lib/reactContexts';

export default function Homepage() {
    const [appContext, setAppContext] = React.useState({});

    return <>
        <div className="">
            <AppContext.Provider value={{ appContext, setAppContext }}>
                Homepage
            </AppContext.Provider>
        </div>
    </>
}