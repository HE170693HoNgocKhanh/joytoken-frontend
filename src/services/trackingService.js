import apiClient from "./apiClient";

export const trackingService = {
  logActivity: async (payload) => {
    try {
      await apiClient.post("/tracking/activity", payload);
    } catch (error) {
      // Không throw lỗi để tránh ảnh hưởng UX
      console.warn("Không thể ghi nhận hoạt động", error?.message || error);
    }
  },

  getActivityTimeline: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.granularity) query.append("granularity", params.granularity);
    if (params.date) query.append("date", params.date);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    if (params.range) query.append("range", params.range);

    const response = await apiClient.get(
      `/tracking/activity/timeline${query.toString() ? `?${query.toString()}` : ""}`
    );
    return response;
  },
};

