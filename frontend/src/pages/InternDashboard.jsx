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
  Select,
  message,
} from "antd"

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api/axios"
import styles from "./InternDashboard.module.css"

const { Title, Text } = Typography

function InternDashboard() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyTasks = async () => {
    try {
      setLoading(true)

      const response = await api.get("/tasks/my")

      setTasks(response.data.tasks)
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch tasks"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyTasks()
  }, [])

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, {
        status,
      })

      message.success(
        response.data.message || "Task status updated successfully"
      )

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? { ...task, status }
            : task
        )
      )
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to update task status"
      )
    }
  }

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "pending" ||
      task.status === "in-progress"
  ).length

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100)

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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Text>
          {description || "No description"}
        </Text>
      ),
    },

    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) =>
        new Date(deadline).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },

    {
      title: "Update Status",
      key: "updateStatus",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 130 }}
          onChange={(status) =>
            handleStatusChange(record._id, status)
          }
          options={[
            {
              value: "pending",
              label: "Pending",
            },
            {
              value: "in-progress",
              label: "In Progress",
            },
            {
              value: "completed",
              label: "Completed",
            },
          ]}
        />
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
          onClick={() =>
            navigate("/submit-task", {
              state: { taskId: record._id },
            })
          }
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

      <Row
        gutter={[20, 20]}
        className={styles.statistics}
      >
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={pendingTasks}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="My Progress"
        className={styles.progressCard}
      >
        <Progress percent={progressPercentage} />

        <Text type="secondary">
          You have completed {completedTasks} out of{" "}
          {totalTasks} assigned tasks.
        </Text>
      </Card>

      <Card title="My Assigned Tasks">
        <Table
          loading={loading}
          columns={columns}
          dataSource={tasks}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}

export default InternDashboard