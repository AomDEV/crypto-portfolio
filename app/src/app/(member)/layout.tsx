import Nav from "@/components/nav";

export default function MemberLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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