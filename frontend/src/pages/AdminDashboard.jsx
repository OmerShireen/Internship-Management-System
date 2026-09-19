import {
  Card,
  Col,
  Layout,
  Menu,
  Row,
  Statistic,
  Typography,
  message,
} from "antd"
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios"
import styles from "./AdminDashboard.module.css"

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [stats, setStats] = useState({
    totalInterns: 0,
    activeInterns: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalSubmissions: 0,
  })

  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [internsResponse, tasksResponse, submissionsResponse] =
        await Promise.all([
          api.get("/interns"),
          api.get("/tasks"),
          api.get("/submissions"),
        ])

      const interns = internsResponse.data.interns || []
      const tasks = tasksResponse.data.tasks || []
      const submissions = submissionsResponse.data.submissions || []

      const activeInterns = interns.filter(
        (intern) => intern.status === "active"
      ).length

      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length

      const pendingTasks = tasks.filter(
        (task) =>
          task.status === "pending" || task.status === "in-progress"
      ).length

      setStats({
        totalInterns: interns.length,
        activeInterns,
        completedTasks,
        pendingTasks,
        totalSubmissions: submissions.length,
      })
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const menuItems = [
    {
      key: "/admin-dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/interns",
      icon: <UserOutlined />,
      label: "Interns",
    },
    {
      key: "/tasks",
      icon: <FileTextOutlined />,
      label: "Tasks",
    },
    {
      key: "/progress",
      icon: <BarChartOutlined />,
      label: "Progress",
    },
    {
      key: "/submissions",
      icon: <MessageOutlined />,
      label: "Submissions",
    },
  ]

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={styles.logo}>IMS Admin</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div>
            <Title level={3} className={styles.headerTitle}>
              Admin Dashboard
            </Title>

            <Text type="secondary">
              Manage interns and track their progress
            </Text>
          </div>
        </Header>

        <Content className={styles.content}>
          <Row
            gutter={[20, 20]}
            className={styles.statistics}
          >
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Interns"
                  value={stats.totalInterns}
                  loading={loading}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Interns"
                  value={stats.activeInterns}
                  loading={loading}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Completed Tasks"
                  value={stats.completedTasks}
                  loading={loading}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Tasks"
                  value={stats.pendingTasks}
                  loading={loading}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Card
                title="Submissions"
                className={styles.quickCard}
              >
                <Statistic
                  title="Total Submissions"
                  value={stats.totalSubmissions}
                  loading={loading}
                  prefix={<MessageOutlined />}
                />

                <Text type="secondary">
                  View and review intern submissions.
                </Text>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="Quick Actions"
                className={styles.quickCard}
              >
                <div className={styles.actions}>
                  <Card
                    hoverable
                    onClick={() => navigate("/interns")}
                  >
                    <UserOutlined />
                    <span>Manage Interns</span>
                  </Card>

                  <Card
                    hoverable
                    onClick={() => navigate("/tasks")}
                  >
                    <FileTextOutlined />
                    <span>Manage Tasks</span>
                  </Card>

                  <Card
                    hoverable
                    onClick={() => navigate("/progress")}
                  >
                    <BarChartOutlined />
                    <span>View Progress</span>
                  </Card>

                  <Card
                    hoverable
                    onClick={() => navigate("/submissions")}
                  >
                    <MessageOutlined />
                    <span>Review Submissions</span>
                  </Card>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminDashboard