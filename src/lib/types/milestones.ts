export interface MilestoneRecord {
    id: number;
    year: string;
    title: string;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMilestonePayload {
    year: string;
    title: string;
    description?: string | null;
    displayOrder?: number;
}

export interface UpdateMilestonePayload {
    year?: string;
    title?: string;
    description?: string | null;
    displayOrder?: number;
}
