import {
    Button,
    Card,
    Space,
    Table,
    Tag,
    Typography,
  } from "antd"
  
  import {
    CheckOutlined,
    EyeOutlined,
    FileTextOutlined,
  } from "@ant-design/icons"
  
  import styles from "./Submissions.module.css"
  
  const { Title, Text } = Typography
  
  function Submissions() {
    const submissions = [
      {
        key: "1",
        intern: "Ali Ahmed",
        task: "Create Login Page",
        submittedAt: "8 September 2026",
        status: "submitted",
      },
      {
        key: "2",
        intern: "Sara Khan",
        task: "Build Intern Dashboard",
        submittedAt: "10 September 2026",
        status: "under-review",
      },
      {
        key: "3",
        intern: "Ahmed Raza",
        task: "Complete API Integration",
        submittedAt: "5 September 2026",
        status: "approved",
      },
    ]
  
    const getStatusColor = (status) => {
      if (status === "submitted") return "blue"
      if (status === "under-review") return "orange"
      if (status === "approved") return "green"
  
      return "default"
    }
  
    const columns = [
      {
        title: "Intern",
        dataIndex: "intern",
        key: "intern",
      },
      {
        title: "Task",
        dataIndex: "task",
        key: "task",
      },
      {
        title: "Submitted At",
        dataIndex: "submittedAt",
        key: "submittedAt",
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
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => console.log("View submission:", record)}
            >
              View
            </Button>
  
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => console.log("Review submission:", record)}
            >
              Review
            </Button>
          </Space>
        ),
      },
    ]
  
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>Work Submissions</Title>
  
            <Text type="secondary">
              Review and manage intern task submissions.
            </Text>
          </div>
        </div>
  
        <Card>
          <div className={styles.cardHeader}>
            <FileTextOutlined className={styles.icon} />
  
            <Text>
              Submitted work from interns
            </Text>
          </div>
  
          <Table
            columns={columns}
            dataSource={submissions}
            pagination={{
              pageSize: 5,
            }}
            scroll={{ x: true }}
          />
        </Card>
      </div>
    )
  }
  
  export default Submissions