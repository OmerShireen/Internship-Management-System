import {
  Card,
  Col,
  Progress as AntProgress,
  Row,
  Table,
  Tag,
  Typography,
  message,
} from "antd"

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons"

import { useEffect, useState } from "react"

import api from "../api/axios"
import styles from "./Progress.module.css"

const { Title, Text } = Typography

function Progress() {
  const [interns, setInterns] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProgressData = async () => {
    try {
      setLoading(true)

      const [internsResponse, tasksResponse] =
        await Promise.all([
          api.get("/interns"),
          api.get("/tasks"),
        ])

      setInterns(internsResponse.data.interns)
      setTasks(tasksResponse.data.tasks)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch progress data"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgressData()
  }, [])

  const progressData = interns.map((intern) => {
    const internTasks = tasks.filter(
      (task) =>
        task.assignedTo?._id === intern._id
    )

    const totalTasks = internTasks.length

    const completedTasks = internTasks.filter(
      (task) => task.status === "completed"
    ).length

    const pendingTasks = internTasks.filter(
      (task) =>
        task.status === "pending" ||
        task.status === "in-progress"
    ).length

    const percentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          )

    return {
      ...intern,
      totalTasks,
      completedTasks,
      pendingTasks,
      percentage,
    }
  })

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "pending" ||
      task.status === "in-progress"
  ).length

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        )

  const getProgressStatus = (percentage) => {
    if (percentage === 100) {
      return "success"
    }

    if (percentage >= 50) {
      return "active"
    }

    return "normal"
  }

  const getProgressTag = (percentage) => {
    if (percentage === 100) {
      return <Tag color="green">Completed</Tag>
    }

    if (percentage > 0) {
      return <Tag color="blue">In Progress</Tag>
    }

    return <Tag color="orange">Not Started</Tag>
  }

  const columns = [
    {
      title: "Intern",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },

    {
      title: "Total Tasks",
      dataIndex: "totalTasks",
      key: "totalTasks",
    },

    {
      title: "Completed",
      dataIndex: "completedTasks",
      key: "completedTasks",
    },

    {
      title: "Pending",
      dataIndex: "pendingTasks",
      key: "pendingTasks",
    },

    {
      title: "Progress",
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage) => (
        <div className={styles.progressCell}>
          <AntProgress
            percent={percentage}
            status={getProgressStatus(percentage)}
          />

          {getProgressTag(percentage)}
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2}>
            Intern Progress
          </Title>

          <Text type="secondary">
            Track the progress of all interns based
            on their assigned tasks.
          </Text>
        </div>
      </div>

      <Row
        gutter={[20, 20]}
        className={styles.statistics}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <FileTextOutlined
                className={styles.statIcon}
              />

              <div>
                <Text type="secondary">
                  Total Tasks
                </Text>

                <Title level={3}>
                  {totalTasks}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <CheckCircleOutlined
                className={styles.statIcon}
              />

              <div>
                <Text type="secondary">
                  Completed
                </Text>

                <Title level={3}>
                  {completedTasks}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <ClockCircleOutlined
                className={styles.statIcon}
              />

              <div>
                <Text type="secondary">
                  Pending
                </Text>

                <Title level={3}>
                  {pendingTasks}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <AntProgress
                type="circle"
                percent={overallProgress}
                size={55}
              />

              <div>
                <Text type="secondary">
                  Overall Progress
                </Text>

                <Title level={3}>
                  {overallProgress}%
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Intern Progress Overview"
        className={styles.tableCard}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={progressData}
          rowKey="_id"
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  )
}

export default Progress