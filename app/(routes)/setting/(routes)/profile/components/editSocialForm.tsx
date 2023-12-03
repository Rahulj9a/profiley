"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,

    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
 import { ExistingSocialscard } from "./existingSocial&Labelcard";

import PlatformFinder, { socialPlatforms } from "@/components/socialPlatformList";


const formSchema = z.object({

    title: z.string().min(1, {
        message: "Platform name should not be less that 1 letter",
    }),
    username: z.string().min(2, {
        message: "Username should have more than 2 letters",
    }),
    url: z
        .string()
        .regex(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, { message: "Invalid URL" }),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
    className?: string;
    initialData?: { title: string, url: string, username: string }[];
    addSocial: (form: any) => void
    removeSocial: (index: number) => void
    loading?: boolean
}

const SocialForm: React.FC<ProfileFormProps> = ({
    className,
    initialData,
    addSocial,
    removeSocial,
    loading = false
}) => {


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            username: "",
            url: "",
        },
    });

    const handleSubmit  = async(data:ProfileFormValues) => {
         
        addSocial(data)
        form.reset()
    }



    return (
        <div className={cn("w-full p-1", className)}>
            <h1 className="font-bold text-xl py-2">Socials</h1>

            {initialData && initialData?.length > 0 ? (
                <div className=" py-4 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gird-cols-3 xl:grid-cols-4">

                    {initialData.map((social, index: number) => (
                        <div className="rounded-full border-[1px] grid " key={social.url}>
                            <ExistingSocialscard onDelete={() => removeSocial(index)} social={social} platformIcon={PlatformFinder({ social } as any)} />
                        </div>
                    ))}
                </div>
            ) : null}

            <Form  {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8 w-full py-2"
                >
                    <div className="w-full p-2 md:flex-row flex-col flex gap-4 md:gap-6 items-center md:border-none border-[1px]">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a Platform"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent style={{}} className="max-h-[250px] overflow-y-scroll">
                                            {socialPlatforms.map((platform) => (
                                                <SelectItem
                                                    key={platform.label}
                                                    className="w-full h-10 cursor-pointer my-1"
                                                    value={platform.label}
                                                >
                                                    <p className="flex items-center gap-4">
                                                        <platform.icon
                                                            className={cn("h-5 w-5 ", platform.color)}
                                                        />
                                                        <span>{platform.label}</span>
                                                    </p>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="@username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="e.g- https://twitter.com/username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading} className="ml-auto">
                            Add
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default SocialForm;
