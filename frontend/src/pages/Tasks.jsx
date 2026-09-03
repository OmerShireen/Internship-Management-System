import { useState } from "react"
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd"

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"

import styles from "./Tasks.module.css"

const { Title, Text } = Typography

function Tasks() {
  const [searchText, setSearchText] = useState("")

  const tasks = [
    {
      key: "1",
      title: "Create Login Page",
      description: "Design and implement the login page.",
      assignedTo: "Ali Ahmed",
      deadline: "10 September 2026",
      status: "pending",
    },
    {
      key: "2",
      title: "Build Intern Dashboard",
      description: "Create the intern dashboard interface.",
      assignedTo: "Sara Khan",
      deadline: "15 September 2026",
      status: "in-progress",
    },
    {
      key: "3",
      title: "Complete API Integration",
      description: "Connect frontend with backend APIs.",
      assignedTo: "Ahmed Raza",
      deadline: "20 September 2026",
      status: "completed",
    },
  ]

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.toLowerCase())
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
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => console.log("Edit:", record)}
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log("Delete:", record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2}>Task Management</Title>

          <Text type="secondary">
            Create, assign, and manage intern tasks.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
        >
          Add Task
        </Button>
      </div>

      <Card>
        <div className={styles.toolbar}>
          <Input
            placeholder="Search task by title"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredTasks}
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  )
}

export default Tasks