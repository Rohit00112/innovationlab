import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        // Require authenticated user
        await requireUser();

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "uploads";
        const resourceType = (formData.get("resourceType") as string) || "auto";

        if (!file) {
            throw new ApiError(400, "No file provided");
        }

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new ApiError(500, "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.");
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        // We use "auto" resource_type for all files. For non-image files like PDFs,
        // Cloudinary stores them under /image/upload/ but the proxy at /api/download
        // serves them with correct Content-Type headers for in-browser viewing.
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `innovationlab/${folder}`,
            resource_type: "auto",
            // Use original filename without extension as public_id prefix
            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_")}`,
        });

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                resourceType: result.resource_type,
            },
        });
    } catch (error) {
        console.error("[upload] Error:", error);
        return toErrorResponse(error);
    }
}
