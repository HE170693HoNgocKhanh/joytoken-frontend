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
  RelatedSlider,
} from "./style";
import axios from "axios";
import VariantSelector from "../../components/ProductComponent/VariantSelector";
import ReviewSection from "../../components/ProductComponent/ReviewSection";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [reviews, setReviews] = useState([]);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
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

  // ----- Lấy dữ liệu từ database.json -----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productDetail = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        const relatedProducts = await axios.get(
          `http://localhost:8080/api/products?category=${productDetail.data.data.category._id}`
        );
        const listReview = await axios.get(
          `http://localhost:8080/api/reviews/product/${id}`
        );
        setReviews(listReview.data.data);
        setRelated(relatedProducts.data.data);
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

    // 2️⃣ Lấy giỏ hàng hiện tại từ localStorage
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch (error) {
      console.error("Cart parse error:", error);
      cart = [];
    }

    // 3️⃣ Lấy dữ liệu variant được chọn
    const variantData =
      typeof selectedVariant === "object"
        ? selectedVariant
        : product.variants?.find((v) => v.name === selectedVariant);

    if (!variantData) {
      setMessage("⚠️ Không tìm thấy phân loại hợp lệ!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Kiểm tra tồn kho
    if (variantData.stock === 0) {
      setMessage("❌ Phân loại này đã hết hàng!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // 4️⃣ Tạo sản phẩm mới
    const newItem = {
      id: id, // id sản phẩm gốc
      name: product.name,
      image: variantData?.image || product.image || "",
      price: product.price,
      variants: product.variants,
      selectedVariant: variantData,
      quantity: 1,
      selected: false,
    };

    // 5️⃣ Kiểm tra sản phẩm trùng (id + variant._id)
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.selectedVariant?._id === newItem.selectedVariant._id
    );

    if (existingIndex !== -1) {
      // Nếu đã tồn tại → tăng số lượng
      const existingItem = cart[existingIndex];

      if (existingItem.stock && existingItem.quantity >= existingItem.stock) {
        setMessage("⚠️ Đã đạt giới hạn số lượng tồn kho!");
        setTimeout(() => setMessage(null), 2000);
        return;
      }

      // ✅ Tăng quantity
      cart[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
    } else {
      // ✅ Thêm mới vào giỏ
      cart.push(newItem);
    }

    // 6️⃣ Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // 7️⃣ Thông báo
    setMessage("🛍️ Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => setMessage(null), 2000);
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
          <ProductImage src={mainImage || product.image} alt={product.name} />
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
                onClick={() => {
                  setMainImage(img);
                  setActiveIndex(index); // ✅ thêm state để lưu index đang active
                }}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    activeIndex === index
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
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
              setMainImage={setMainImage}
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

      <ReviewSection productId={id} initialReviews={reviews} />

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
