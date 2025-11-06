import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { message } from 'antd';
import styled from 'styled-components';
import { useWishlist } from '../../hooks/useWishlist';

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ffd6cc;
  background: #fff5f0;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #ffeae5;
  }
`;

const IconOnly = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ffd6cc;
  background: #fff5f0;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #ffeae5;
  }
`;

export const HeartButton = ({ productId, withLabel = true }) => {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  const handleClick = async (e) => {
    e.stopPropagation();
    if (!productId) {
      console.error('HeartButton: productId is missing');
      message.error('Không thể thêm vào yêu thích: thiếu ID sản phẩm');
      return;
    }
    try {
      await toggle(productId);
      message.success(active ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích');
    } catch (error) {
      console.error('HeartButton toggle error:', error);
      message.error('Có lỗi xảy ra khi thêm vào yêu thích');
    }
  };

  if (withLabel) {
    return (
      <IconButton onClick={handleClick} aria-pressed={active} title={active ? 'Bỏ yêu thích' : 'Yêu thích'}>
        <FaHeart color={active ? '#ff2e2e' : '#ff6b6b'} />
        {active ? 'Đã yêu thích' : 'Thêm yêu thích'}
      </IconButton>
    );
  }

  return (
    <IconOnly onClick={handleClick} aria-pressed={active} title={active ? 'Bỏ yêu thích' : 'Yêu thích'}>
      <FaHeart color={active ? '#ff2e2e' : '#ff6b6b'} />
    </IconOnly>
  );
};

export default HeartButton;


