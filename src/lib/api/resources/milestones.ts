import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { milestones } from "@/lib/db/schema";

export const milestoneSelection = {
    id: milestones.id,
    year: milestones.year,
    title: milestones.title,
    description: milestones.description,
    displayOrder: milestones.displayOrder,
    createdAt: milestones.createdAt,
    updatedAt: milestones.updatedAt
};

export async function getMilestoneById(id: number) {
    const [milestone] = await db
        .select(milestoneSelection)
        .from(milestones)
        .where(eq(milestones.id, id))
        .limit(1);

    return milestone ?? null;
}
