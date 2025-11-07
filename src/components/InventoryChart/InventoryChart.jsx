import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Space, Spin, Typography } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { userService } from "../../services";

const { Option } = Select;
const { Title, Text } = Typography;

const colors = ["#1677ff", "#52c41a", "#fa8c16"]; // sold, imported, current

const yearsRange = () => {
  const current = dayjs().year();
  const years = [];
  for (let y = current; y >= current - 5; y--) years.push(y);
  return years;
};

const months = [
  { label: "Cả năm", value: null },
  { label: "01", value: 1 },
  { label: "02", value: 2 },
  { label: "03", value: 3 },
  { label: "04", value: 4 },
  { label: "05", value: 5 },
  { label: "06", value: 6 },
  { label: "07", value: 7 },
  { label: "08", value: 8 },
  { label: "09", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
];

const InventoryChart = () => {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userService.getInventoryChartData(year, month);
      const result = response?.data || { sold: 0, imported: 0, current: 0 };
      setData([
        { name: "Đã bán", value: result.sold || 0 },
        { name: "Đã nhập", value: result.imported || 0 },
        { name: "Tồn kho", value: result.current || 0 },
      ]);
    } catch (e) {
      console.error("Lỗi tải dữ liệu tồn kho", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>📦 Tồn kho</Title>
          </Col>
          <Col>
            <Space>
              <Select value={year} onChange={setYear} style={{ width: 100 }}>
                {yearsRange().map((y) => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
              <Select value={month} onChange={setMonth} style={{ width: 120 }}>
                {months.map((m) => (
                  <Option key={String(m.value)} value={m.value}>{m.label}</Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Chưa có dữ liệu.</div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={110} label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <Text strong>Tổng số lượng: </Text>
              <Title level={4} style={{ display: "inline-block", margin: 0 }}>{total.toLocaleString()}</Title>
              <ul style={{ marginTop: 16 }}>
                {data.map((d, idx) => (
                  <li key={d.name} style={{ marginBottom: 8 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, background: colors[idx % colors.length], marginRight: 8 }} />
                    <Text>{d.name}:</Text> <Text strong> {d.value.toLocaleString()}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default InventoryChart;
