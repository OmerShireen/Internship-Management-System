import { useEffect, useState } from "react"
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd"
import {
  EditOutlined,
  SearchOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons"

import api from "../api/axios"
import styles from "./Interns.module.css"

const { Title, Text } = Typography

function Interns() {
  const [searchText, setSearchText] = useState("")
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInterns = async () => {
    try {
      setLoading(true)

      const response = await api.get("/interns")

      setInterns(response.data.interns)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        "Failed to fetch interns"
      )
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(()=> {
    fetchInterns()
  },[]) 


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
          {status?.toUpperCase() || "ACTIVE"}
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
            disabled={record.status === "inactive"}
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