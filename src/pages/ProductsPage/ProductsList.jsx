import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Drawer,
  Select,
  Checkbox,
  Slider,
  Typography,
  Space,
  Tag,
  Divider,
  Empty,
  Spin,
} from "antd";
import {
  FilterOutlined,
  CloseOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ProductGrid, FilterContainer, SortContainer, FilterTagsContainer } from "./style";
import ProductItem from "./ProductItem";
import { useCart } from "../../hooks/useCart";

const { Option } = Select;
const { Title, Text } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  
  // Sort state
  const [sortBy, setSortBy] = useState("most_popular");
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const clearFilters = queryParams.get("clearFilters");
  const searchQuery = queryParams.get("search");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch products khi category, clearFilters hoặc search thay đổi
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, clearFilters, searchQuery]);

  // ✅ Xử lý clearFilters và search từ query param
  useEffect(() => {
    if (clearFilters === "true") {
      // Xóa tất cả filters
      setSelectedCategories([]);
      setPriceRange([0, 1000000]);
      setSortBy("most_popular");
      // Xóa query param để tránh clear lại khi reload
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("clearFilters");
      window.history.replaceState(
        {},
        "",
        `${location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
      );
    } else if (categoryFromUrl && !clearFilters && !searchQuery) {
      // Chỉ set category nếu không có search query
      setSelectedCategories([categoryFromUrl]);
    } else if (searchQuery) {
      // Nếu có search query, clear category filter để hiển thị tất cả kết quả search
      setSelectedCategories([]);
    }
  }, [clearFilters, categoryFromUrl, searchQuery, location]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, selectedCategories, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    let res;
    try {
      setLoading(true);
      let url = "http://localhost:8080/api/products";
      const params = new URLSearchParams();
      
      // ✅ Xử lý search query - ưu tiên search
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
        params.append("limit", "1000"); // Lấy nhiều kết quả khi search
      }
      // ✅ Xử lý category (chỉ khi không có search)
      else if (categoryFromUrl && clearFilters !== "true") {
        params.append("category", categoryFromUrl);
        params.append("limit", "1000");
      }
      // ✅ Nếu không có search và category, fetch tất cả với limit
      else {
        params.append("limit", "1000");
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      res = await axios.get(url);
      setProducts(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // ✅ Nếu có search query từ URL, không filter category (backend đã filter rồi)
    // Chỉ filter category nếu không có search query
    if (!searchQuery && selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?._id || product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );


    // Sort
    switch (sortBy) {
      case "new_in":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "a_z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z_a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_low_high":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high_low":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "most_popular":
      default:
        // Sort by rating or sales
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setSortBy("most_popular");
  };

  // Tính min và max price từ products
  const minPrice = products.length > 0 ? Math.min(...products.map((p) => p.price || 0)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price || 0)) : 1000000;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Text type="danger">Lỗi: {error}</Text>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header với Filter và Sort */}
      <FilterContainer>
        {/* ✅ Hiển thị search query nếu có */}
        {searchQuery && (
          <div style={{ marginBottom: 16, padding: "12px 0", borderBottom: "1px solid #e8e8e8" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Kết quả tìm kiếm cho: <span style={{ color: "#ff7b00" }}>"{searchQuery}"</span>
            </Text>
            <Button
              type="link"
              size="small"
              onClick={() => {
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.delete("search");
                navigate(`${location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`);
              }}
              style={{ marginLeft: 12 }}
            >
              Xóa tìm kiếm
            </Button>
          </div>
        )}
        
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="default"
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
              size="large"
            >
              Filter
            </Button>
          </Col>
          <Col flex="auto" />
          <Col>
            <Text strong style={{ marginRight: 8 }}>
              {filteredProducts.length} sản phẩm
              {searchQuery && ` cho "${searchQuery}"`}
            </Text>
          </Col>
          <Col>
            <SortContainer>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
                size="large"
              >
                <Option value="most_popular">Most Popular</Option>
                <Option value="new_in">New In</Option>
                <Option value="a_z">A - Z</Option>
                <Option value="z_a">Z - A</Option>
                <Option value="price_low_high">Price (Low to High)</Option>
                <Option value="price_high_low">Price (High to Low)</Option>
              </Select>
            </SortContainer>
          </Col>
        </Row>

        {/* Filter Tags - chỉ hiển thị khi có filter active */}
        {selectedCategories.length > 0 && (
          <FilterTagsContainer>
            <Space wrap>
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c._id === catId);
                return (
                  <Tag
                    key={catId}
                    closable
                    onClose={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((id) => id !== catId)
                      )
                    }
                    color="green"
                  >
                    {cat?.name || catId}
                  </Tag>
                );
              })}
              <Button
                type="link"
                size="small"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
              >
                Xóa tất cả
              </Button>
            </Space>
          </FilterTagsContainer>
        )}
      </FilterContainer>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Empty
          description="Không tìm thấy sản phẩm nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "100px 0" }}
        />
      ) : (
        <ProductGrid>
          {filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              product={item}
              onAddToCart={addToCart}
            />
          ))}
        </ProductGrid>
      )}

      {/* Filter Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Bộ lọc
            </Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setFilterDrawerVisible(false)}
            />
          </div>
        }
        placement="left"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={320}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Category Filter */}
          <div>
            <Title level={5}>Danh mục</Title>
            <Checkbox.Group
              value={selectedCategories}
              onChange={setSelectedCategories}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {categories.map((cat) => (
                  <Checkbox key={cat._id} value={cat._id}>
                    {cat.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          <Divider />

          {/* Price Range Filter */}
          <div>
            <Title level={5}>Khoảng giá</Title>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={setPriceRange}
              step={10000}
              tooltip={{
                formatter: (value) => `${value?.toLocaleString("vi-VN")}₫`,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <Text type="secondary">
                {priceRange[0].toLocaleString("vi-VN")}₫
              </Text>
              <Text type="secondary">
                {priceRange[1].toLocaleString("vi-VN")}₫
              </Text>
            </div>
          </div>

          <Divider />

          {/* Clear Filters Button */}
          <Button
            type="default"
            block
            icon={<ClearOutlined />}
            onClick={handleClearFilters}
          >
            Xóa tất cả bộ lọc
          </Button>
        </Space>
      </Drawer>
    </div>
  );
};

export default ProductList;
