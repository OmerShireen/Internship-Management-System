import {
  Layout,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Menu,
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

import { useNavigate, useLocation } from "react-router-dom"

import styles from "./AdminDashboard.module.css"

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

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
        <div className={styles.logo}>
          IMS Admin
        </div>

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
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Interns"
                  value={0}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Tasks"
                  value={0}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Completed Tasks"
                  value={0}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Tasks"
                  value={0}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[20, 20]}
            className={styles.bottomSection}
          >
            <Col xs={24} lg={12}>
              <Card title="Quick Actions">
                <div className={styles.quickActions}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate("/interns")}
                  >
                    Manage Interns
                  </Card>

                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate("/tasks")}
                  >
                    Manage Tasks
                  </Card>

                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate("/progress")}
                  >
                    View Progress
                  </Card>

                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate("/submissions")}
                  >
                    Review Submissions
                  </Card>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Dashboard Overview">
                <p>
                  Use this dashboard to manage interns,
                  create tasks, review submissions, and
                  track overall intern progress.
                </p>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminDashboard