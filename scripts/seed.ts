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
    /neon\.tech/.test(connectionString) ||
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

// Sample News Articles
const SAMPLE_NEWS = [
    {
        title: "Innovation Lab Launches New AI Research Initiative",
        slug: "ai-research-initiative-2024",
        excerpt: "We're excited to announce our new AI research program focusing on machine learning applications for social good.",
        content: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "Innovation Lab is proud to announce the launch of our new AI Research Initiative, a comprehensive program designed to explore the frontiers of artificial intelligence and machine learning." }] },
                    { type: "paragraph", children: [{ type: "text", text: "This initiative will focus on developing AI solutions that address real-world challenges in education, healthcare, and environmental sustainability." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        status: "published" as const,
        publishedAt: new Date(),
    },
    {
        title: "Student Team Wins National Hackathon",
        slug: "national-hackathon-victory",
        excerpt: "Our student team secured first place at the National Innovation Hackathon with their sustainable energy solution.",
        content: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "Congratulations to our amazing student team who brought home the gold at this year's National Innovation Hackathon!" }] },
                    { type: "paragraph", children: [{ type: "text", text: "Their project, 'GreenGrid', is an innovative smart energy management system that helps reduce electricity waste in residential buildings." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        status: "published" as const,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
        title: "New Partnership with Tech Industry Leaders",
        slug: "industry-partnership-announcement",
        excerpt: "Innovation Lab establishes strategic partnerships with leading technology companies to enhance student opportunities.",
        content: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "We are thrilled to announce new partnerships with several leading technology companies that will provide our students with unprecedented learning and career opportunities." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        status: "published" as const,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
];

// Sample Events
const SAMPLE_EVENTS = [
    {
        title: "Innovation Summit 2026",
        slug: "innovation-summit-2026",
        summary: "Join us for our annual innovation summit featuring keynote speakers, workshops, and networking opportunities.",
        description: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "The Innovation Summit 2026 is our flagship event bringing together students, researchers, and industry professionals to explore the latest trends in technology and innovation." }] },
                    { type: "paragraph", children: [{ type: "text", text: "This year's theme focuses on 'Sustainable Innovation' with sessions covering AI, renewable energy, and digital transformation." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        location: "Innovation Lab Main Hall",
        startsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        endsAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
        status: "published" as const,
        publishedAt: new Date(),
        hasRegistration: true,
    },
    {
        title: "Web Development Workshop",
        slug: "web-dev-workshop-feb-2026",
        summary: "Hands-on workshop covering modern web development with React and Next.js.",
        description: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "Learn to build modern web applications with React and Next.js in this intensive hands-on workshop." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        location: "Computer Lab 3",
        startsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "published" as const,
        publishedAt: new Date(),
        hasRegistration: true,
    },
    {
        title: "AI/ML Study Group",
        slug: "ai-ml-study-group",
        summary: "Weekly study group exploring artificial intelligence and machine learning concepts.",
        description: JSON.stringify({
            root: {
                children: [
                    { type: "paragraph", children: [{ type: "text", text: "Join our weekly AI/ML study group where we explore fundamental concepts and work on practical projects together." }] }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1
            }
        }),
        location: "Innovation Lab Meeting Room",
        startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "published" as const,
        publishedAt: new Date(),
        hasRegistration: true,
    },
];

// Sample Testimonials
const SAMPLE_TESTIMONIALS = [
    {
        headline: "Life-changing experience",
        body: "Innovation Lab completely transformed my approach to problem-solving. The mentorship and resources available helped me launch my first startup while still in college.",
        authorName: "Priya Sharma",
        authorTitle: "Software Engineer",
        company: "Google",
        isFeatured: true,
        status: "published" as const,
        publishedAt: new Date(),
    },
    {
        headline: "Incredible learning environment",
        body: "The collaborative atmosphere at Innovation Lab is unmatched. I've learned more practical skills here than in any classroom.",
        authorName: "Rajesh Adhikari",
        authorTitle: "Product Manager",
        company: "Microsoft",
        isFeatured: true,
        status: "published" as const,
        publishedAt: new Date(),
    },
    {
        headline: "Where dreams become reality",
        body: "Thanks to Innovation Lab, I was able to turn my idea into a working prototype and present it to real investors. The support from mentors was invaluable.",
        authorName: "Anita Gurung",
        authorTitle: "Founder & CEO",
        company: "TechStart Nepal",
        isFeatured: false,
        status: "published" as const,
        publishedAt: new Date(),
    },
];

// Sample Team Members
const SAMPLE_TEAM_MEMBERS = [
    {
        name: "Dr. Suresh Thapa",
        position: "Lab Director",
        bio: "Dr. Thapa leads Innovation Lab with over 15 years of experience in technology education and research.",
        category: "head" as const,
        displayOrder: 1,
        isActive: true,
    },
    {
        name: "Sita Rai",
        position: "Program Coordinator",
        bio: "Sita manages our programs and ensures students have the resources they need to succeed.",
        category: "core" as const,
        displayOrder: 2,
        isActive: true,
    },
    {
        name: "Bikash Shrestha",
        position: "Technical Lead",
        bio: "Bikash oversees technical projects and mentors students on software development best practices.",
        category: "core" as const,
        displayOrder: 3,
        isActive: true,
    },
    {
        name: "Prof. Maya Karki",
        position: "Senior Mentor",
        bio: "Prof. Karki brings industry expertise and guides students on research methodologies.",
        category: "mentor" as const,
        displayOrder: 4,
        isActive: true,
    },
];

// Sample Communities
const SAMPLE_COMMUNITIES = [
    {
        name: "Web Development Club",
        slug: "web-dev-club",
        description: "A community of passionate web developers building modern applications.",
        status: "published" as const,
        displayOrder: 1,
    },
    {
        name: "AI & Machine Learning Society",
        slug: "ai-ml-society",
        description: "Exploring the frontiers of artificial intelligence and machine learning together.",
        status: "published" as const,
        displayOrder: 2,
    },
    {
        name: "Open Source Contributors",
        slug: "open-source-contributors",
        description: "Contributing to open source projects and learning collaborative development.",
        status: "published" as const,
        displayOrder: 3,
    },
];

// Sample FAQs
const SAMPLE_FAQS = [
    {
        question: "How can I join Innovation Lab?",
        answer: "Any student can join Innovation Lab! Simply visit our lab during open hours or attend one of our events. You can also register through our events page for specific programs.",
        category: "membership" as const,
        displayOrder: 1,
        isActive: true,
    },
    {
        question: "What resources are available at the lab?",
        answer: "We provide access to high-performance computing resources, 3D printers, electronics workstations, meeting rooms, and a comprehensive library of technical resources.",
        category: "general" as const,
        displayOrder: 2,
        isActive: true,
    },
    {
        question: "Are there any membership fees?",
        answer: "No, Innovation Lab is free for all students of the college. Some specialized workshops may have material costs, but core membership is always free.",
        category: "membership" as const,
        displayOrder: 3,
        isActive: true,
    },
    {
        question: "Can I get mentorship for my project?",
        answer: "Absolutely! We have dedicated mentors who can guide you through your projects. Schedule a mentoring session through our website or drop by during mentor hours.",
        category: "support" as const,
        displayOrder: 4,
        isActive: true,
    },
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
        // 3. Seed News Articles
        // =========================================================================
        console.log("\n📰 Seeding news articles...");

        const existingNews = await db
            .select({ slug: schema.news.slug })
            .from(schema.news)
            .limit(1);

        if (existingNews.length > 0) {
            console.log("   ⏭️  News articles already exist, skipping...");
        } else {
            for (const article of SAMPLE_NEWS) {
                await db.insert(schema.news).values(article);
                console.log(`   ✅ News: "${article.title}" created`);
            }
        }

        // =========================================================================
        // 4. Seed Events
        // =========================================================================
        console.log("\n📅 Seeding events...");

        const existingEvents = await db
            .select({ slug: schema.events.slug })
            .from(schema.events)
            .limit(1);

        if (existingEvents.length > 0) {
            console.log("   ⏭️  Events already exist, skipping...");
        } else {
            for (const event of SAMPLE_EVENTS) {
                await db.insert(schema.events).values(event);
                console.log(`   ✅ Event: "${event.title}" created`);
            }
        }

        // =========================================================================
        // 5. Seed Testimonials
        // =========================================================================
        console.log("\n💬 Seeding testimonials...");

        const existingTestimonials = await db
            .select({ id: schema.testimonials.id })
            .from(schema.testimonials)
            .limit(1);

        if (existingTestimonials.length > 0) {
            console.log("   ⏭️  Testimonials already exist, skipping...");
        } else {
            for (const testimonial of SAMPLE_TESTIMONIALS) {
                await db.insert(schema.testimonials).values(testimonial);
                console.log(`   ✅ Testimonial from "${testimonial.authorName}" created`);
            }
        }

        // =========================================================================
        // 6. Seed Team Members
        // =========================================================================
        console.log("\n👥 Seeding team members...");

        const existingTeam = await db
            .select({ id: schema.teamMembers.id })
            .from(schema.teamMembers)
            .limit(1);

        if (existingTeam.length > 0) {
            console.log("   ⏭️  Team members already exist, skipping...");
        } else {
            for (const member of SAMPLE_TEAM_MEMBERS) {
                await db.insert(schema.teamMembers).values(member);
                console.log(`   ✅ Team member: "${member.name}" created`);
            }
        }

        // =========================================================================
        // 7. Seed Communities
        // =========================================================================
        console.log("\n🏘️ Seeding communities...");

        const existingCommunities = await db
            .select({ slug: schema.communities.slug })
            .from(schema.communities)
            .limit(1);

        if (existingCommunities.length > 0) {
            console.log("   ⏭️  Communities already exist, skipping...");
        } else {
            for (const community of SAMPLE_COMMUNITIES) {
                await db.insert(schema.communities).values(community);
                console.log(`   ✅ Community: "${community.name}" created`);
            }
        }

        // =========================================================================
        // 8. Seed FAQs
        // =========================================================================
        console.log("\n❓ Seeding FAQs...");

        const existingFaqs = await db
            .select({ id: schema.faqs.id })
            .from(schema.faqs)
            .limit(1);

        if (existingFaqs.length > 0) {
            console.log("   ⏭️  FAQs already exist, skipping...");
        } else {
            for (const faq of SAMPLE_FAQS) {
                await db.insert(schema.faqs).values(faq);
                console.log(`   ✅ FAQ: "${faq.question.substring(0, 40)}..." created`);
            }
        }

        // =========================================================================
        // Done
        // =========================================================================
        console.log("\n✨ Database seed completed successfully!\n");
        console.log("📋 Summary:");
        console.log(`   - Admin email: ${ADMIN_EMAIL}`);
        console.log(`   - Site content pages: ${SITE_CONTENT_SEEDS.length}`);
        console.log(`   - News articles: ${SAMPLE_NEWS.length}`);
        console.log(`   - Events: ${SAMPLE_EVENTS.length}`);
        console.log(`   - Testimonials: ${SAMPLE_TESTIMONIALS.length}`);
        console.log(`   - Team members: ${SAMPLE_TEAM_MEMBERS.length}`);
        console.log(`   - Communities: ${SAMPLE_COMMUNITIES.length}`);
        console.log(`   - FAQs: ${SAMPLE_FAQS.length}`);
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
