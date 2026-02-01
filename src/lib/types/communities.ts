export const COMMUNITY_STATUSES = [
    "draft",
    "published",
    "archived"
] as const;

export type CommunityStatus = (typeof COMMUNITY_STATUSES)[number];

export interface CommunityRecord {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    content: string | null;
    coverImageUrl: string | null;
    status: CommunityStatus;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityWithMemberCount extends CommunityRecord {
    memberCount: number;
}

export interface CreateCommunityPayload {
    name: string;
    slug?: string;
    description?: string | null;
    content?: string | null;
    coverImageUrl?: string | null;
    status?: CommunityStatus;
    displayOrder?: number;
}

export interface UpdateCommunityPayload {
    name?: string;
    slug?: string;
    description?: string | null;
    content?: string | null;
    coverImageUrl?: string | null;
    status?: CommunityStatus;
    displayOrder?: number;
}
