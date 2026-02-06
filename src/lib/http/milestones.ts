import { apiRequest } from "./api-client";
import type {
    MilestoneRecord,
    CreateMilestonePayload,
    UpdateMilestonePayload,
} from "@/lib/types/milestones";

interface MilestonesResponse {
    data: MilestoneRecord[];
}

interface MilestoneResponse {
    data: MilestoneRecord;
}

export async function listMilestones(): Promise<MilestoneRecord[]> {
    const res = await apiRequest<MilestonesResponse>("/api/milestones");
    return res.data;
}

export async function createMilestone(payload: CreateMilestonePayload): Promise<MilestoneRecord> {
    const res = await apiRequest<MilestoneResponse>("/api/milestones", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.data;
}

export async function updateMilestone(id: number, payload: UpdateMilestonePayload): Promise<MilestoneRecord> {
    const res = await apiRequest<MilestoneResponse>(`/api/milestones/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return res.data;
}

export async function deleteMilestone(id: number): Promise<void> {
    await apiRequest(`/api/milestones/${id}`, {
        method: "DELETE",
    });
}
