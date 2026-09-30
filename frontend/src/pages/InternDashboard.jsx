import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import styles from "./InternDashboard.module.css"

const { Title, Text } = Typography

function InternDashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true)

      const response = await api.get("/auth/profile")

      setProfile(response.data.user)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch profile"
      )
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchMyTasks = async () => {
    try {
      setLoadingTasks(true)

      const response = await api.get("/tasks/my")

      setTasks(response.data.tasks || [])
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch tasks"
      )
    } finally {
      setLoadingTasks(false)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchMyTasks()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/")
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await api.patch(
        `/tasks/${taskId}/status`,
        { status }
      )

      message.success(
        response.data.message ||
          "Task status updated successfully"
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
      : Math.round(
          (completedTasks / totalTasks) * 100
        )

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
            handleStatusChange(
              record._id,
              status
            )
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
          disabled={
            record.status === "completed"
          }
          onClick={() =>
            navigate("/submit-task", {
              state: {
                taskId: record._id,
              },
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
          <Title level={2}>
            Intern Dashboard        <Button onClick={handleLogout} className={styles.logoutbtn}>
              Logout
            </Button>
          </Title>

          <Text type="secondary">
            Welcome back,{" "}
            {profile?.name || "Intern"}
          </Text>
        </div>

        
      </div>

      <Card
        className={styles.profileCard}
        loading={loadingProfile}
      >
        <div className={styles.profileHeader}>
          <Avatar
            size={70}
            icon={<UserOutlined />}
          />

          <div>
            <Title
              level={3}
              className={styles.profileName}
            >
              {profile?.name || "N/A"}
            </Title>

            <Text type="secondary">
              {profile?.email || "N/A"}
            </Text>
          </div>
        </div>

        <Descriptions
          bordered
          column={{
            xs: 1,
            sm: 2,
            md: 2,
          }}
        >
          <Descriptions.Item label="Email">
            <MailOutlined />{" "}
            {profile?.email || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Role">
            <Tag color="blue">
              {profile?.role?.toUpperCase() ||
                "INTERN"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="University">
            {profile?.university || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Department">
            {profile?.department || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={
                profile?.status === "active"
                  ? "green"
                  : "red"
              }
            >
              {profile?.status?.toUpperCase() ||
                "N/A"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row
        gutter={[20, 20]}
        className={styles.statistics}
      >
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              loading={loadingTasks}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              loading={loadingTasks}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={pendingTasks}
              loading={loadingTasks}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Overall Progress"
        className={styles.progressCard}
      >
        <Progress
          percent={progressPercentage}
          status={
            progressPercentage === 100
              ? "success"
              : "active"
          }
        />

        <Text type="secondary">
          {completedTasks} of {totalTasks} tasks
          completed
        </Text>
      </Card>

      <Card title="My Assigned Tasks">
        <Table
          loading={loadingTasks}
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