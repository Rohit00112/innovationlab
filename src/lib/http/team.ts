import { apiRequest } from "./api-client";
import type {
    CreateTeamMemberPayload,
    TeamMemberCategory,
    TeamMemberRecord,
    UpdateTeamMemberPayload
} from "@/lib/types/team";

interface ListTeamMembersParams {
    category?: TeamMemberCategory;
    activeOnly?: boolean;
}

interface TeamMembersResponse {
    data: TeamMemberRecord[];
}

interface TeamMemberResponse {
    data: TeamMemberRecord;
}

export async function listTeamMembers(
    params: ListTeamMembersParams = {}
): Promise<TeamMemberRecord[]> {
    const query = new URLSearchParams();

    if (params.category) {
        query.set("category", params.category);
    }

    if (params.activeOnly !== undefined) {
        query.set("activeOnly", String(params.activeOnly));
    }

    const queryString = query.toString();
    const url = queryString ? `/api/team?${queryString}` : "/api/team";

    const response = await apiRequest<TeamMembersResponse>(url);
    return response.data;
}

export async function getTeamMember(id: number): Promise<TeamMemberRecord> {
    const response = await apiRequest<TeamMemberResponse>(`/api/team/${id}`);
    return response.data;
}

export async function createTeamMember(
    payload: CreateTeamMemberPayload
): Promise<TeamMemberRecord> {
    const response = await apiRequest<TeamMemberResponse>("/api/team", {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return response.data;
}

export async function updateTeamMember(
    id: number,
    payload: UpdateTeamMemberPayload
): Promise<TeamMemberRecord> {
    const response = await apiRequest<TeamMemberResponse>(`/api/team/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
    return response.data;
}

export async function deleteTeamMember(id: number): Promise<void> {
    await apiRequest(`/api/team/${id}`, {
        method: "DELETE"
    });
}
