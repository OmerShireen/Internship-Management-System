import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MailOutlined,
    UserOutlined,
  } from "@ant-design/icons"
  import {
    Button,
    Card,
    Col,
    Descriptions,
    message,
    Progress,
    Row,
    Statistic,
    Tag,
    Typography,
  } from "antd"
  import { useEffect, useState } from "react"
  import { useNavigate, useParams } from "react-router-dom"
  import api from "../api/axios"
  import styles from "./InternDetail.module.css"
  
  const { Title, Text } = Typography
  
  function InternDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
  
    const [intern, setIntern] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
  
    const fetchInternDetails = async () => {
      try {
        setLoading(true)
  
        const [internResponse, tasksResponse] = await Promise.all([
          api.get(`/interns/${id}`),
          api.get("/tasks"),
        ])
  
        setIntern(internResponse.data.intern)
  
        const internTasks = tasksResponse.data.tasks.filter(
          (task) => task.assignedTo?._id === id
        )
  
        setTasks(internTasks)
      } catch (error) {
        message.error(
          error.response?.data?.message || "Failed to fetch intern details"
        )
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => {
      fetchInternDetails()
    }, [id])
  
    if (loading) {
      return (
        <div className={styles.loading}>
          <Text>Loading intern details...</Text>
        </div>
      )
    }
  
    if (!intern) {
      return (
        <div className={styles.container}>
          <Card>
            <Title level={3}>Intern not found</Title>
  
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/interns")}
            >
              Back to Interns
            </Button>
          </Card>
        </div>
      )
    }
  
    const totalTasks = tasks.length
  
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length
  
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending" || task.status === "in-progress"
    ).length
  
    const progressPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100)
  
    return (
      <div className={styles.container}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/interns")}
          className={styles.backButton}
        >
          Back to Interns
        </Button>
  
        <div className={styles.header}>
          <div>
            <Title level={2}>Intern Details</Title>
  
            <Text type="secondary">
              View intern information and task progress.
            </Text>
          </div>
  
          <Tag color={intern.status === "active" ? "green" : "red"}>
            {intern.status?.toUpperCase() || "ACTIVE"}
          </Tag>
        </div>
  
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <UserOutlined />
            </div>
  
            <div>
              <Title level={3} className={styles.name}>
                {intern.name}
              </Title>
  
              <Text type="secondary">
                <MailOutlined /> {intern.email}
              </Text>
            </div>
          </div>
  
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
            }}
          >
            <Descriptions.Item label="Name">
              {intern.name}
            </Descriptions.Item>
  
            <Descriptions.Item label="Email">
              {intern.email}
            </Descriptions.Item>
  
            <Descriptions.Item label="University">
              {intern.university || "Not provided"}
            </Descriptions.Item>
  
            <Descriptions.Item label="Department">
              {intern.department || "Not provided"}
            </Descriptions.Item>
  
            <Descriptions.Item label="Status">
              <Tag color={intern.status === "active" ? "green" : "red"}>
                {intern.status?.toUpperCase() || "ACTIVE"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
  
        <Title level={3} className={styles.sectionTitle}>
          Task Progress
        </Title>
  
        <Row gutter={[20, 20]} className={styles.statistics}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Tasks"
                value={totalTasks}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Completed Tasks"
                value={completedTasks}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Pending Tasks"
                value={pendingTasks}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
  
        <Card className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <div>
              <Title level={4}>Overall Progress</Title>
  
              <Text type="secondary">
                {completedTasks} of {totalTasks} tasks completed
              </Text>
            </div>
  
            <Text strong>{progressPercentage}%</Text>
          </div>
  
          <Progress percent={progressPercentage} />
        </Card>
  
        <Card>
          <Title level={4}>Assigned Tasks</Title>
  
          {tasks.length === 0 ? (
            <Text type="secondary">
              No tasks have been assigned to this intern yet.
            </Text>
          ) : (
            <div className={styles.taskList}>
              {tasks.map((task) => (
                <div className={styles.taskItem} key={task._id}>
                  <div>
                    <Text strong>{task.title}</Text>
  
                    <br />
  
                    <Text type="secondary">
                      Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </div>
  
                  <Tag
                    color={
                      task.status === "completed"
                        ? "green"
                        : task.status === "in-progress"
                        ? "blue"
                        : "orange"
                    }
                  >
                    {task.status?.toUpperCase()}
                  </Tag>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    )
  }
  
  export default InternDetail