import React, { useState } from "react";

const VariantSelector = ({ product, selectedVariant, setSelectedVariant }) => {
  const handleSelect = (variant) => {
    if (variant.stock === 0) return; // Không cho chọn nếu hết hàng
    setSelectedVariant(variant.name);
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
        {(product.variants || []).map((variant, index) => {
          const isActive = selectedVariant === variant.name;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={index}
              onClick={() => handleSelect(variant)}
              disabled={isOutOfStock}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: isActive ? "2px solid #007bff" : "1px solid #ccc",
                backgroundColor: isOutOfStock
                  ? "#f2f2f2"
                  : isActive
                  ? "#e6f0ff"
                  : "white",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                opacity: isOutOfStock ? 0.6 : 1,
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 6px rgba(0,123,255,0.4)" : "none",
              }}
            >
              {variant.image && (
                <img
                  src={variant.image}
                  alt={variant.name}
                  style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    filter: isOutOfStock ? "grayscale(100%)" : "none",
                  }}
                />
              )}
              <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                {variant.name}
                {isOutOfStock && (
                  <span style={{ fontSize: "0.85rem", color: "gray" }}>
                    {" "}
                    (Hết hàng)
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
