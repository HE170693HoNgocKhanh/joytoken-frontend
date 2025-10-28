import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  Container,
  BackButton,
  ProductLayout,
  ImageWrapper,
  ProductImage,
  InfoWrapper,
  ProductTitle,
  Price,
  Description,
  StockStatus,
  ActionWrapper,
  StyleSelector,
  AddToCartButton,
  WishlistButton,
  Message,
  RelatedSection,
  RelatedCard,
  ArrowButton,
  CustomBox,
  InputRow,
  Label,
  Input,
  Select,
  ColorInput,
  UploadInput,
  PreviewBox,
  RelatedSlider,
} from "./style";
import axios from "axios";
import VariantSelector from "../../components/ProductComponent/VariantSelector";

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
    if (currentIndex + itemsPerSlide < related.length)
      setCurrentIndex(currentIndex + itemsPerSlide);
    else setCurrentIndex(0);
  };
  const handlePrev = () => {
    if (currentIndex === 0)
      setCurrentIndex(Math.max(related.length - itemsPerSlide, 0));
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
        const productDetail = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        setProduct(productDetail.data.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const images = product?.variants.map((item) => item.image);

  // ----- Thêm vào giỏ hàng -----
  const handleAddToCart = () => {
    // 1️⃣ Kiểm tra variant
    if (!selectedVariant || selectedVariant === "Choose Options") {
      setMessage("⚠️ Vui lòng chọn phân loại trước khi thêm vào giỏ hàng!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // 2️⃣ Lấy giỏ hàng hiện tại
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch (error) {
      console.error("Cart parse error:", error);
      cart = [];
    }

    // 3️⃣ Kiểm tra tồn kho của variant (nếu có)
    const variantData = product.variants?.find(
      (v) => v.name === selectedVariant
    );
    if (variantData && variantData.stock === 0) {
      setMessage("❌ Phân loại này đã hết hàng!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // 4️⃣ Tạo sản phẩm mới
    const newItem = {
      id: product.id, // ✅ luôn có id duy nhất
      name: product.name,
      image: product.image || variantData?.image || "",
      price: product.price,
      variants: product.variants,
      selectedVariant: selectedVariant,
      quantity: 1,
      stock: variantData?.stock ?? product.stock ?? null,
      selected: false, // checkbox chọn/xóa
    };

    // 5️⃣ Kiểm tra sản phẩm trùng
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.selectedVariant === newItem.selectedVariant
    );

    if (existingIndex !== -1) {
      // Gộp số lượng nhưng không vượt quá stock
      const existingItem = cart[existingIndex];
      if (existingItem.stock && existingItem.quantity >= existingItem.stock) {
        setMessage("⚠️ Đã đạt giới hạn số lượng tồn kho!");
        setTimeout(() => setMessage(null), 2000);
        return;
      }
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(newItem);
    }

    // 6️⃣ Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // 7️⃣ Thông báo và điều hướng
    setMessage("🛍️ Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => setMessage(null), 2000);
    navigate("/cart");
  };

  // ----- Thêm vào wishlist -----
  const handleAddToWishlist = () => {
    const { id } = useParams();
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
  if (!product)
    return <div style={{ padding: "2rem" }}>Không tìm thấy sản phẩm</div>;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Quay lại</BackButton>

      <ProductLayout>
        {/* Ảnh chính */}
        <ImageWrapper>
          <ProductImage src={product.image} alt={product.name} />
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            {images?.map((img, index) => (
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
                  border:
                    mainImage === img ? "2px solid #007bff" : "1px solid #ccc",
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
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
            <VariantSelector
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          </StyleSelector>

          <ActionWrapper>
            <AddToCartButton onClick={handleAddToCart}>
              🛒 Add to Bag
            </AddToCartButton>
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
            {related
              .slice(currentIndex, currentIndex + itemsPerSlide)
              .map((r) => (
                <RelatedCard
                  key={r.id}
                  onClick={() => navigate(`/product/${r.id}`)}
                >
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
