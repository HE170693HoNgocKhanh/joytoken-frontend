import apiClient from "./apiClient";
export const conversationService = {
  getConversations: async () => {
    return await apiClient.get("/conversations");
  },
  getConversationDetails: async (conversationId) => {
    return await apiClient.get(`/conversations/${conversationId}`);
  },
  createConversation: async (receiverId) => {
    // Nếu receiverId được truyền vào thì gửi, nếu không thì gửi body rỗng (backend sẽ tự động tìm seller cho customer)
    return await apiClient.post("/conversations", receiverId ? { receiverId } : {});
  },
  uploadImage: async (data) => {
    return await apiClient.post("/conversations/upload/image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
