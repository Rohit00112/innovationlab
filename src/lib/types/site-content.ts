/**
 * Shared Site Content Types
 * Single source of truth for all site content type definitions
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Generic record structure returned from site content API
 */
export interface SiteContentRecord<T = unknown> {
    id: number;
    pageKey: string;
    sectionKey: string;
    content: T;
    createdAt?: string;
    updatedAt: string | Date;
}

/**
 * API response wrapper
 */
export interface SiteContentResponse<T = unknown> {
    success: boolean;
    data?: SiteContentRecord<T>;
    message?: string;
}

// =============================================================================
// CONTENT PAGE KEYS
// =============================================================================

export const PAGE_KEYS = {
    HOME: "home",
    ABOUT: "about",
    CONTACT: "contact",
    GLOBAL: "global",
} as const;

export const SECTION_KEYS = {
    // Main section for pages
    MAIN: "main",

    // Global sections
    GLOBAL_SETTINGS: "settings",

    // Navigation
    NAVIGATION: "navigation",
} as const;

// =============================================================================
// HOME PAGE CONTENT TYPES
// =============================================================================

export interface CapabilityTile {
    title: string;
    description: string;
}

export interface AchievementStat {
    value: string;
    label: string;
}

export interface HomePageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    capabilityTiles: CapabilityTile[];
    achievementStats: AchievementStat[];
}

// =============================================================================
// ABOUT PAGE CONTENT TYPES
// =============================================================================

export interface MissionPanel {
    title: string;
    subtitle: string;
    description: string;
}

export interface AboutValue {
    title: string;
    description: string;
}

export interface Milestone {
    year: string;
    title: string;
    description: string;
}

export interface AboutPageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    missionPanels: MissionPanel[];
    values: AboutValue[];
    milestones: Milestone[];
    achievements: AchievementStat[];
}

// =============================================================================
// CONTACT PAGE CONTENT TYPES
// =============================================================================

export interface ContactDetail {
    title: string;
    description: string;
}

export interface ContactPageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    contactDetails: ContactDetail[];
    locationTitle: string;
    locationDescription: string;
    mapEmbedUrl: string;
}

// =============================================================================
// GLOBAL SETTINGS CONTENT TYPES
// =============================================================================

export interface SocialLink {
    platform: string;
    url: string;
}

export interface GlobalContent {
    siteName: string;
    siteTagline: string;
    footerText: string;
    copyrightText: string;
    socialLinks: SocialLink[];
}

// =============================================================================
// NAVIGATION CONTENT TYPES
// =============================================================================

export interface NavItem {
    id: string;
    label: string;
    href: string;
    visible: boolean;
    order: number;
}

export interface NavigationContent {
    navItems: NavItem[];
    showGetStartedButton: boolean;
    getStartedButtonText: string;
    getStartedButtonLink: string;
}

// =============================================================================
// DEFAULT CONTENT VALUES
// =============================================================================

export const DEFAULT_HOME_CONTENT: HomePageContent = {
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

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
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

export const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
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

export const DEFAULT_GLOBAL_CONTENT: GlobalContent = {
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

export const DEFAULT_NAVIGATION_CONTENT: NavigationContent = {
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
