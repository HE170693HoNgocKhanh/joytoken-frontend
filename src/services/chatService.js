import apiClient from "./apiClient";
export const chatService = {
  sendMessageWithAi: async (content) => {
    return await apiClient.post("/chatbot/ask", { query: content });
  },
};
