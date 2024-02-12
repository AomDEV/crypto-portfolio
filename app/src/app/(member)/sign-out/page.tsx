"use client";
import { LoadingText } from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page () {
    const router = useRouter();
    useEffect(() => {
        localStorage.clear();
        return router.push('/login');
    }, [router]);
    return <LoadingText />
}