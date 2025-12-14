import { getCategoryMetadata } from "../components/AllCourses/utils";
import { formatTimeAgo } from "./formatTimeAgo";
import { CheckCircle } from "lucide-react";

/**
 * Filter students from all users based on their role
 */
export const filterStudents = (allUsers) => {
    return (allUsers || []).filter(user => {
        const role = user.user_role?.toLowerCase() || "";
        return role.includes("student") ||
            (role !== "instructor" && role !== "admin" && role !== "");
    });
};

/**
 * Calculate course statistics for each category
 */
export const calculateCourseStats = (categories, tutorials, progress) => {
    return (categories || []).map(category => {
        const categoryTutorials = (tutorials || []).filter(
            t => t.category_id === category.category_id
        );
        const categoryTutorialIds = new Set(categoryTutorials.map(t => t.tutorial_id));

        // Get students who have started any tutorial in this category
        const studentsInCategory = new Set(
            (progress || [])
                .filter(p => categoryTutorialIds.has(p.tutorial_id))
                .map(p => p.user_id)
        );

        // Calculate average progress for this category
        let totalProgress = 0;
        let studentCount = 0;

        studentsInCategory.forEach(studentId => {
            const studentTutorials = categoryTutorials.length;
            const studentCompleted = (progress || []).filter(
                p => p.user_id === studentId &&
                    categoryTutorialIds.has(p.tutorial_id) &&
                    p.completed_at !== null
            ).length;
            const studentProgress = studentTutorials > 0
                ? Math.round((studentCompleted / studentTutorials) * 100)
                : 0;
            totalProgress += studentProgress;
            studentCount++;
        });

        const avgProgress = studentCount > 0
            ? Math.round(totalProgress / studentCount)
            : 0;

        const metadata = getCategoryMetadata(category.category_id);
        return {
            id: category.category_id,
            title: category.category_name,
            icon: metadata.icon,
            description: category.description || `Learn about ${category.category_name}`,
            students: studentsInCategory.size,
            progress: avgProgress,
            color: metadata.color
        };
    });
};

/**
 * Build student progress map from progress data
 */
export const buildStudentProgressMap = (progressData) => {
    const studentProgressMap = {};
    (progressData || []).forEach(progress => {
        if (!studentProgressMap[progress.user_id]) {
            studentProgressMap[progress.user_id] = {
                tutorials: new Set(),
                completed: 0,
                lastActivity: null
            };
        }
        studentProgressMap[progress.user_id].tutorials.add(progress.tutorial_id);
        if (progress.completed_at) {
            studentProgressMap[progress.user_id].completed++;
        }

        // Track most recent activity
        const activityDate = progress.completed_at || progress.started_at;
        if (activityDate) {
            const currentLastActivity = studentProgressMap[progress.user_id].lastActivity;
            if (!currentLastActivity || new Date(activityDate) > new Date(currentLastActivity)) {
                studentProgressMap[progress.user_id].lastActivity = activityDate;
            }
        }
    });
    return studentProgressMap;
};

/**
 * Format students with their progress data
 */
export const formatStudentsWithProgress = (students, progressMap, tutorials, categories) => {
    return (students || [])
        .map(student => {
            const progress = progressMap[student.user_id];
            if (!progress) return null;

            const totalTutorials = (tutorials || []).length;
            const studentProgress = totalTutorials > 0
                ? Math.round((progress.completed / totalTutorials) * 100)
                : 0;

            // Get most recent category they worked on
            const studentTutorials = Array.from(progress.tutorials);
            const mostRecentTutorial = studentTutorials.length > 0
                ? (tutorials || []).find(t => t.tutorial_id === studentTutorials[0])
                : null;
            const mostRecentCategory = mostRecentTutorial
                ? (categories || []).find(c => c.category_id === mostRecentTutorial.category_id)
                : null;

            return {
                id: student.user_id,
                name: `${student.first_name} ${student.last_name}`,
                course: mostRecentCategory?.category_name || "Getting Started",
                progress: studentProgress,
                status: progress.completed > 0 ? "active" : "new",
                lastActivity: progress.lastActivity
            };
        })
        .filter(s => s !== null)
        .sort((a, b) => {
            const dateA = new Date(a.lastActivity || 0);
            const dateB = new Date(b.lastActivity || 0);
            return dateB - dateA;
        })
        .slice(0, 10); // Get top 10 most recent
};

/**
 * Format recent activities from progress data
 */
export const formatRecentActivities = (progressData, tutorials, students, categories) => {
    return (progressData || [])
        .filter(p => p.completed_at !== null)
        .map(progress => {
            const tutorial = (tutorials || []).find(t => t.tutorial_id === progress.tutorial_id);
            const student = (students || []).find(s => s.user_id === progress.user_id);
            const category = tutorial
                ? (categories || []).find(c => c.category_id === tutorial.category_id)
                : null;

            return {
                id: `${progress.user_id}-${progress.tutorial_id}-${progress.completed_at}`,
                title: student && tutorial
                    ? `Completed: ${tutorial.title}`
                    : "Lesson completed",
                time: formatTimeAgo(progress.completed_at),
                icon: CheckCircle,
                color: "text-emerald-600 bg-emerald-50",
                timestamp: progress.completed_at
            };
        })
        .sort((a, b) => {
            const dateA = new Date(a.timestamp || 0);
            const dateB = new Date(b.timestamp || 0);
            return dateB - dateA;
        })
        .slice(0, 5); // Get 5 most recent
};
