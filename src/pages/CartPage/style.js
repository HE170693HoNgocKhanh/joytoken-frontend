import styled from "styled-components";

/* Container */
export const CartContainer = styled.div`
  max-width: 1100px;
  margin: 28px auto;
  padding: 0 16px 60px;
  font-family: Arial, sans-serif;
`;

/* Header */
export const CartHeader = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

/* Controls */
export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const LeftControls = styled.div`
  display: flex;
  gap: 12px;
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
  }
`;

export const RightControls = styled.div`
  color: #333;
`;

/* Bulk apply */
export const BulkApplyBox = styled.div`
  background: #fffaf6;
  border: 1px solid #ffe6cc;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
`;

/* Table area */
export const CartTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* Row / Item */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 160px 140px 160px;
  gap: 12px;
  align-items: start;
  background: #fff;
  padding: 14px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
`;

export const ProductCol = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const ImageBox = styled.div`
  width: 92px;
  height: 92px;
  background: #fff;
  border-radius: 6px;
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
    color: #222;
    margin-bottom: 6px;
  }
  .variantRow {
    margin-top: 6px;
  }
`;

export const PriceCol = styled.div`
  text-align: center;
  color: #333;
  font-weight: 600;
`;

export const QtyCol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  button {
    width: 32px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
  }
  span {
    min-width: 26px;
    text-align: center;
    display: inline-block;
  }
`;

export const ActionCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  button {
    background: none;
    border: none;
    color: #e64545;
    cursor: pointer;
  }
`;

/* Small controls */
export const SmallSelect = styled.select`
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

/* Inline editor */
export const InlineEditBox = styled.div`
  margin-top: 8px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    color: #333;
  }

  input[type="text"], input[type="file"], select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  button {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }
`;

export const PreviewImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

/* Footer bar */
export const FooterBar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 8px;
  margin-top: 16px;
  z-index: 40;
`;

export const FooterLeft = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const FooterRight = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  .total {
    font-weight: 700;
  }
`;

export const BuyButton = styled.button`
  background: #ee4d2d;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
`;

/* Small helpers */
export const SmallInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

export const ApplyButton = styled.button`
  background: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e64545;
  cursor: pointer;
`;

/* Empty */
export const EmptyBox = styled.div`
  max-width: 800px;
  margin: 80px auto;
  text-align: center;
  padding: 30px;
  border: 1px dashed #eee;
  border-radius: 8px;
  button {
    margin-top: 10px;
    padding: 8px 12px;
    background: #ee4d2d;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;
