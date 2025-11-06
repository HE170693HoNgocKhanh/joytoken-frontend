import styled from "styled-components";

/* ----- CART PAGE ----- */
export const CartContainer = styled.div`
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: auto;
  background: #fafafa;
  min-height: calc(100vh - 200px);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-weight: 600;
  font-size: 16px;
  color: #333;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
    accent-color: #ff6b6b;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f0f7ff;
      color: #0056b3;
    }
  }
`;

export const LeftControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const RightControls = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

export const BulkApplyBox = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
  .bulk-inputs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const SmallInput = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const ApplyButton = styled.button`
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  }
`;

export const DeleteButton = styled.button`
  color: white;
  background: #e74c3c;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  background: #f5f5f5;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderCol = styled.div`
  text-align: center;
  
  &:first-child {
    text-align: left;
  }
`;

export const CartTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const VoucherSection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const VoucherItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  
  span {
    flex: 1;
    
    &:last-child {
      flex: 0;
      font-size: 16px;
    }
  }
`;

export const VoucherLink = styled.a`
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: #0056b3;
  }
`;

export const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 24px;
  position: sticky;
  bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
    accent-color: #ff6b6b;
  }
`;

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
  
  span {
    font-weight: 500;
  }
`;

export const FooterRight = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
  
  > div {
    font-size: 16px;
    color: #333;
    
    strong {
      color: #ff6b6b;
      font-size: 20px;
      font-weight: 700;
    }
  }
`;

export const BuyButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5722 100%);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }
`;

export const EmptyBox = styled.div`
  text-align: center;
  padding: 120px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  
  h3 {
    font-size: 28px;
    color: #333;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  p {
    color: #777;
    font-size: 16px;
    margin-bottom: 24px;
  }
  
  button {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: #fff;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
    }
  }
`;

/* ----- CART ITEM ----- */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  align-items: start;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  margin-bottom: 8px;
  
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
`;

export const ProductCol = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #ff6b6b;
    flex-shrink: 0;
  }
`;

export const ImageBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const InfoBox = styled.div`
  flex: 1;
  min-width: 0;
  
  .title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .variantRow {
    margin-top: 8px;
  }
`;

export const PriceCol = styled.div`
  text-align: center;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    text-align: left;
    padding-left: 8px;
    align-items: flex-start;
  }
`;

export const QtyCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  button {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: #f0f0f0;
      border-color: #ff6b6b;
      color: #ff6b6b;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    min-width: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }
  
  @media (max-width: 768px) {
    align-items: flex-start;
    padding-left: 8px;
  }
`;

export const ActionCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 8px;
  }
`;

export const SmallSelect = styled.select`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:hover {
    border-color: #007bff;
  }
  
  option:disabled {
    color: #999;
    background: #f5f5f5;
  }
`;

export const InlineEditBox = styled.div`
  background: #f8f9fa;
  padding: 12px;
  margin-top: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e9ecef;
  
  input,
  select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
`;

export const PreviewImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const CustomInfoBox = styled.div`
  margin-top: 4px;
`;

export const CustomWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CustomText = styled.span`
  color: ${(p) => p.color || "#000"};
  font-weight: bold;
`;

export const CustomFont = styled.small`
  color: #777;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  
  button {
    background: #e74c3c;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    width: 100%;
    
    &:hover {
      background: #c0392b;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &.ant-btn-link {
      background: transparent;
      color: #333;
      padding: 0;
      width: auto;
      font-size: 12px;
      text-align: center;
      
      &:hover {
        background: transparent;
        color: #007bff;
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

export const EditButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  
  button {
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  button:first-child {
    background: #28a745;
    color: #fff;
    
    &:hover {
      background: #218838;
      transform: translateY(-1px);
    }
  }
  
  button:last-child {
    background: #ccc;
    color: #333;
    
    &:hover {
      background: #bbb;
    }
  }
`;
