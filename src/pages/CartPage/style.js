import styled from "styled-components";

/* ----- CART PAGE ----- */
export const CartContainer = styled.div`
  padding: 2rem 4rem;
  max-width: 1200px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 600;
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
  }
`;

export const LeftControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const RightControls = styled.div`
  color: #555;
`;

export const BulkApplyBox = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  .bulk-inputs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const SmallInput = styled.input`
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const ApplyButton = styled.button`
  background: #28a745;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #218838;
  }
`;

export const DeleteButton = styled.button`
  color: white;
  background: #e74c3c;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

export const CartTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid #ccc;
  margin-top: 1rem;
  align-items: center;
`;

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const FooterRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const BuyButton = styled.button`
  background: #ff5722;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const EmptyBox = styled.div`
  text-align: center;
  padding: 100px 20px;
  h3 {
    font-size: 22px;
  }
  p {
    color: #777;
  }
  button {
    background: #007bff;
    color: #fff;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;

/* ----- CART ITEM ----- */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  align-items: center;
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const ProductCol = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ImageBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const InfoBox = styled.div`
  .title {
    font-weight: 600;
    margin-bottom: 6px;
  }
`;

export const PriceCol = styled.div`
  font-weight: 500;
  color: #222;
  text-align: center;
`;

export const QtyCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  button {
    padding: 2px 8px;
    border: 1px solid #ccc;
    background: #f8f9fa;
    cursor: pointer;
  }
`;

export const ActionCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SmallSelect = styled.select`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
`;

export const InlineEditBox = styled.div`
  background: #f8f9fa;
  padding: 10px;
  margin-top: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  input, select {
    padding: 4px 8px;
  }
`;

export const PreviewImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
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
  gap: 8px;
  margin-bottom: 6px;
  button {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    &:last-child {
      background: #e74c3c;
    }
  }
`;

export const EditButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  button {
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
  }
  button:first-child {
    background: #28a745;
    color: #fff;
  }
  button:last-child {
    background: #ccc;
  }
`;
