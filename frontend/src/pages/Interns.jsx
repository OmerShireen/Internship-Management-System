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
  EditOutlined,
  SearchOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons"

import styles from "./Interns.module.css"

const { Title, Text } = Typography

function Interns() {
  const [searchText, setSearchText] = useState("")

  const interns = [
    {
      key: "1",
      name: "Ali Ahmed",
      email: "ali@example.com",
      university: "University of Karachi",
      department: "Computer Science",
      status: "active",
    },
    {
      key: "2",
      name: "Sara Khan",
      email: "sara@example.com",
      university: "NED University",
      department: "Software Engineering",
      status: "active",
    },
    {
      key: "3",
      name: "Ahmed Raza",
      email: "ahmed@example.com",
      university: "University of Karachi",
      department: "Computer Science",
      status: "inactive",
    },
  ]

  const filteredInterns = interns.filter((intern) =>
    intern.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
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
            icon={<StopOutlined />}
            onClick={() => console.log("Deactivate:", record)}
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2}>Intern Management</Title>

          <Text type="secondary">
            Manage and monitor all interns.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
        >
          Add Intern
        </Button>
      </div>

      <Card>
        <div className={styles.toolbar}>
          <Input
            placeholder="Search intern by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredInterns}
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  )
}

export default Interns