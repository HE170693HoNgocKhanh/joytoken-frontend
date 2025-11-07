import React, { useEffect, useState } from "react";
import { Card, Select, Row, Col, Space, Spin, Typography, DatePicker, Segmented } from "antd";
import { AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { trackingService } from "../../services";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { Title, Text } = Typography;

const UserActivityChart = () => {
  const [granularity, setGranularity] = useState("day");
  const [range, setRange] = useState(7);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({ hits: 0, sessions: 0, users: 0 });

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const params = { granularity };
      if (granularity === "hour") {
        params.date = selectedDate.format("YYYY-MM-DD");
      } else {
        params.range = range;
      }
      const response = await trackingService.getActivityTimeline(params);
      if (response.success) {
        setChartData(response.data || []);
        setSummary(response.totals || { hits: 0, sessions: 0, users: 0 });
      }
    } catch (error) {
      setChartData([]);
      setSummary({ hits: 0, sessions: 0, users: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granularity, range, selectedDate]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "#fff", padding: 12, border: "1px solid #d9d9d9", borderRadius: 6, minWidth: 180 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{data.label}</p>
          <p style={{ margin: "6px 0", color: "#1677ff" }}>Lượt truy cập: {data.hits}</p>
          <p style={{ margin: "4px 0", color: "#52c41a" }}>Phiên truy cập: {data.sessions}</p>
          <p style={{ margin: "4px 0", color: "#fa8c16" }}>Người dùng: {data.users}</p>
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
            <Title level={4} style={{ margin: 0 }}>👣 Hoạt động truy cập người dùng</Title>
          </Col>
          <Col>
            <Space size="middle">
              <Segmented options={[{ label: "Theo ngày", value: "day" }, { label: "Theo giờ", value: "hour" }]} value={granularity} onChange={(value) => setGranularity(value)} />
              {granularity === "day" ? (
                <Select value={range} onChange={setRange} style={{ width: 140 }}>
                  <Option value={7}>7 ngày gần nhất</Option>
                  <Option value={14}>14 ngày gần nhất</Option>
                  <Option value={30}>30 ngày gần nhất</Option>
                </Select>
              ) : (
                <DatePicker value={selectedDate} onChange={(value) => value && setSelectedDate(value)} format="DD/MM/YYYY" />
              )}
            </Space>
          </Col>
        </Row>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#f5faff" }}>
            <Text strong>Lượt truy cập</Text>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>{summary.hits}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#f6ffed" }}>
            <Text strong>Phiên truy cập</Text>
            <Title level={4} style={{ margin: 0, color: "#52c41a" }}>{summary.sessions}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#fff7e6" }}>
            <Text strong>Người dùng</Text>
            <Title level={4} style={{ margin: 0, color: "#fa8c16" }}>{summary.users}</Title>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>
      ) : chartData.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Chưa có dữ liệu truy cập trong khoảng thời gian này.</div>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          {granularity === "day" ? (
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="hits" name="Lượt truy cập" stroke="#1677ff" fill="url(#colorHits)" />
              <Line type="monotone" dataKey="sessions" name="Phiên" stroke="#52c41a" strokeWidth={2} />
              <Line type="monotone" dataKey="users" name="Người dùng" stroke="#fa8c16" strokeWidth={2} />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" angle={-30} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="hits" name="Lượt truy cập" fill="#1677ff" />
              <Bar dataKey="sessions" name="Phiên" fill="#52c41a" />
              <Bar dataKey="users" name="Người dùng" fill="#fa8c16" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default UserActivityChart;

