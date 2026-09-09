import { useEffect, useState } from "react"

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
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

import api from "../api/axios"
import styles from "./Interns.module.css"
import { useNavigate } from "react-router-dom"
const { Title, Text } = Typography

function Interns() {
  const [searchText, setSearchText] = useState("")
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIntern, setSelectedIntern] = useState(null)

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [form] = Form.useForm()
  const [addForm] = Form.useForm()

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

  useEffect(() => {
    fetchInterns()
  }, [])

  // =========================
  // ADD INTERN
  // =========================

  const handleAddIntern = async (values) => {
    try {
      const response = await api.post(
        "/auth/register",
        {
          name: values.name,
          email: values.email,
          password: values.password,
          university: values.university,
          department: values.department,
          role: "intern",
        }
      )

      message.success(
        response.data.message ||
          "Intern added successfully"
      )

      setIsAddModalOpen(false)

      addForm.resetFields()

      fetchInterns()
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to add intern"
      )
    }
  }

  const handleAddCancel = () => {
    setIsAddModalOpen(false)

    addForm.resetFields()
  }

  // =========================
  // DEACTIVATE INTERN
  // =========================

  const handleDeactivate = async (intern) => {
    try {
      await api.patch(
        `/interns/${intern._id}/status`
      )

      message.success(
        "Intern deactivated successfully"
      )

      setInterns((previousInterns) =>
        previousInterns.map((item) =>
          item._id === intern._id
            ? { ...item, status: "inactive" }
            : item
        )
      )
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to deactivate intern"
      )
    }
  }

  // =========================
  // EDIT INTERN
  // =========================

  const handleEdit = (intern) => {
    setSelectedIntern(intern)

    form.setFieldsValue({
      name: intern.name,
      email: intern.email,
      university: intern.university,
      department: intern.department,
      status: intern.status,
    })

    setIsModalOpen(true)
  }

  const handleUpdate = async (values) => {
    try {
      const response = await api.put(
        `/interns/${selectedIntern._id}`,
        values
      )

      message.success(
        response.data.message ||
          "Intern updated successfully"
      )

      setInterns((previousInterns) =>
        previousInterns.map((intern) =>
          intern._id === selectedIntern._id
            ? {
                ...intern,
                ...response.data.intern,
                _id: selectedIntern._id,
              }
            : intern
        )
      )

      setIsModalOpen(false)

      setSelectedIntern(null)

      form.resetFields()
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to update intern"
      )
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)

    setSelectedIntern(null)

    form.resetFields()
  }

  // =========================
  // SEARCH
  // =========================

  const filteredInterns = interns.filter((intern) =>
    intern.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )

  // =========================
  // TABLE COLUMNS
  // =========================

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
        <Tag
          color={
            status === "active"
              ? "green"
              : "red"
          }
        >
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
            type="default"
            onClick={() => navigate(`/interns/${record._id}`)}
          >
            View
          </Button>
    
          <Button onClick={() => handleEdit(record)}>
            Edit
          </Button>
    
          <Button
            danger
            onClick={() => handleDeactivate(record._id)}
            disabled={record.status === "inactive"}
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <Title level={2}>
            Intern Management
          </Title>

          <Text type="secondary">
            Manage and monitor all interns.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() =>
            setIsAddModalOpen(true)
          }
        >
          Add Intern
        </Button>
      </div>

      {/* INTERN TABLE */}

      <Card>
        <div className={styles.toolbar}>
          <Input
            placeholder="Search intern by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            className={styles.searchInput}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredInterns}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* =========================
          ADD INTERN MODAL
          ========================= */}

      <Modal
        title="Add Intern"
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        onOk={() => addForm.submit()}
        okText="Add Intern"
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddIntern}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter the intern's name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message:
                  "Please enter the intern's email",
              },
              {
                type: "email",
                message:
                  "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message:
                  "Please enter a password",
              },
              {
                min: 6,
                message:
                  "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="University"
            name="university"
          >
            <Input placeholder="Enter university" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
          >
            <Input placeholder="Enter department" />
          </Form.Item>
        </Form>
      </Modal>

      {/* =========================
          EDIT INTERN MODAL
          ========================= */}

      <Modal
        title="Edit Intern"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save Changes"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter the intern's name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message:
                  "Please enter the intern's email",
              },
              {
                type: "email",
                message:
                  "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="University"
            name="university"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <Select>
              <Select.Option value="active">
                Active
              </Select.Option>

              <Select.Option value="inactive">
                Inactive
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Interns