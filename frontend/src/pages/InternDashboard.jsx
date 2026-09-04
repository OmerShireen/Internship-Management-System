import {
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Button,
} from "antd"

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons"

import { useNavigate } from "react-router-dom"

import styles from "./InternDashboard.module.css"

const { Title, Text } = Typography

function InternDashboard() {
  const navigate = useNavigate()

  const tasks = [
    {
      key: "1",
      title: "Create Login Page",
      deadline: "10 September 2026",
      status: "completed",
    },
    {
      key: "2",
      title: "Build Intern Dashboard",
      deadline: "15 September 2026",
      status: "in-progress",
    },
    {
      key: "3",
      title: "Complete API Integration",
      deadline: "20 September 2026",
      status: "pending",
    },
  ]

  const getStatusColor = (status) => {
    if (status === "completed") return "green"
    if (status === "in-progress") return "blue"

    return "orange"
  }

  const columns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<SendOutlined />}
          disabled={record.status === "completed"}
          onClick={() => navigate("/submit-task")}
        >
          Submit
        </Button>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2}>My Dashboard</Title>

          <Text type="secondary">
            Track your tasks and internship progress.
          </Text>
        </div>
      </div>

      <Row gutter={[20, 20]} className={styles.statistics}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={3}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={1}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={2}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="My Progress"
        className={styles.progressCard}
      >
        <Progress percent={33} />

        <Text type="secondary">
          You have completed 1 out of 3 assigned tasks.
        </Text>
      </Card>

      <Card title="My Assigned Tasks">
        <Table
          columns={columns}
          dataSource={tasks}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  )
}

export default InternDashboard