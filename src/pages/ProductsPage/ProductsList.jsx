import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState("most_popular");
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, selectedCategories, priceRange, selectedTags, sortBy]);

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
      if (!categoryFromUrl) {
        res = await axios.get("http://localhost:8080/api/products");
      } else {
        res = await axios.get(
          `http://localhost:8080/api/products?category=${categoryFromUrl}`
        );
      }

      setProducts(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?._id || product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by tags (OR logic - sản phẩm chỉ cần match ít nhất 1 tag)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedTags.some((tag) => {
          if (tag === "best_seller") {
            return product.isBestSeller || product.rating >= 4.5;
          }
          if (tag === "new_in") {
            // Sản phẩm mới trong 30 ngày
            const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return product.isNew || daysSinceCreated <= 30;
          }
          if (tag === "back_in_stock") {
            return product.isBackInStock || (product.countInStock > 0 && product.countInStock <= 10);
          }
          return false;
        });
      });
    }


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
    setSelectedTags([]);
    setSortBy("most_popular");
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
        {(selectedTags.length > 0 || selectedCategories.length > 0) && (
          <FilterTagsContainer>
            <Space wrap>
              {selectedTags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleTagClick(tag)}
                  color="blue"
                >
                  {tag === "best_seller"
                    ? "Best Seller"
                    : tag === "new_in"
                    ? "New In"
                    : "Back in Stock"}
                </Tag>
              ))}
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

          {/* Tags Filter */}
          <div>
            <Title level={5}>Tags</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Checkbox
                checked={selectedTags.includes("best_seller")}
                onChange={(e) =>
                  handleTagClick("best_seller")
                }
              >
                Best Seller
              </Checkbox>
              <Checkbox
                checked={selectedTags.includes("new_in")}
                onChange={(e) => handleTagClick("new_in")}
              >
                New In
              </Checkbox>
              <Checkbox
                checked={selectedTags.includes("back_in_stock")}
                onChange={(e) => handleTagClick("back_in_stock")}
              >
                Back in Stock
              </Checkbox>
            </Space>
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
