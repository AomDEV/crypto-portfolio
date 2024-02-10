"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        return api().post('/v1/authentication/login', data).then((response) => {
            router.push('/portfolio');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "john",
            password: "password",
        },
    })

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="w-full text-center mb-2">
                <h1 className="text-3xl font-bold">CRYPTON</h1>
                <h4 className="italic">Secure your digital assets</h4>
            </div>
            <div className="w-full max-w-64">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name={'username'}
                            disabled={isLoading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl className="!mt-0">
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'password'}
                            disabled={isLoading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl className="!mt-0">
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading} type="submit">Sign-In</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}