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
    ABOUT: "about",
} as const;

export const SECTION_KEYS = {
    // Main section for pages
    MAIN: "main",
} as const;

// =============================================================================
// ABOUT PAGE CONTENT TYPES
// =============================================================================

export interface Milestone {
    year: string;
    title: string;
    description: string;
}

export interface AboutPageContent {
    milestones: Milestone[];
}

// =============================================================================
// DEFAULT CONTENT VALUES
// =============================================================================

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
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
};
