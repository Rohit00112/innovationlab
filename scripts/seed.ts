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

const SAMPLE_MILESTONES = [
    {
        year: "2015",
        title: "Foundation",
        description:
            "Innovation Lab was established at Itahari International College with a vision to create a collaborative space for student innovation.",
        displayOrder: 0,
    },
    {
        year: "2018",
        title: "First Breakthrough",
        description:
            "Successfully launched our first major project, gaining recognition from industry partners.",
        displayOrder: 1,
    },
    {
        year: "2021",
        title: "Expansion",
        description:
            "Expanded our programs and partnerships, reaching international collaborators and broadening our impact.",
        displayOrder: 2,
    },
    {
        year: "2024",
        title: "Recognition",
        description:
            "Received multiple awards for innovation and community impact, solidifying our position as a leading student innovation hub.",
        displayOrder: 3,
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
        // 2. Seed Milestones
        // =========================================================================
        console.log("\n🏆 Seeding milestones...");

        for (const milestone of SAMPLE_MILESTONES) {
            const existing = await db
                .select({ id: schema.milestones.id })
                .from(schema.milestones)
                .where(
                    and(
                        eq(schema.milestones.year, milestone.year),
                        eq(schema.milestones.title, milestone.title)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                console.log(`   ⏭️  ${milestone.year} - ${milestone.title} already exists`);
            } else {
                await db.insert(schema.milestones).values(milestone);
                console.log(`   ✅ ${milestone.year} - ${milestone.title} created`);
            }
        }

        // =========================================================================
        // 3. Seed Events
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
        // 4. Seed Testimonials
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
        // 5. Seed Team Members
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
        // 6. Seed Communities
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
        // 7. Seed FAQs
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
        console.log(`   - Milestones: ${SAMPLE_MILESTONES.length}`);
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
