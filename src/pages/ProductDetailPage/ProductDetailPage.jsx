import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  Container, BackButton, ProductLayout, ImageWrapper, ProductImage,
  InfoWrapper, ProductTitle, Price, Description, StockStatus,
  ActionWrapper, StyleSelector, AddToCartButton, WishlistButton,
  Message, RelatedSection, RelatedCard, ArrowButton,
  CustomBox, InputRow, Label, Input, Select, ColorInput, UploadInput, PreviewBox,
  RelatedSlider
} from "./style";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [custom, setCustom] = useState({
    name: "",
    color: "#c8a165",
    font: "Arial",
    image: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 4;

  // ----- Xử lý chuyển slide sản phẩm liên quan -----
  const handleNext = () => {
    if (currentIndex + itemsPerSlide < related.length) setCurrentIndex(currentIndex + itemsPerSlide);
    else setCurrentIndex(0);
  };
  const handlePrev = () => {
    if (currentIndex === 0) setCurrentIndex(Math.max(related.length - itemsPerSlide, 0));
    else setCurrentIndex(currentIndex - itemsPerSlide);
  };

  // ----- Upload ảnh custom -----
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCustom({ ...custom, image: URL.createObjectURL(file) });
  };

  // ----- Lấy dữ liệu từ database.json -----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data/database.json");
        const data = await res.json();

        const found = data.products.find((p) => p.id === Number(id));
        setProduct(found || null);
        if (found?.images?.length) setMainImage(found.images[0]);
        else setMainImage(found?.image || "");

        const relatedProducts = data.products.filter(
          (p) => p.category === found?.category && p.id !== found.id
        );
        setRelated(relatedProducts);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ----- Thêm vào giỏ hàng -----
  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant === "Choose Options") {
      setMessage("⚠️ Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      ...product,
      qty: 1,
      variant: selectedVariant,
      custom, // gồm name, color, font, image
      selected: false, // để dùng cho checkbox chọn/xóa
    };

    // Nếu cùng sản phẩm + cùng variant thì gộp số lượng
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.variant === selectedVariant
    );
    if (existingIndex !== -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage("🛍️ Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => setMessage(null), 2000);

    navigate("/cart");
  };

  // ----- Thêm vào wishlist -----
  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.find((item) => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setMessage("❤️ Đã thêm vào danh sách yêu thích!");
    } else {
      setMessage("❗Sản phẩm đã có trong Wishlist!");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Đang tải...</div>;
  if (!product) return <div style={{ padding: "2rem" }}>Không tìm thấy sản phẩm</div>;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Quay lại</BackButton>

      <ProductLayout>
        {/* Ảnh chính */}
        <ImageWrapper>
          <ProductImage src={mainImage} alt={product.name} />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Ảnh ${index + 1}`}
                onClick={() => setMainImage(img)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: mainImage === img ? "2px solid #007bff" : "1px solid #ccc",
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        </ImageWrapper>

        {/* Thông tin sản phẩm */}
        <InfoWrapper>
          <ProductTitle>{product.name}</ProductTitle>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {[...Array(product.rating)].map((_, i) => (
              <FaStar key={i} color="#f5a623" />
            ))}
            <span style={{ color: "#666" }}>(267 Reviews)</span>
          </div>

          <Price>₫{product.price.toLocaleString()}</Price>
          <Description>{product.description}</Description>
          <StockStatus inStock={product.countInStock > 0}>
            {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </StockStatus>

          {/* 🎯 Chọn variant (size/style) */}
          <StyleSelector>
            <label style={{ fontWeight: "600" }}>
              Chọn phân loại{" "}
              <span style={{ fontSize: "0.9rem", color: "#007bff", cursor: "pointer" }}>
                (Hướng dẫn chọn size)
              </span>
            </label>

            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              style={{
                marginTop: "8px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            >
              <option>Choose Options</option>
              {(product.variants || ["Size S", "Size M", "Size L"]).map((variant, index) => (
                <option key={index} value={variant.name || variant}>
                  {variant.name || variant}
                </option>
              ))}
            </select>
          </StyleSelector>

          {/* 🧵 Custom Design */}
          <CustomBox>
            <h4>🪡 Thiết kế của bạn</h4>

            <InputRow>
              <Label>Tên thêu:</Label>
              <Input
                type="text"
                placeholder="Nhập tên..."
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              />
            </InputRow>

            <InputRow>
              <Label>Màu chữ:</Label>
              <ColorInput
                type="color"
                value={custom.color}
                onChange={(e) => setCustom({ ...custom, color: e.target.value })}
              />
            </InputRow>

            <InputRow>
              <Label>Kiểu chữ:</Label>
              <Select
                value={custom.font}
                onChange={(e) => setCustom({ ...custom, font: e.target.value })}
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Dancing Script">Dancing Script</option>
                <option value="Comic Sans MS">Comic Sans</option>
              </Select>
            </InputRow>

            <InputRow>
              <Label>Upload ảnh:</Label>
              <UploadInput type="file" accept="image/*" onChange={handleImageUpload} />
            </InputRow>

            <PreviewBox>
              {custom.image ? (
                <img src={custom.image} alt="preview" style={{ width: "100%", borderRadius: "10px" }} />
              ) : (
                <p style={{ color: custom.color, fontFamily: custom.font }}>
                  {custom.name || "Preview chữ ở đây..."}
                </p>
              )}
            </PreviewBox>
          </CustomBox>

          <ActionWrapper>
            <AddToCartButton onClick={handleAddToCart}>🛒 Add to Bag</AddToCartButton>
            <WishlistButton onClick={handleAddToWishlist}>
              <FaHeart /> Add to Wishlist
            </WishlistButton>
          </ActionWrapper>

          {message && <Message>{message}</Message>}
        </InfoWrapper>
      </ProductLayout>

      {/* 🧸 Related Products */}
      <RelatedSection>
        <h3>Sản phẩm liên quan</h3>
        <div style={{ position: "relative" }}>
          <ArrowButton className="left" onClick={handlePrev}>
            <FaChevronLeft />
          </ArrowButton>

          <RelatedSlider>
            {related.slice(currentIndex, currentIndex + itemsPerSlide).map((r) => (
              <RelatedCard key={r.id} onClick={() => navigate(`/product/${r.id}`)}>
                <img src={r.image} alt={r.name} />
                <div className="name">{r.name}</div>
                <div className="price">₫{r.price.toLocaleString()}</div>
              </RelatedCard>
            ))}
          </RelatedSlider>

          <ArrowButton className="right" onClick={handleNext}>
            <FaChevronRight />
          </ArrowButton>
        </div>
      </RelatedSection>
    </Container>
  );
};

export default ProductDetailPage;
