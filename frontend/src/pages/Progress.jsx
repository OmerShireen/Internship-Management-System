import {
    Card,
    Col,
    Progress as AntProgress,
    Row,
    Statistic,
    Table,
    Tag,
    Typography,
  } from "antd"
  
  import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
  } from "@ant-design/icons"
  
  import styles from "./Progress.module.css"
  
  const { Title, Text } = Typography
  
  function Progress() {
    const internProgress = [
      {
        key: "1",
        name: "Ali Ahmed",
        assignedTasks: 5,
        completedTasks: 4,
        progress: 80,
        status: "On Track",
      },
      {
        key: "2",
        name: "Sara Khan",
        assignedTasks: 6,
        completedTasks: 3,
        progress: 50,
        status: "In Progress",
      },
      {
        key: "3",
        name: "Ahmed Raza",
        assignedTasks: 4,
        completedTasks: 1,
        progress: 25,
        status: "Behind",
      },
    ]
  
    const getStatusColor = (status) => {
      if (status === "On Track") return "green"
      if (status === "In Progress") return "blue"
      return "red"
    }
  
    const columns = [
      {
        title: "Intern",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Assigned Tasks",
        dataIndex: "assignedTasks",
        key: "assignedTasks",
      },
      {
        title: "Completed Tasks",
        dataIndex: "completedTasks",
        key: "completedTasks",
      },
      {
        title: "Progress",
        dataIndex: "progress",
        key: "progress",
        render: (progress) => (
          <AntProgress percent={progress} />
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={getStatusColor(status)}>
            {status}
          </Tag>
        ),
      },
    ]
  
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>Intern Progress</Title>
  
            <Text type="secondary">
              Monitor task completion and overall intern progress.
            </Text>
          </div>
        </div>
  
        <Row gutter={[20, 20]} className={styles.statistics}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Interns"
                value={3}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Completed Tasks"
                value={8}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Pending Tasks"
                value={7}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
  
        <Card title="Intern Progress Overview">
          <Table
            columns={columns}
            dataSource={internProgress}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      </div>
    )
  }
  
  export default Progress