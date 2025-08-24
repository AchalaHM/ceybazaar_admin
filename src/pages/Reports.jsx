import React, { useState } from 'react';
import { Card, DatePicker, Button, Typography, message, Spin, Row, Col, Statistic } from 'antd';
import { DollarOutlined, ShoppingOutlined, CheckCircleOutlined, TruckOutlined } from '@ant-design/icons';
import AdminService from '../services/AdminService';
import { SUCCESS } from '../util/Constants';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);
  const [rangeReports, setRangeReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  const fetchDailyReport = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getDailyReport(selectedDate.format('YYYY-MM-DD'));
      if (response.responseCode === SUCCESS) {
        setDailyReport(response.responseObject);
      } else {
        message.error('Failed to load daily report.');
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching daily report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRangeReport = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getDateRangeReport(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      if (response.responseCode === SUCCESS) {
        setRangeReports(response.responseObject || []);
      } else {
        message.error('Failed to load range report.');
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching range report.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (reports) => {
    return reports.reduce((acc, report) => ({
      totalOrders: acc.totalOrders + report.totalOrders,
      paidOrders: acc.paidOrders + report.paidOrders,
      completedOrders: acc.completedOrders + report.completedOrders,
      totalRevenue: acc.totalRevenue + report.totalRevenue,
      totalShippingRevenue: acc.totalShippingRevenue + report.totalShippingRevenue
    }), {
      totalOrders: 0,
      paidOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      totalShippingRevenue: 0
    });
  };

  const totals = rangeReports.length > 0 ? calculateTotals(rangeReports) : null;

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <Title level={4}>Reports & Analytics</Title>
      
      {/* Daily Report Section */}
      <Card title="Daily Report" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: 200 }}
          />
          <Button 
            type="primary" 
            style={{ backgroundColor: '#581381' }}
            onClick={fetchDailyReport}
          >
            Generate Daily Report
          </Button>
        </div>
        
        {dailyReport && (
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={dailyReport.totalOrders}
                  prefix={<ShoppingOutlined style={{ color: '#581381' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Paid Orders"
                  value={dailyReport.paidOrders}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed Orders"
                  value={dailyReport.completedOrders}
                  prefix={<TruckOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={dailyReport.totalRevenue}
                  prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                  suffix="LKR"
                  precision={2}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Card>

      {/* Range Report Section */}
      <Card title="Date Range Report">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 300 }}
          />
          <Button 
            type="primary" 
            style={{ backgroundColor: '#581381' }}
            onClick={fetchRangeReport}
          >
            Generate Range Report
          </Button>
        </div>
        
        {totals && (
          <>
            <Title level={5}>Summary</Title>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Orders"
                    value={totals.totalOrders}
                    prefix={<ShoppingOutlined style={{ color: '#581381' }} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Paid Orders"
                    value={totals.paidOrders}
                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Completed Orders"
                    value={totals.completedOrders}
                    prefix={<TruckOutlined style={{ color: '#1890ff' }} />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={totals.totalRevenue}
                    prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                    suffix="LKR"
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>
            
            <Title level={5}>Daily Breakdown</Title>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {rangeReports.map((report, index) => (
                <Card key={index} size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={16}>
                    <Col span={4}>
                      <strong>{report.date}</strong>
                    </Col>
                    <Col span={4}>
                      Orders: {report.totalOrders}
                    </Col>
                    <Col span={4}>
                      Paid: {report.paidOrders}
                    </Col>
                    <Col span={4}>
                      Completed: {report.completedOrders}
                    </Col>
                    <Col span={8}>
                      Revenue: Rs. {report.totalRevenue.toFixed(2)}
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Reports;