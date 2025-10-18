import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  Container, BackButton, ProductLayout, ImageWrapper, ProductImage,
  InfoWrapper, ProductTitle, Price, Description, StockStatus,
  ActionWrapper, StyleSelector, AddToCartButton, WishlistButton,
  Message, RelatedSection, RelatedGrid, RelatedCard,
  ArrowButton, CustomBox, InputRow, Label, Input, Select, ColorInput, UploadInput, PreviewBox,
  RelatedSlider
} from "./style";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("Medium");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  // Custom Design
  const [custom, setCustom] = useState({
    name: "",
    color: "#c8a165",
    font: "Arial",
    image: null,
  });

  // Related carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 4;

  const handleNext = () => {
    if (currentIndex + itemsPerSlide < related.length) {
      setCurrentIndex(currentIndex + itemsPerSlide);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(Math.max(related.length - itemsPerSlide, 0));
    } else {
      setCurrentIndex(currentIndex - itemsPerSlide);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCustom({ ...custom, image: URL.createObjectURL(file) });
  };

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "Ricky Rain Frog",
        image: "/images/Amuseables.png",
        images: ["/images/Amuseables.png", "/images/Amuseables.png", "/images/Amuseables.png"],
        price: 30.0,
        description: "Ricky Rain Frog siêu mềm mại, đáng yêu và nổi tiếng của Jellycat.",
        countInStock: 10,
        rating: 5,
        category: "Animals",
      },
      {
        id: 2,
        name: "Bashful Bunny",
        image: "/images/Amuseables.png",
        images: ["/images/Amuseables.png", "/images/Amuseables.png", "/images/Amuseables.png"],
        price: 29.99,
        description: "Bunny đáng yêu với bộ lông siêu mịn và cảm giác ấm áp.",
        countInStock: 5,
        rating: 4,
        category: "Animals",
      },
      {
        id: 3,
        name: "Fuddlewuddle Cat",
        image: "/images/Jellies.png",
        images: ["/images/Jellies.png", "/images/Jellies.png", "/images/Jellies.png"],
        price: 32.5,
        description: "Mèo Fuddlewuddle mềm mịn, cực kỳ thân thiện với trẻ em.",
        countInStock: 7,
        rating: 4,
        category: "Animals",
      },
      {
        id: 4,
        name: "Odell Octopus",
        image: "/images/Bags_Charms.png",
        images: ["/images/Bags_Charms.png", "/images/Bags_Charms.png", "/images/Bags_Charms.png"],
        price: 35.0,
        description: "Bạch tuộc Odell dễ thương, mềm mại với 8 xúc tu cực xinh.",
        countInStock: 3,
        rating: 5,
        category: "Animals",
      },
      {
        id: 5,
        name: "Amuseable Avocado",
        image: "/images/Amuseables.png",
        images: ["/images/Amuseables.png", "/images/Amuseables.png", "/images/Amuseables.png"],
        price: 25.0,
        description: "Quả bơ Amuseable đáng yêu, biểu cảm vui nhộn và dễ thương.",
        countInStock: 6,
        rating: 4,
        category: "Animals",
      },
      {
        id: 6,
        name: "Cordy Roy Fox",
        image: "/images/Jellies.png",
        images: ["/images/Jellies.png", "/images/Jellies.png", "/images/Jellies.png"],
        price: 28.0,
        description: "Cáo Cordy Roy với chất liệu nhung mềm mại và an toàn cho trẻ em.",
        countInStock: 8,
        rating: 5,
        category: "Animals",
      },
    ];

    const found = mockData.find((p) => p.id === Number(id));
    setProduct(found || null);
    if (found?.images?.length) setMainImage(found.images[0]);
    else setMainImage(found?.image || "");

    const relatedProducts = mockData.filter(
      (p) => p.category === found?.category && p.id !== found.id
    );
    setRelated(relatedProducts);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
//   const user = localStorage.getItem("userToken"); // kiểm tra đăng nhập
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === product.id);
  const customInfo = { ...custom, style: selectedStyle };

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1, custom: customInfo });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  setMessage("🛍️ Đã thêm sản phẩm (kèm custom) vào giỏ hàng!");
  setTimeout(() => setMessage(null), 2000);

  // Nếu chưa đăng nhập → yêu cầu login
//   if (!user) {
//     navigate("/login", { state: { from: "/cart" } });
//   } else {
//     navigate("/cart"); // đã login → vào trang giỏ
//   }
navigate("/cart");
};


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
                }}
              />
            ))}
          </div>
        </ImageWrapper>

        <InfoWrapper>
          <ProductTitle>{product.name}</ProductTitle>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {[...Array(product.rating)].map((_, i) => (
              <FaStar key={i} color="#f5a623" />
            ))}
            <span style={{ color: "#666" }}>(267 Reviews)</span>
          </div>

          <Price>€{product.price.toFixed(2)}</Price>
          <Description>{product.description}</Description>
          <StockStatus inStock={product.countInStock > 0}>
            {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </StockStatus>

          <StyleSelector>
            <label>Choose a Style</label>
            <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
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
               <option value="Verdana">Verdana (Bình thường - Rõ ràng, dễ thêu nhất)</option>
    <option value="Pacifico">Pacifico (Hoa văn độc đáo - Kiểu viết tay nét đậm, mượt)</option>
    <option value="Impact">Impact (Nổi bật - Nét siêu dày, đặc, tạo khối)</option>
    <option value="Comic Sans MS">Comic Sans MS (Thêu gấu bông - Bo tròn, thân thiện, dễ thương)</option>
    <option value="Dancing Script">Dancing Script (Thêu gấu bông - Kiểu viết tay cá nhân, mềm mại)</option>

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
            <AddToCartButton onClick={handleAddToCart}>Add to Bag</AddToCartButton>
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
          <div className="price">€{r.price.toFixed(2)}</div>
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
