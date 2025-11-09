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
import { productService } from "../../services/productService";
import VariantSelector from "../../components/ProductComponent/VariantSelector";
import ReviewSection from "../../components/ProductComponent/ReviewSection";
import HeartButton from "../../components/ProductComponent/HeartButton";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [maxReached, setMaxReached] = useState(false);

  // 🔁 Khi chọn variant mới => reset quantity về 1
  useEffect(() => {
    setQuantity(1);
    setMaxReached(false);
  }, [selectedVariant]);

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

  // ----- Lấy dữ liệu từ API -----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productDetail = await productService.getProductById(id);
        const productData = productDetail.data;

        // Lấy sản phẩm liên quan cùng category
        const relatedProducts = await productService.getAllProducts({
          category: productData.category._id,
        });

        setProduct(productData);
        setRelated(relatedProducts.data);

        // Gộp ảnh chính + ảnh phụ
        const allImages = [
          ...(productData.image ? [productData.image] : []),
          ...(Array.isArray(productData.images) ? productData.images : []),
        ];
        setImages(allImages);
        setMainImage(allImages[0] || "");

        // Variant đầu tiên (nếu có)
        setSelectedVariant(
          Array.isArray(productData.variants) && productData.variants.length > 0
            ? productData.variants[0]
            : null
        );

        // Lấy review
        // const reviewRes = await productService.getReviewsByProduct(id);
        // setReviews(reviewRes.data.data);

        const resReviews = await fetch(
          `http://localhost:8080/api/reviews/product/${id}`
        );
        const dataReviews = await resReviews.json();
        setReviews(dataReviews.data || []);
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
    if (!selectedVariant) {
      setMessage("⚠️ Vui lòng chọn phân loại trước khi thêm vào giỏ hàng!");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      id: product._id,
      name: product.name,
      image: mainImage || product.image,
      price: selectedVariant.price || product.price,
      selectedVariant,
      variants: product.variants || [], // Thêm variants để có thể thay đổi sau
      quantity: quantity, // Sử dụng quantity state đã chọn
      selected: false,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.selectedVariant?._id === newItem.selectedVariant._id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity; // Cộng thêm quantity đã chọn
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // Dispatch event để HeaderComponent cập nhật số lượng
    window.dispatchEvent(new Event("cartUpdated"));
    setMessage("🛍️ Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => setMessage(null), 2000);
  };

  // ----- Thêm vào wishlist -----
  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.find((item) => item._id === product._id);
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
        {/* Ảnh sản phẩm */}
        <ImageWrapper>
          <ProductImage src={mainImage} alt={product.name} />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Ảnh ${index + 1}`}
                onClick={() => {
                  setMainImage(img);
                  setActiveIndex(index);
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
            <span style={{ color: "#666" }}>
              ({product.numReviews || 0} Reviews)
            </span>
          </div>

          <Price>
            Giá bán:{" "}
            {(selectedVariant?.price ?? product.price).toLocaleString("vi-VN")}đ
          </Price>
          <Description>Mô tả: {product.description}</Description>
          <StockStatus inStock={selectedVariant?.countInStock > 0}>
            Trạng thái:{" "}
            {selectedVariant?.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </StockStatus>

          {/* 🎯 Chọn variant (màu, size,...) */}
          <StyleSelector>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "8px",
              }}
            >
              {product.variants.map((variant, index) => (
                <button
                  key={variant._id}
                  onClick={() => {
                    setSelectedVariant(variant);

                    // 👉 Khi chọn variant thứ index → đổi ảnh tương ứng
                    if (product.images && product.images[index]) {
                      console.log(product.images.length, index);
                      setMainImage(product.images[index]);
                      setActiveIndex(index);
                    }
                  }}
                  style={{
                    border:
                      selectedVariant?._id === variant._id
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    background:
                      selectedVariant?._id === variant._id ? "#e6f0ff" : "#fff",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {`${variant.size} - ${variant.color} - ${variant.countInStock}`}
                </button>
              ))}
            </div>
          </StyleSelector>

          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "8px",
                opacity:
                  (selectedVariant?.countInStock ?? product.countInStock) === 0
                    ? 0.6
                    : 1,
                pointerEvents:
                  (selectedVariant?.countInStock ?? product.countInStock) === 0
                    ? "none"
                    : "auto",
              }}
            >
              <span style={{ fontWeight: "500" }}>Số lượng</span>

              {/* Ô chọn số lượng */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    background: "#fff",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    fontSize: "18px",
                  }}
                >
                  –
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) setQuantity(value);
                  }}
                  onBlur={() => {
                    if (quantity < 1) setQuantity(1);
                  }}
                  style={{
                    width: "60px",
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#d35400",
                    fontWeight: "bold",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                />

                <button
                  onClick={() => {
                    const maxStock =
                      selectedVariant?.countInStock ?? product.countInStock;
                    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
                  }}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  +
                </button>
              </div>

              <span style={{ color: "#666" }}>
                {(selectedVariant?.countInStock ?? product.countInStock) || 0}{" "}
                sản phẩm có sẵn
              </span>
            </div>

            {/* Thông báo hết hàng */}
            {(selectedVariant?.countInStock ?? product.countInStock) === 0 && (
              <div style={{ color: "red", marginTop: "6px" }}>
                Sản phẩm hiện đã hết hàng.
              </div>
            )}
          </div>

          <ActionWrapper>
            <AddToCartButton onClick={handleAddToCart}>
              🛒 Thêm vào giỏ hàng
            </AddToCartButton>
            <div>
              <HeartButton productId={product._id} withLabel={true} />
            </div>
          </ActionWrapper>

          {message && <Message>{message}</Message>}
        </InfoWrapper>
      </ProductLayout>

      {/* Đánh giá sản phẩm */}
      <ReviewSection productId={id} initialReviews={reviews} />

      {/* Sản phẩm liên quan */}
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
                  key={r._id}
                  onClick={() => navigate(`/product/${r._id}`)}
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
