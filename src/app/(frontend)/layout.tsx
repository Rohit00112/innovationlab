import { Navbar } from "@/components/sections/nav-bar";
import { Footer } from "@/components/sections/footer";

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
