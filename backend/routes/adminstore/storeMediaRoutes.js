import express from "express";
import upload from "../../middleware/uploadMiddleware.js";
import { cloudinary } from "../../config/cloudinary.js";

const router = express.Router();

// Single file upload
router.post("/single", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                url: req.file.path,
                publicId: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                format: req.file.format || req.file.mimetype
            }
        });
    } catch (error) {
        console.error("Single upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }
});

// Multiple files upload
router.post("/multiple", upload.array("files", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            originalName: file.originalname,
            size: file.size,
            format: file.format || file.mimetype
        }));

        res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            data: uploadedFiles
        });
    } catch (error) {
        console.error("Multiple upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }
});

// Delete file from Cloudinary
router.delete("/:publicId", async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID is required"
            });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
                data: result
            });
        } else {
            res.status(404).json({
                success: false,
                message: "File not found or already deleted"
            });
        }
    } catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: error.message
        });
    }
});

// Get file info from Cloudinary
router.get("/:publicId", async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID is required"
            });
        }

        // Get resource info from Cloudinary
        const result = await cloudinary.api.resource(publicId);

        res.status(200).json({
            success: true,
            message: "File info retrieved successfully",
            data: {
                publicId: result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height,
                size: result.bytes,
                createdAt: result.created_at
            }
        });
    } catch (error) {
        console.error("Get file info error:", error);
        if (error.http_code === 404) {
            res.status(404).json({
                success: false,
                message: "File not found"
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to get file info",
                error: error.message
            });
        }
    }
});

// Bulk delete files
router.post("/bulk-delete", async (req, res) => {
    try {
        const { publicIds } = req.body;

        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Public IDs array is required"
            });
        }

        // Delete multiple files from Cloudinary
        const result = await cloudinary.api.delete_resources(publicIds);

        res.status(200).json({
            success: true,
            message: "Files deleted successfully",
            data: result
        });
    } catch (error) {
        console.error("Bulk delete error:", error);
        res.status(500).json({
            success: false,
            message: "Bulk delete failed",
            error: error.message
        });
    }
});

// Image transformation (resize, crop, etc.)
router.post("/transform", async (req, res) => {
    try {
        const { publicId, transformations } = req.body;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID is required"
            });
        }

        // Generate transformed URL
        const transformedUrl = cloudinary.url(publicId, transformations);

        res.status(200).json({
            success: true,
            message: "Transformation URL generated successfully",
            data: {
                originalPublicId: publicId,
                transformedUrl: transformedUrl,
                transformations: transformations
            }
        });
    } catch (error) {
        console.error("Transform error:", error);
        res.status(500).json({
            success: false,
            message: "Transformation failed",
            error: error.message
        });
    }
});

export default router;
