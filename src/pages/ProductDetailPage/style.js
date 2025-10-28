// style.js
import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem 4rem;
  max-width: 1200px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BackButton = styled.button`
  border: none;
  background: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export const ProductLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ImageWrapper = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const ProductImage = styled.img`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const InfoWrapper = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const Price = styled.div`
  font-size: 1.6rem;
  color: #d9534f;
  margin: 1rem 0;
  font-weight: 600;
`;

export const Description = styled.p`
  color: #555;
  line-height: 1.6;
`;

export const StockStatus = styled.div`
  margin-top: 10px;
  font-weight: 500;
  color: ${(props) => (props.inStock ? "green" : "red")};
`;

export const StyleSelector = styled.div`
  margin-top: 1rem;

  label {
    font-weight: 500;
    margin-right: 8px;
  }

  select {
    padding: 6px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: border 0.2s;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

/* 🎨 Custom design section */
export const CustomSection = styled.div`
  margin-top: 1.5rem;
  background: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  label {
    font-weight: 500;
    display: block;
    margin-top: 10px;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-top: 4px;
    transition: border 0.2s;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }

  input[type="color"],
  select,
  input[type="file"] {
    margin-top: 5px;
    cursor: pointer;
  }

  .preview {
    margin-top: 10px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #ccc;
    }
  }
`;

export const ActionWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const AddToCartButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const WishlistButton = styled.button`
  background: #fff;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f0f8ff;
  }

  svg {
    font-size: 1rem;
  }
`;

export const Message = styled.div`
  margin-top: 1rem;
  color: #28a745;
  font-weight: 500;
  animation: fade 0.5s ease-in-out;

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* 🧸 Related products */
export const RelatedSection = styled.div`
  margin-top: 4rem;
  position: relative;
  text-align: center; /* 🔹 căn giữa tiêu đề và toàn bộ phần */
  width: 100%;

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  /* 🔹 thêm padding để 2 nút không bị che ảnh */
  padding: 0 60px;
`;

export const RelatedSlider = styled.div`
  display: flex;
  justify-content: center; /* 🔹 căn giữa các thẻ */
  align-items: center;
  gap: 1rem;
  overflow: hidden; /* 🔹 ẩn bớt phần tràn */
  scroll-behavior: smooth;
  padding-bottom: 10px;
  flex-wrap: nowrap;

  /* scrollbar tắt để gọn */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RelatedCard = styled.div`
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 230px;
    object-fit: cover;
    border-radius: 10px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }

  .name {
    margin-top: 8px;
    font-weight: 500;
    color: #333;
  }

  .price {
    color: #d9534f;
    font-weight: 600;
  }
`;

export const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  width: 45px;
  height: 45px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #007bff;
    color: white;
    transform: translateY(-50%) scale(1.05);
  }

  &.left {
    left: 10px; /* 🔹 chỉnh nút gần sát nội dung */
  }

  &.right {
    right: 10px;
  }

  svg {
    font-size: 1.2rem;
  }
`;

// 🔽 Thêm vào cuối file style.js

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  width: 120px;
  color: #333;

  @media (min-width: 600px) {
    margin-bottom: 0;
  }
`;

export const ColorInput = styled.input.attrs({ type: "color" })`
  width: 60px;
  height: 35px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background: none;

  &:hover {
    opacity: 0.9;
  }
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const UploadInput = styled.input.attrs({ type: "file" })`
  padding: 8px;
  border-radius: 6px;
  border: 1px dashed #aaa;
  cursor: pointer;
  width: 100%;
  max-width: 300px;

  &:hover {
    background: #f9f9f9;
  }
`;

export const PreviewBox = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #ddd;
  }
`;

// ✅ Nếu bạn đã có RelatedGrid thì bỏ qua, nếu chưa có thì thêm lại:
export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;
// ✅ CustomBox: khung bao quanh từng phần custom (ví dụ như thêu tên, chọn màu...)
export const CustomBox = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  h5 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #333;
  }
`;

// ✅ Input: ô nhập chữ (ví dụ: nhập tên thêu)
export const Input = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;
