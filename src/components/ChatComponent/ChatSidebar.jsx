import React from "react";
import styled from "styled-components";

const ChatSidebar = ({
  conversations = [],
  loading,
  selectedId,
  onSelectConversation,
}) => {
  if (loading) {
    return (
      <Sidebar>
        <Header>Đoạn chat</Header>
        <Loading>Đang tải...</Loading>
      </Sidebar>
    );
  }
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Sidebar>
      <Header>Đoạn chat</Header>
      <SearchBox placeholder="Tìm kiếm trên Messenger" />

      <ConversationList>
        {conversations.length === 0 ? (
          <EmptyText>Chưa có cuộc trò chuyện nào</EmptyText>
        ) : (
          conversations.map((c) => (
            <ConversationItem
              key={c._id}
              $active={selectedId === c._id}
              onClick={() => onSelectConversation(c)}
            >
              <Avatar
                style={{
                  backgroundImage: `url(https://api.dicebear.com/9.x/initials/svg?seed=${
                    c.otherUser?.name || "User"
                  })`,
                  backgroundSize: "cover",
                }}
              />
              <div className="info">
                <div className="name">
                  {c.otherUser?.name || "Người dùng ẩn danh"}
                </div>
                <div className="last">
                  {truncateText(c?.lastMessage?.content) ||
                    "Hãy bắt đầu cuộc trò chuyện"}
                </div>
              </div>
              <div className="time">
                {new Date(c.updatedAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </ConversationItem>
          ))
        )}
      </ConversationList>
    </Sidebar>
  );
};

export default ChatSidebar;

// 🎨 Styled Components
const Sidebar = styled.div`
  width: 340px;
  border-right: 1px solid #ddd;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 15px;
  font-size: 18px;
  font-weight: 600;
`;

const SearchBox = styled.input`
  margin: 0 12px 10px;
  padding: 8px 12px;
  border-radius: 20px;
  border: none;
  background: #f0f2f5;
  outline: none;
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: ${({ $active }) => ($active ? "#f0f2f5" : "transparent")};
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  margin: 4px 8px;

  &:hover {
    background: #f0f2f5;
  }

  .info {
    flex: 1;
    .name {
      font-weight: 600;
      font-size: 14px;
    }
    .last {
      color: #666;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .time {
    font-size: 12px;
    color: #999;
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ccc;
  flex-shrink: 0;
`;

const Loading = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #666;
`;

const EmptyText = styled.div`
  text-align: center;
  color: #777;
  margin-top: 40px;
  font-size: 14px;
`;
