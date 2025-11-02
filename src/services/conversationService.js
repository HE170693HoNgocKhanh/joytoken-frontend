import apiClient from "./apiClient";
export const conversationService = {
  getConversations: async () => {
    return await apiClient.get("/conversations");
  },
  getConversationDetails: async (conversationId) => {
    return await apiClient.get(`/conversations/${conversationId}`);
  },
  uploadImage: async (data) => {
    return await apiClient.post("/conversations/upload/image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
