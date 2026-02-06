import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { milestones } from "@/lib/db/schema";

/**
 * Get all milestones ordered by displayOrder then year
 */
export async function getMilestones() {
    return db
        .select()
        .from(milestones)
        .orderBy(asc(milestones.displayOrder), asc(milestones.year));
}
