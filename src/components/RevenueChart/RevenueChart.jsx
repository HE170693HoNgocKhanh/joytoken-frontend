import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Select, Space, Segmented, Spin, Typography } from "antd";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { userService } from "../../services";

const { Option } = Select;
const { Title, Text } = Typography;

const yearsRange = () => {
  const current = dayjs().year();
  const years = [];
  for (let y = current; y >= current - 5; y--) years.push(y);
  return years;
};

const months = [
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

const RevenueChart = () => {
  const [type, setType] = useState("monthly"); // monthly | daily
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const totals = useMemo(() => {
    return data.reduce(
      (acc, d) => {
        acc.revenue += d.revenue || 0;
        acc.orders += d.orders || 0;
        return acc;
      },
      { revenue: 0, orders: 0 }
    );
  }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const paramsType = type === "monthly" ? "monthly" : "daily";
      const response = await userService.getRevenueChartData(paramsType, year, type === "daily" ? month : undefined);
      setData(response?.data || []);
    } catch (e) {
      console.error("Lỗi tải dữ liệu doanh thu", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, year, month]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{ background: "#fff", padding: 12, border: "1px solid #d9d9d9", borderRadius: 6 }}>
          <div style={{ fontWeight: 600 }}>{d.label}</div>
          <div style={{ color: "#1677ff" }}>Doanh thu: {d.revenue?.toLocaleString()}</div>
          <div style={{ color: "#fa8c16" }}>Đơn hàng: {d.orders}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>💰 Doanh thu</Title>
          </Col>
          <Col>
            <Space size="middle">
              <Segmented
                options={[{ label: "Theo tháng", value: "monthly" }, { label: "Theo ngày", value: "daily" }]}
                value={type}
                onChange={setType}
              />
              <Select value={year} onChange={setYear} style={{ width: 100 }}>
                {yearsRange().map((y) => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
              {type === "daily" && (
                <Select value={month} onChange={setMonth} style={{ width: 90 }}>
                  {months.map((m) => (
                    <Option key={m.value} value={m.value}>{m.label}</Option>
                  ))}
                </Select>
              )}
            </Space>
          </Col>
        </Row>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ background: "#f6ffed" }}>
            <Text strong>Tổng doanh thu</Text>
            <Title level={4} style={{ margin: 0, color: "#389e0d" }}>{totals.revenue.toLocaleString()} đ</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ background: "#fff7e6" }}>
            <Text strong>Tổng đơn hàng</Text>
            <Title level={4} style={{ margin: 0, color: "#fa8c16" }}>{totals.orders}</Title>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Chưa có dữ liệu.</div>
      ) : type === "monthly" ? (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" allowDecimals={false} tickFormatter={(v) => v.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#1677ff" />
            <Bar yAxisId="right" dataKey="orders" name="Đơn hàng" fill="#fa8c16" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" allowDecimals={false} tickFormatter={(v) => v.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#1677ff" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="orders" name="Đơn hàng" stroke="#fa8c16" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default RevenueChart;
