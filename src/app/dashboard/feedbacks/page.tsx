import { db } from "@/lib/db";
import { feedbacks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function FeedbacksPage() {
    const allFeedbacks = await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Suggestions & Feedback</h1>
                <p className="text-muted-foreground mt-1">
                    Review what users are saying about the platform.
                </p>
            </div>

            <div className="grid gap-4">
                {allFeedbacks.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No feedback submitted yet.
                        </CardContent>
                    </Card>
                ) : (
                    allFeedbacks.map((feedback) => (
                        <Card key={feedback.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            feedback.category === "issue" ? "destructive" :
                                                feedback.category === "suggestion" ? "secondary" : "outline"
                                        } className="capitalize">
                                            {feedback.category}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {feedback.createdAt ? format(new Date(feedback.createdAt), "PPP p") : "Just now"}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base font-medium">
                                        {feedback.email || "Anonymous User"}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {feedback.message}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
