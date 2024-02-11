"use client";
import Nav from "@/components/nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MemberLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    useEffect(() => {
        // check `access_token` from localStorage if not exists redirect to login
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            localStorage.clear();
            return router.push('/login');
        }
    }, []);
    return (
        <main className="min-h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-xl">
                <div className="mb-2">
                    <div className="text-center mb-2">
                        <h1 className="text-3xl font-bold">CRYPTON</h1>
                        <h4 className="text-sm italic">Secure your digital assets</h4>
                    </div>
                    <Nav />
                </div>
                <div className="border rounded-lg w-full p-2">
                    {children}
                </div>
            </div>
        </main>
    );
}