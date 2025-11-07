import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Select, Space, Typography, Spin, Segmented } from "antd";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { userService } from "../../services";

const { Option } = Select;
const { Title, Text } = Typography;

const UserChart = () => {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  const [type, setType] = useState("monthly"); // monthly | daily
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const years = useMemo(() => {
    const y = [];
    for (let i = currentYear - 4; i <= currentYear + 1; i++) y.push(i);
    return y;
  }, [currentYear]);

  const months = [
    { label: "Tháng 1", value: 1 },
    { label: "Tháng 2", value: 2 },
    { label: "Tháng 3", value: 3 },
    { label: "Tháng 4", value: 4 },
    { label: "Tháng 5", value: 5 },
    { label: "Tháng 6", value: 6 },
    { label: "Tháng 7", value: 7 },
    { label: "Tháng 8", value: 8 },
    { label: "Tháng 9", value: 9 },
    { label: "Tháng 10", value: 10 },
    { label: "Tháng 11", value: 11 },
    { label: "Tháng 12", value: 12 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await userService.getUserChartData(type, year, type === "daily" ? month : undefined);
      if (res?.success) {
        setData(res.data || []);
      } else {
        setData([]);
      }
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, year, month]);

  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      return (
        <div style={{ background: "#fff", border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{item.label}</div>
          <div>Người đăng ký mới: {item.value}</div>
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
            <Title level={4} style={{ margin: 0 }}>👥 Người dùng đăng ký</Title>
          </Col>
          <Col>
            <Space size="middle">
              <Segmented
                options={[{ label: "Theo tháng", value: "monthly" }, { label: "Theo ngày", value: "daily" }]}
                value={type}
                onChange={(val) => setType(val)}
              />
              <Select value={year} onChange={setYear} style={{ width: 120 }}>
                {years.map((y) => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
              {type === "daily" && (
                <Select value={month} onChange={setMonth} style={{ width: 140 }}>
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
        <Col xs={24}>
          <Card bordered={false} style={{ background: "#f5faff" }}>
            <Text strong>Tổng đăng ký mới</Text>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>{total}</Title>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Spin size="large" /></div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#999" }}>Chưa có dữ liệu</div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          {type === "monthly" ? (
            <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" name="Đăng ký mới" fill="#1677ff" />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" name="Đăng ký mới" stroke="#1677ff" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default UserChart;

