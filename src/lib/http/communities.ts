import { apiRequest } from "@/lib/http/api-client";
import {
    type CommunityRecord,
    type CommunityWithMemberCount,
    type CommunityStatus,
    type CreateCommunityPayload,
    type UpdateCommunityPayload
} from "@/lib/types/communities";
import {
    type CommunityMemberRecord,
    type CommunityMemberRole,
    type CreateCommunityMemberPayload,
    type UpdateCommunityMemberPayload
} from "@/lib/types/community-members";

// Communities

export interface CommunityListFilters {
    status?: CommunityStatus | "all";
    includeCount?: boolean;
    limit?: number;
    offset?: number;
}

function buildCommunityQuery(params: CommunityListFilters) {
    const query = new URLSearchParams();

    if (params.status && params.status !== "all") {
        query.set("status", params.status);
    }

    if (params.includeCount) {
        query.set("includeCount", "true");
    }

    if (typeof params.limit === "number") {
        query.set("limit", String(params.limit));
    }

    if (typeof params.offset === "number") {
        query.set("offset", String(params.offset));
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
}

export async function listCommunities(
    params: CommunityListFilters = {}
): Promise<CommunityRecord[]> {
    const response = await apiRequest<{ data: CommunityRecord[] }>(
        `/api/communities${buildCommunityQuery(params)}`
    );
    return response.data;
}

export async function listCommunitiesWithCount(
    params: Omit<CommunityListFilters, "includeCount"> = {}
): Promise<CommunityWithMemberCount[]> {
    const response = await apiRequest<{ data: CommunityWithMemberCount[] }>(
        `/api/communities${buildCommunityQuery({ ...params, includeCount: true })}`
    );
    return response.data;
}

export async function getCommunity(id: number): Promise<CommunityRecord> {
    const response = await apiRequest<{ data: CommunityRecord }>(
        `/api/communities/${id}`
    );
    return response.data;
}

export async function createCommunity(payload: CreateCommunityPayload): Promise<CommunityRecord> {
    const response = await apiRequest<{ data: CommunityRecord }>(`/api/communities`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return response.data;
}

export async function updateCommunity(id: number, payload: UpdateCommunityPayload): Promise<CommunityRecord> {
    const response = await apiRequest<{ data: CommunityRecord }>(`/api/communities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
    return response.data;
}

export async function deleteCommunity(id: number): Promise<void> {
    await apiRequest(`/api/communities/${id}`, { method: "DELETE" });
}

// Community Members

export interface CommunityMemberListFilters {
    role?: CommunityMemberRole | "all";
    activeOnly?: boolean;
}

function buildMemberQuery(params: CommunityMemberListFilters) {
    const query = new URLSearchParams();

    if (params.role && params.role !== "all") {
        query.set("role", params.role);
    }

    if (params.activeOnly !== undefined) {
        query.set("activeOnly", String(params.activeOnly));
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
}

export async function listCommunityMembers(
    communityId: number,
    params: CommunityMemberListFilters = {}
): Promise<CommunityMemberRecord[]> {
    const response = await apiRequest<{ data: CommunityMemberRecord[] }>(
        `/api/communities/${communityId}/members${buildMemberQuery(params)}`
    );
    return response.data;
}

export async function addCommunityMember(
    communityId: number,
    payload: CreateCommunityMemberPayload
): Promise<CommunityMemberRecord> {
    const response = await apiRequest<{ data: CommunityMemberRecord }>(
        `/api/communities/${communityId}/members`,
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );
    return response.data;
}

export async function updateCommunityMember(
    communityId: number,
    memberId: number,
    payload: UpdateCommunityMemberPayload
): Promise<CommunityMemberRecord> {
    const response = await apiRequest<{ data: CommunityMemberRecord }>(
        `/api/communities/${communityId}/members/${memberId}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload)
        }
    );
    return response.data;
}

export async function removeCommunityMember(
    communityId: number,
    memberId: number
): Promise<void> {
    await apiRequest(`/api/communities/${communityId}/members/${memberId}`, {
        method: "DELETE"
    });
}
