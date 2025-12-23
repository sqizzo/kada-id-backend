import mongoose from "mongoose";

import { sendError, sendSuccess } from "../utils/response.js";
import { logActivity } from "../utils/activityLogger.js";
import ProgramSetting from "../models/ProgramSetting.js";

export const getAllProgramSettings = async (req, res) => {
  try {
    const programSettings = await ProgramSetting.find({}).sort({
      createdAt: -1,
    });

    return sendSuccess(
      res,
      programSettings,
      "Successfully get all settings",
      200
    );
  } catch (error) {
    console.error("Error get all account:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const getActiveProgram = async (req, res) => {
  try {
    const activeProgram = await ProgramSetting.findOne({ isActive: true });

    if (!activeProgram) {
      return sendError(res, "No active program found", null, 404);
    }

    return sendSuccess(res, activeProgram, "Active program found", 200);
  } catch (error) {
    console.error("Error getting active program:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const getProgramSettingById = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid program setting id", null, 400);
    }

    const programSetting = await ProgramSetting.findById(id);
    if (!programSetting) {
      return sendError(res, "Program setting not found", null, 404);
    }

    return sendSuccess(res, programSetting, "Program Setting found");
  } catch (error) {
    console.error("Error get all account:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const addProgramSetting = async (req, res) => {
  try {
    const body = req.body || {};
    const requiredFields = ["slug", "program", "schedule", "location"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length) {
      return sendError(
        res,
        `Missing required fields: ${missingFields.join(", ")}`,
        null,
        400
      );
    }

    if (typeof body.slug !== "string" || !body.slug.trim()) {
      return sendError(res, "Slug must be a non-empty string", null, 400);
    }

    const normalizedSlug = body.slug.trim();
    const duplicateSlug = await ProgramSetting.findOne({
      slug: normalizedSlug,
    });
    if (duplicateSlug) {
      return sendError(res, "Slug already in use", null, 409);
    }

    const newProgramSetting = await ProgramSetting.create({
      slug: normalizedSlug,
      isActive: body.isActive,
      program: body.program,
      schedule: body.schedule,
      participants: body.participants,
      location: body.location,
      programFeatures: body.programFeatures,
    });

    await logActivity({
      type: "general",
      userId: req.user?._id,
      message: `Created program setting ${newProgramSetting.slug}`,
      metadata: {
        programSettingId: newProgramSetting._id,
        slug: newProgramSetting.slug,
      },
    });

    return sendSuccess(
      res,
      newProgramSetting,
      "Program setting created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating program setting:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const updateProgramSetting = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid program setting id", null, 400);
    }

    const body = req.body || {};
    const allowedFields = [
      "slug",
      "isActive",
      "program",
      "schedule",
      "participants",
      "location",
      "programFeatures",
    ];

    const updatePayload = allowedFields.reduce((acc, field) => {
      if (body[field] !== undefined) {
        acc[field] = body[field];
      }
      return acc;
    }, {});

    if (!Object.keys(updatePayload).length) {
      return sendError(res, "No fields provided for update", null, 400);
    }

    if (updatePayload.slug) {
      if (
        typeof updatePayload.slug !== "string" ||
        !updatePayload.slug.trim()
      ) {
        return sendError(res, "Slug must be a non-empty string", null, 400);
      }
      updatePayload.slug = updatePayload.slug.trim();

      const duplicateSlug = await ProgramSetting.findOne({
        slug: updatePayload.slug,
        _id: { $ne: id },
      });
      if (duplicateSlug) {
        return sendError(res, "Slug already in use", null, 409);
      }
    }

    const updatedProgramSetting = await ProgramSetting.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedProgramSetting) {
      return sendError(res, "Program setting not found", null, 404);
    }

    await logActivity({
      type: "general",
      userId: req.user?._id,
      message: `Updated program setting ${updatedProgramSetting.slug}`,
      metadata: {
        programSettingId: updatedProgramSetting._id,
        slug: updatedProgramSetting.slug,
      },
    });

    return sendSuccess(
      res,
      updatedProgramSetting,
      "Program setting updated successfully",
      200
    );
  } catch (error) {
    console.error("Error updating program setting:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const deleteProgramSetting = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid program setting id", null, 400);
    }

    // Use findByIdAndDelete to combine find + delete in one operation
    const programSetting = await ProgramSetting.findByIdAndDelete(id);
    if (!programSetting) {
      return sendError(res, "Program setting not found", null, 404);
    }

    // If deleted program was active, activate the most recent program
    if (programSetting.isActive) {
      const nextProgram = await ProgramSetting.findOneAndUpdate(
        {},
        { isActive: true },
        {
          new: true,
          sort: { createdAt: -1 },
          runValidators: true,
        }
      );

      if (nextProgram) {
        await logActivity({
          type: "general",
          userId: req.user?._id,
          message: `Auto-activated program setting ${nextProgram.slug} after deletion of active program`,
          metadata: {
            programSettingId: nextProgram._id,
            slug: nextProgram.slug,
            reason: "active_program_deleted",
          },
        });
      }
    }

    await logActivity({
      type: "general",
      userId: req.user?._id,
      message: `Deleted program setting ${programSetting.slug}`,
      metadata: {
        programSettingId: programSetting._id,
        slug: programSetting.slug,
        wasActive: programSetting.isActive,
      },
    });

    return sendSuccess(
      res,
      { id: programSetting._id, slug: programSetting.slug },
      "Program setting deleted successfully",
      200
    );
  } catch (error) {
    console.error("Error deleting program setting:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const setProgramSettingActive = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid program setting id", null, 400);
    }

    const programSetting = await ProgramSetting.findById(id);
    if (!programSetting) {
      return sendError(res, "Program setting not found", null, 404);
    }

    // If already active, return early
    if (programSetting.isActive) {
      return sendSuccess(
        res,
        {
          id: programSetting._id,
          slug: programSetting.slug,
        },
        "Program setting is already active",
        200
      );
    }

    // Find the current Active Program & set it to inactive (excluding target program)
    const setInactiveProgram = await ProgramSetting.findOneAndUpdate(
      { isActive: true, _id: { $ne: id } },
      { isActive: false },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    // Set active for target Program
    const setActiveProgram = await ProgramSetting.findByIdAndUpdate(
      id,
      { isActive: true },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    // Build metadata conditionally
    const logMetadata = {
      programSettingId: setActiveProgram._id,
      slug: setActiveProgram.slug,
    };

    if (setInactiveProgram) {
      logMetadata.prevSettingId = setInactiveProgram._id;
    }

    await logActivity({
      type: "general",
      userId: req.user?._id,
      message: `Activated program setting ${setActiveProgram.slug}`,
      metadata: logMetadata,
    });

    // Build response data conditionally
    const responseData = {
      id: setActiveProgram._id,
      slug: setActiveProgram.slug,
    };

    if (setInactiveProgram) {
      responseData.prevId = setInactiveProgram._id;
      responseData.prevSlug = setInactiveProgram.slug;
    }

    return sendSuccess(
      res,
      responseData,
      setInactiveProgram
        ? "Program setting activated successfully"
        : "Program setting activated with no former active program",
      200
    );
  } catch (error) {
    console.error("Error activating program setting:", error);
    return sendError(res, "Internal server error", null);
  }
};
