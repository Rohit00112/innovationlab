/**
 * Database Seed Script
 *
 * Seeds the database with:
 * - Admin user (from environment variables)
 * - Default site content for all pages
 *
 * Usage:
 *   npm run db:seed
 *
 * Environment variables required:
 *   - DATABASE_URL: PostgreSQL connection string
 *   - ADMIN_EMAIL: Admin user email (default: admin@innovationlab.com)
 *   - ADMIN_PASSWORD: Admin user password (REQUIRED)
 *   - ADMIN_NAME: Admin user name (default: Admin)
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../src/lib/db/schema";

// =============================================================================
// Configuration
// =============================================================================

const connectionString =
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/postgres";

const enableSSL =
    process.env.POSTGRES_SSL === "true" ||
    /supabase\.co/.test(connectionString) ||
    process.env.NODE_ENV === "production";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@innovationlab.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

const SALT_ROUNDS = Number.parseInt(
    process.env.AUTH_BCRYPT_SALT_ROUNDS ?? "12",
    10
);

// =============================================================================
// Default Content Data
// =============================================================================

const DEFAULT_HOME_CONTENT = {
    heroTitle: "INNOVATION LABS",
    heroSubtitle: "Where Ideas Come Alive",
    heroDescription:
        "A collaborative space for students to explore, create, and innovate.",
    capabilityTiles: [
        {
            title: "Recognize chiya cups",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            title: "Machine Translation",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            title: "Context-aware Search",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            title: "Responsible AI",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
    ],
    achievementStats: [
        { value: "500+", label: "Projects delivered" },
        { value: "12+", label: "Years of momentum" },
        { value: "50+", label: "Collaborators" },
        { value: "25", label: "Awards & honours" },
    ],
};

const DEFAULT_ABOUT_CONTENT = {
    heroTitle: "SHAPING THE FUTURE",
    heroSubtitle: "About Us",
    heroDescription:
        "At Innovation Lab, we transform bold ideas into real-world solutions through technology, creativity, and collaborative innovation.",
    missionPanels: [
        {
            title: "Mission",
            subtitle: "Empower Innovators",
            description:
                "We provide students with the resources, mentorship, and collaborative environment needed to transform bold ideas into impactful solutions.",
        },
        {
            title: "Vision",
            subtitle: "Lead Innovation",
            description:
                "To become a leading innovation hub that bridges academia and industry, fostering a culture of creativity, experimentation, and technological advancement.",
        },
        {
            title: "Approach",
            subtitle: "Learning by Building",
            description:
                "Hands-on project-based learning combined with industry mentorship, enabling students to gain practical experience while developing innovative solutions.",
        },
        {
            title: "Community",
            subtitle: "Inclusive by Design",
            description:
                "A diverse and welcoming community where every voice is heard, collaboration is celebrated, and innovation thrives through collective effort.",
        },
    ],
    values: [
        {
            title: "Passion",
            description:
                "Driven by curiosity and enthusiasm to explore new technologies and push the boundaries of what's possible.",
        },
        {
            title: "Collaboration",
            description:
                "Working together across disciplines to create solutions that are greater than the sum of their parts.",
        },
        {
            title: "Innovation",
            description:
                "Constantly seeking new approaches, embracing failure as learning, and iterating toward breakthrough solutions.",
        },
        {
            title: "Impact",
            description:
                "Creating meaningful change that extends beyond the lab, benefiting communities and society at large.",
        },
    ],
    milestones: [
        {
            year: "2015",
            title: "Foundation",
            description:
                "Innovation Lab was established at Itahari International College with a vision to create a collaborative space for student innovation.",
        },
        {
            year: "2018",
            title: "First Breakthrough",
            description:
                "Successfully launched our first major project, gaining recognition from industry partners.",
        },
        {
            year: "2021",
            title: "Expansion",
            description:
                "Expanded our programs and partnerships, reaching international collaborators and broadening our impact.",
        },
        {
            year: "2024",
            title: "Recognition",
            description:
                "Received multiple awards for innovation and community impact, solidifying our position as a leading student innovation hub.",
        },
    ],
    achievements: [
        { value: "500+", label: "Projects delivered" },
        { value: "12+", label: "Years of momentum" },
        { value: "50+", label: "Collaborators" },
        { value: "25", label: "Awards & honours" },
    ],
};

const DEFAULT_CONTACT_CONTENT = {
    heroTitle: "Let's Build Something Great",
    heroSubtitle: "Get in Touch",
    heroDescription:
        "Whether you're exploring collaboration, need support on a project, or want a tour of the lab, we're here to help.",
    contactDetails: [
        {
            title: "Visit the Lab",
            description:
                "Itahari International College, 4th Floor Innovation Wing, Sunsari 56705",
        },
        {
            title: "Talk With Us",
            description: "+977-25-525123 (Sun–Fri, 9:00 AM – 5:00 PM)",
        },
        { title: "Write to Us", description: "hello@innovationlab.com" },
        {
            title: "Open Hours",
            description:
                "Drop-in mentoring every Wednesday & Thursday, 2:00 PM – 4:00 PM.",
        },
    ],
    locationTitle: "Visit Innovation Labs",
    locationDescription:
        "We love welcoming new collaborators into the lab. Reach out at least 48 hours in advance so we can prep the right team and gear for you.",
    mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13948.090852794756!2d87.3058053!3d26.6498704!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e1!3m2!1sen!2snp!4v1762175844952!5m2!1sen!2snp",
};

const DEFAULT_GLOBAL_CONTENT = {
    siteName: "Innovation Labs",
    siteTagline: "Where Ideas Come Alive",
    footerText:
        "Innovation Labs is a collaborative space for students to explore, create, and innovate at Itahari International College.",
    copyrightText: "© 2024 Innovation Labs. All rights reserved.",
    socialLinks: [
        { platform: "Facebook", url: "https://facebook.com/innovationlabs" },
        { platform: "Twitter", url: "https://twitter.com/innovationlabs" },
        { platform: "LinkedIn", url: "https://linkedin.com/company/innovationlabs" },
        { platform: "GitHub", url: "https://github.com/innovationlabs" },
    ],
};

const DEFAULT_NAVIGATION_CONTENT = {
    navItems: [
        { id: "home", label: "Home", href: "/", visible: true, order: 1 },
        { id: "about", label: "About", href: "/about", visible: true, order: 2 },
        { id: "news", label: "News", href: "/news", visible: true, order: 3 },
        { id: "events", label: "Events", href: "/events", visible: true, order: 4 },
        { id: "communities", label: "Communities", href: "/communities", visible: true, order: 5 },
        { id: "contact", label: "Contact", href: "/contact", visible: true, order: 6 },
    ],
    showGetStartedButton: true,
    getStartedButtonText: "Get Started",
    getStartedButtonLink: "/events",
};

// Site content to seed
const SITE_CONTENT_SEEDS = [
    { pageKey: "home", sectionKey: "main", content: DEFAULT_HOME_CONTENT },
    { pageKey: "about", sectionKey: "main", content: DEFAULT_ABOUT_CONTENT },
    { pageKey: "contact", sectionKey: "main", content: DEFAULT_CONTACT_CONTENT },
    { pageKey: "global", sectionKey: "settings", content: DEFAULT_GLOBAL_CONTENT },
    { pageKey: "global", sectionKey: "navigation", content: DEFAULT_NAVIGATION_CONTENT },
];

// =============================================================================
// Main Seed Function
// =============================================================================

async function seed() {
    console.log("🌱 Starting database seed...\n");

    // Validate required environment variables
    if (!ADMIN_PASSWORD) {
        console.error("❌ Error: ADMIN_PASSWORD environment variable is required");
        console.error("   Set it in your .env.local file or pass it as an environment variable:");
        console.error("   ADMIN_PASSWORD=your-secure-password npm run db:seed\n");
        process.exit(1);
    }

    // Create database connection
    const client = postgres(connectionString, {
        ssl: enableSSL ? { rejectUnauthorized: false } : undefined,
        max: 1,
    });

    const db = drizzle(client, { schema });

    try {
        // =========================================================================
        // 1. Seed Admin User
        // =========================================================================
        console.log("👤 Seeding admin user...");

        const existingAdmin = await db
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.email, ADMIN_EMAIL.toLowerCase()))
            .limit(1);

        if (existingAdmin.length > 0) {
            console.log(`   ⏭️  Admin user already exists (${ADMIN_EMAIL})`);
        } else {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

            await db.insert(schema.users).values({
                email: ADMIN_EMAIL.toLowerCase(),
                hashedPassword,
                name: ADMIN_NAME,
                role: "admin",
                status: "active",
            });

            console.log(`   ✅ Admin user created: ${ADMIN_EMAIL}`);
        }

        // =========================================================================
        // 2. Seed Site Content
        // =========================================================================
        console.log("\n📄 Seeding site content...");

        for (const { pageKey, sectionKey, content } of SITE_CONTENT_SEEDS) {
            const existing = await db
                .select({ id: schema.siteContent.id })
                .from(schema.siteContent)
                .where(
                    and(
                        eq(schema.siteContent.pageKey, pageKey),
                        eq(schema.siteContent.sectionKey, sectionKey)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                console.log(`   ⏭️  ${pageKey}/${sectionKey} already exists`);
            } else {
                await db.insert(schema.siteContent).values({
                    pageKey,
                    sectionKey,
                    content,
                });
                console.log(`   ✅ ${pageKey}/${sectionKey} created`);
            }
        }

        // =========================================================================
        // Done
        // =========================================================================
        console.log("\n✨ Database seed completed successfully!\n");
        console.log("📋 Summary:");
        console.log(`   - Admin email: ${ADMIN_EMAIL}`);
        console.log(`   - Site content pages: ${SITE_CONTENT_SEEDS.length}`);
        console.log("\n🔐 Remember to change the admin password after first login!\n");

    } catch (error) {
        console.error("\n❌ Seed failed:", error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run seed
seed();
