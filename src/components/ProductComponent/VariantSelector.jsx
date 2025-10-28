import React from "react";

const VariantSelector = ({
  product,
  selectedVariant,
  setSelectedVariant,
  setMainImage,
}) => {
  const handleSelect = (variant) => {
    if (variant.stock === 0) return; // Không cho chọn nếu hết hàng
    setSelectedVariant(variant);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <label style={{ fontWeight: "600" }}>
        Chọn phân loại{" "}
        <span
          style={{
            fontSize: "0.9rem",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          (Hướng dẫn chọn size)
        </span>
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "10px",
        }}
      >
        {product?.variants.map((variant, index) => (
          <div
            key={index}
            onClick={() => handleSelect(variant)}
            onMouseEnter={() => setMainImage(variant.image)} // 👈 Hover đổi ảnh chính
            onMouseLeave={() => setMainImage(selectedVariant?.image)} // 👈 Rời chuột thì về ảnh hiện tại
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border:
                selectedVariant?._id === variant._id
                  ? "2px solid #007bff"
                  : "1px solid #ccc",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: variant.stock === 0 ? "not-allowed" : "pointer",
              opacity: variant.stock === 0 ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <img
              src={variant.image}
              alt={variant.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* 👇 Hiển thị tên variant */}
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              {variant.name}
              {variant.stock === 0 && (
                <span style={{ color: "red", marginLeft: "4px" }}>
                  (Hết hàng)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
