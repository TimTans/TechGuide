import { supabase } from "../context/AuthContext";

/**
 * Start or update a course for a user
 * @param {string} userId - The user's ID
 * @param {number} tutorialId - The tutorial ID
 * @returns {Promise<{success: boolean, error?: any, data?: any}>}
 */
export const startOrUpdateCourse = async (userId, tutorialId) => {
    try {
        // Check if progress already exists
        const { data: existingProgress, error: checkError } = await supabase
            .from("user_progress")
            .select("progress_id, started_at, completed_at")
            .eq("user_id", userId)
            .eq("tutorial_id", tutorialId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is "not found" error, which is expected if no progress exists
            console.error("Error checking progress:", checkError);
        }

        if (existingProgress) {
            // Update existing progress - only update started_at if it's null
            const updateData = {};
            if (!existingProgress.started_at) {
                updateData.started_at = new Date().toISOString();
            }
            if (Object.keys(updateData).length > 0) {
                const { data, error } = await supabase
                    .from("user_progress")
                    .update(updateData)
                    .eq("progress_id", existingProgress.progress_id)
                    .select()
                    .single();

                if (error) {
                    console.error("Error updating progress:", error);
                    return { success: false, error };
                }
                return { success: true, data };
            }
            return { success: true, data: existingProgress };
        } else {
            // Create new progress entry
            const { data, error } = await supabase
                .from("user_progress")
                .insert({
                    user_id: userId,
                    tutorial_id: tutorialId,
                    status: "in_progress",
                    started_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating progress:", error);
                return { success: false, error };
            }
            return { success: true, data };
        }
    } catch (error) {
        console.error("Unexpected error in startOrUpdateCourse:", error);
        return { success: false, error };
    }
};

/**
 * Update video progress for a user
 * @param {string} userId - The user's ID
 * @param {number} tutorialId - The tutorial ID
 * @param {number} progressPercent - Progress percentage (0-100)
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const updateVideoProgress = async (userId, tutorialId, progressPercent) => {
    try {
        // Check if progress exists
        const { data: existingProgress, error: checkError } = await supabase
            .from("user_progress")
            .select("progress_id")
            .eq("user_id", userId)
            .eq("tutorial_id", tutorialId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error checking progress:", checkError);
            return { success: false, error: checkError };
        }

        const updateData = {
            status: progressPercent >= 100 ? "completed" : "in_progress"
        };

        // If progress is 100%, mark as completed
        if (progressPercent >= 100 && (!existingProgress || !existingProgress.completed_at)) {
            updateData.completed_at = new Date().toISOString();
        }

        // If no existing progress, create it
        if (!existingProgress) {
            updateData.user_id = userId;
            updateData.tutorial_id = tutorialId;
            updateData.started_at = new Date().toISOString();

            const { error } = await supabase
                .from("user_progress")
                .insert(updateData);

            if (error) {
                console.error("Error creating progress:", error);
                return { success: false, error };
            }
        } else {
            // Update existing progress
            const { error } = await supabase
                .from("user_progress")
                .update(updateData)
                .eq("progress_id", existingProgress.progress_id);

            if (error) {
                console.error("Error updating progress:", error);
                return { success: false, error };
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error in updateVideoProgress:", error);
        return { success: false, error };
    }
};

