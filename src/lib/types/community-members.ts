export const COMMUNITY_MEMBER_ROLES = [
    "lead",
    "member",
    "advisor"
] as const;

export type CommunityMemberRole = (typeof COMMUNITY_MEMBER_ROLES)[number];

export interface CommunityMemberRecord {
    id: number;
    communityId: number;
    name: string;
    title: string | null;
    email: string | null;
    bio: string | null;
    avatarUrl: string | null;
    role: CommunityMemberRole;
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    displayOrder: number;
    isActive: boolean;
    joinedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommunityMemberPayload {
    name: string;
    title?: string | null;
    email?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    role?: CommunityMemberRole;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    joinedAt?: string | null;
}

export interface UpdateCommunityMemberPayload {
    name?: string;
    title?: string | null;
    email?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    role?: CommunityMemberRole;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    joinedAt?: string | null;
}
