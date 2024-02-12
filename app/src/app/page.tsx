"use client";
import { LoadingText } from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page () {
    const router = useRouter();
    useEffect(() => {
        // check `access_token` from localStorage if not exists redirect to login if not then redirect to `portfolio`
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return router.push('/login');
        return router.push('/portfolio');
    }, [router]);
    return <LoadingText />
}