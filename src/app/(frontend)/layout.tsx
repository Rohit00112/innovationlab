import { Navbar } from "@/components/sections/nav-bar";
import { Footer } from "@/components/sections/footer";
import { getSiteContent } from "@/lib/data/site-content";
import {
    GlobalContent,
    DEFAULT_GLOBAL_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const globalContent = await getSiteContent<GlobalContent>(
        PAGE_KEYS.GLOBAL,
        SECTION_KEYS.GLOBAL_SETTINGS
    ) || DEFAULT_GLOBAL_CONTENT;

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
