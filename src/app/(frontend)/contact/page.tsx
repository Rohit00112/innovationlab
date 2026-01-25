"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
    Clock,
    MapPin,
    Mail,
    Phone,
    Send,
    Users,
} from "lucide-react";

const contactFormSchema = z.object({
    fullName: z.string().min(2, "Please let us know your name."),
    email: z.string().email("Enter a valid email address."),
    subject: z.string().min(3, "Pick a subject so we can route it to the right team."),
    message: z
        .string()
        .min(10, "Share a bit more detail so we can follow up effectively."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const contactDetails = [
    {
        title: "Visit the Lab",
        description: "Itahari International College, 4th Floor Innovation Wing, Sunsari 56705",
        icon: MapPin,
    },
    {
        title: "Talk With Us",
        description: "+977-25-525123 (Sun–Fri, 9:00 AM – 5:00 PM)",
        icon: Phone,
    },
    {
        title: "Write to Us",
        description: "hello@innovationlab.com",
        icon: Mail,
    },
    //   {
    //     title: "Collaboration Desk",
    //     description: "Partner with our student teams for prototypes and pilots.",
    //     icon: Users,
    //   },
    {
        title: "Open Hours",
        description: "Drop-in mentoring every Wednesday & Thursday, 2:00 PM – 4:00 PM.",
        icon: Clock,
    },
];

export default function ContactPage() {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            subject: "",
            message: "",
        },
    });
    const [status, setStatus] = useState<SubmissionStatus>("idle");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleSubmit = async (values: ContactFormValues) => {
        setStatus("submitting");
        setStatusMessage(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                const fallbackMessage =
                    typeof payload?.message === "string"
                        ? payload.message
                        : "Unable to send your message right now.";
                throw new Error(fallbackMessage);
            }

            const payload = await response.json().catch(() => null);
            const successMessage =
                typeof payload?.message === "string"
                    ? payload.message
                    : "We received your message and will be in touch soon.";

            setStatus("success");
            setStatusMessage(successMessage);
            form.reset();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to send your message right now.";
            setStatus("error");
            setStatusMessage(message);
        }
    };

    return (
        <main className="w-full bg-background text-foreground">
            <section className="relative min-h-[60vh] flex items-center border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
                    <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-widest text-foreground/70">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                Get in Touch
                            </div>
                            <div className="space-y-6">
                                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
                                    Contact Us
                                </h1>
                                <p className="text-lg leading-relaxed text-foreground/70 max-w-2xl">
                                    Whether you&apos;re exploring collaboration, need support on a project, or want a tour of the lab, we&apos;re here to help. Send us a message and the right team will reach out.
                                </p>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {contactDetails.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.title}
                                            className="border border-foreground/10 p-6 hover:border-foreground/30 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 flex items-center justify-center border border-foreground/20 flex-shrink-0">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-widest text-foreground/50">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border border-foreground/10 bg-background/80 backdrop-blur-sm p-6 sm:p-10">
                            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                            {statusMessage && (
                                <div
                                    className={`mb-6 rounded border p-4 text-sm leading-relaxed ${status === "success"
                                            ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                                            : "border-destructive/40 bg-destructive/10 text-destructive"
                                        }`}
                                >
                                    {statusMessage}
                                </div>
                            )}

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                    className="space-y-6"
                                    noValidate
                                >
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your name"
                                                        autoComplete="name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="How can we help?"
                                                        autoComplete="off"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Share a few details about your request or idea."
                                                        rows={5}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full uppercase tracking-wider"
                                        disabled={status === "submitting"}
                                    >
                                        {status === "submitting" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Spinner className="h-4 w-4" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Send Message
                                                <Send className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                    <p className="text-xs text-foreground/50 text-center">
                                        By submitting, you agree to let the Innovation Lab team contact you about this request.
                                    </p>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="border border-foreground/10 p-8 lg:p-16">
                        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-foreground/50">Plan a visit</p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                    Take a tour of Innovation Labs at Itahari International College
                                </h2>
                                <p className="text-sm leading-relaxed text-foreground/70">
                                    We love welcoming new collaborators into the lab. Reach out at least 48 hours in advance so we can prep the right team and gear for you.
                                </p>
                            </div>
                            <div className="aspect-[4/3] border border-foreground/10 bg-muted/40 flex items-center justify-center text-sm text-foreground/50">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13948.090852794756!2d87.3058053!3d26.6498704!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e1!3m2!1sen!2snp!4v1762175844952!5m2!1sen!2snp" width="600" height="450" className="border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
