export type TeamMemberCategory = "head" | "core" | "mentor";

export const TEAM_MEMBER_CATEGORIES: TeamMemberCategory[] = [
    "head",
    "core",
    "mentor"
];

export interface TeamMemberRecord {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    photoUrl: string | null;
    email: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    category: TeamMemberCategory;
    displayOrder: number;
    isActive: boolean;
    joinedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamMemberPayload {
    name: string;
    position: string;
    bio?: string | null;
    photoUrl?: string | null;
    email?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    category?: TeamMemberCategory;
    displayOrder?: number;
    isActive?: boolean;
    joinedAt?: string | null;
}

export interface UpdateTeamMemberPayload {
    name?: string;
    position?: string;
    bio?: string | null;
    photoUrl?: string | null;
    email?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    category?: TeamMemberCategory;
    displayOrder?: number;
    isActive?: boolean;
    joinedAt?: string | null;
}
