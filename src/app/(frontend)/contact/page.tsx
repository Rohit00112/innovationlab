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

import { useSiteContent } from "@/lib/hooks/use-site-content";
import { type ContactPageContent, DEFAULT_CONTACT_CONTENT } from "@/lib/types/site-content";

export default function ContactPage() {
    // Fetch dynamic content
    const { content } = useSiteContent<ContactPageContent>("contact", "main", DEFAULT_CONTACT_CONTENT);
    const actualContent = content || DEFAULT_CONTACT_CONTENT;

    // Fixed icons and colors mapped by index to match the Admin's default order
    const detailStyles = [
        { icon: MapPin, color: "bg-blue-500/10 text-blue-600" },
        { icon: Phone, color: "bg-green-500/10 text-green-600" },
        { icon: Mail, color: "bg-purple-500/10 text-purple-600" },
        { icon: Clock, color: "bg-orange-500/10 text-orange-600" },
    ];

    const contactDetails = (actualContent.contactDetails || DEFAULT_CONTACT_CONTENT.contactDetails).map((detail, index) => {
        const style = detailStyles[index] || detailStyles[0];
        return {
            ...detail,
            ...style
        };
    });

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
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
            </div>

            <section className="relative min-h-[60vh] flex items-center pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                    <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] items-start">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    {actualContent.heroSubtitle || "Get in Touch"}
                                </div>
                                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
                                    {actualContent.heroTitle?.split(" ").slice(0, 2).join(" ") || "Let's Build"} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                        {actualContent.heroTitle?.split(" ").slice(2).join(" ") || "Something Great"}
                                    </span>
                                </h1>
                                <p className="text-lg leading-relaxed text-foreground/70 max-w-xl">
                                    {actualContent.heroDescription}
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {contactDetails.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.title}
                                            className="group glass-card p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-300"
                                        >
                                            <div className="flex flex-col gap-4">
                                                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/20 shadow-xl relative overflow-hidden">
                            {/* Form Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>

                            <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                            <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

                            {statusMessage && (
                                <div
                                    className={`mb-6 rounded-xl border p-4 text-sm leading-relaxed flex items-center gap-3 ${status === "success"
                                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-destructive/40 bg-destructive/10 text-destructive"
                                        }`}
                                >
                                    {status === "success" && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                    {statusMessage}
                                </div>
                            )}

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                    className="space-y-5"
                                    noValidate
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wide font-semibold text-foreground/70">Full name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="John Doe"
                                                            autoComplete="name"
                                                            className="rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11"
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
                                                    <FormLabel className="text-xs uppercase tracking-wide font-semibold text-foreground/70">Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            autoComplete="email"
                                                            className="rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wide font-semibold text-foreground/70">Subject</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="How can we help?"
                                                        autoComplete="off"
                                                        className="rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11"
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
                                                <FormLabel className="text-xs uppercase tracking-wide font-semibold text-foreground/70">Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us more about your project..."
                                                        rows={5}
                                                        className="rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none p-4"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
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
                                    <p className="text-xs text-muted-foreground text-center pt-2">
                                        By submitting, you agree to our privacy policy and terms.
                                    </p>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 mb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50">
                        <div className="grid gap-0 lg:grid-cols-2 lg:items-center">
                            <div className="p-10 lg:p-16 space-y-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
                                    Location
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                    {actualContent.locationTitle || "Visit Innovation Labs"}
                                </h2>
                                <p className="text-lg leading-relaxed text-foreground/70">
                                    {actualContent.locationDescription || "We love welcoming new collaborators into the lab. Reach out at least 48 hours in advance so we can prep the right team and gear for you."}
                                </p>
                                <Button variant="outline" className="rounded-full mt-4 border-primary/20 hover:bg-primary/5 hover:text-primary">
                                    Get Directions <MapPin className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="aspect-[4/3] lg:aspect-auto lg:h-full w-full bg-muted/40 relative min-h-[400px]">
                                <iframe
                                    src={actualContent.mapEmbedUrl}
                                    className="absolute inset-0 w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-500"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
