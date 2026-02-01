import { Navbar } from "@/components/sections/nav-bar";
import { Footer } from "@/components/sections/footer";
import { getSiteContent } from "@/lib/site-content";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

interface GlobalContent {
    siteName: string;
    siteTagline: string;
    footerText: string;
    copyrightText: string;
    socialLinks: { platform: string; url: string }[];
}

const DEFAULT_GLOBAL_CONTENT: GlobalContent = {
    siteName: "INNOVATION LAB",
    siteTagline: "Empowering Innovation",
    footerText: "Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation at Itahari International College.",
    copyrightText: "© 2025 Innovation Lab, Itahari International College. All rights reserved.",
    socialLinks: [
        { platform: "LinkedIn", url: "#" },
        { platform: "Twitter", url: "#" },
        { platform: "GitHub", url: "#" },
        { platform: "Email", url: "#" }
    ]
};

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const baseUrl = resolveApiBaseUrl();
    const globalContent = await getSiteContent<GlobalContent>("global", "settings", baseUrl) || DEFAULT_GLOBAL_CONTENT;

    return (
        <>
            <Navbar />
            {children}
            <Footer
                tagline={globalContent.siteTagline}
                description={globalContent.footerText}
                copyright={globalContent.copyrightText}
                socialLinks={globalContent.socialLinks}
            />
        </>
    );
}
