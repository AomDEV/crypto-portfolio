"use client";
import { useEffect, createContext, useRef, useState } from "react";

const SseContext = createContext({
    subscribe: (event: string, callback: (data: any) => void) => {},
    unsubscribe: (event: string) => {}
});

function SseProvider({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isReady, setIsReady] = useState<boolean>(false);
    const sse = useRef<EventSource | null>(null)
    const events = useRef<{[key: string]: (data: any) => void}>({}) // maps each channel to the callback
    /* called from a component that registers a callback for a channel */
    const subscribe = (event: string, callback: (data: any) => void) => {
        events.current[event] = callback
    }
    /* remove callback  */
    const unsubscribe = (event: string) => {
        delete events.current[event]
    }
    useEffect(() => {
        if (!isReady) return;
        /* WS initialization and cleanup */
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return console.log(`'NEXT_PUBLIC_API_URL' not found`);

        const url = new URL(`/v1/event/sse?merged=true`, apiUrl);
        sse.current = new EventSource(url)
        sse.current.onopen = () => { console.log('SSE opened') }
        sse.current.onerror = (error) => {
            console.error('SSE error', error)
            if (sse.current) sse.current.close();
        }
        sse.current.onmessage = (message: any) => {
            const { event, data } = JSON.parse(message.data);
            if (events.current[event]) events.current[event](data)
        }
        return () => {
            if (!sse.current) return;
            sse.current.removeEventListener('message', () => {});
            sse.current.close()
        }
    }, [isReady])

    useEffect(() => {
        setIsReady(true)
        return () => setIsReady(false)
    }, []);

    /* WS provider dom */
    /* subscribe and unsubscribe are the only required prop for the context */
    return (
        <SseContext.Provider value={{subscribe, unsubscribe}}>
            {children}
        </SseContext.Provider>
    )
}

export { SseContext, SseProvider }
