import { useEffect, useState } from "react"

import {
  Button,
  Card,
  DatePicker,
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
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"

import dayjs from "dayjs"

import api from "../api/axios"
import styles from "./Tasks.module.css"

const { Title, Text } = Typography
const { TextArea } = Input

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [interns, setInterns] = useState([])

  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const [form] = Form.useForm()

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const response = await api.get("/tasks")

      setTasks(response.data.tasks)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch tasks"
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FETCH INTERNS
  // =========================

  const fetchInterns = async () => {
    try {
      const response = await api.get("/interns")

      setInterns(response.data.interns)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch interns"
      )
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchInterns()
  }, [])

  // =========================
  // OPEN ADD TASK MODAL
  // =========================

  const handleAddTask = () => {
    setSelectedTask(null)

    form.resetFields()

    setIsModalOpen(true)
  }

  // =========================
  // OPEN EDIT TASK MODAL
  // =========================

  const handleEdit = (task) => {
    setSelectedTask(task)

    form.setFieldsValue({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id,
      deadline: task.deadline
        ? dayjs(task.deadline)
        : null,
    })

    setIsModalOpen(true)
  }

  // =========================
  // CREATE / UPDATE TASK
  // =========================

  const handleSubmit = async (values) => {
    try {
      const taskData = {
        title: values.title,
        description: values.description,
        assignedTo: values.assignedTo,
        deadline: values.deadline.format(
          "YYYY-MM-DD"
        ),
      }

      if (selectedTask) {
        const response = await api.put(
          `/tasks/${selectedTask._id}`,
          taskData
        )

        message.success(
          response.data.message ||
            "Task updated successfully"
        )
      } else {
        const response = await api.post(
          "/tasks",
          taskData
        )

        message.success(
          response.data.message ||
            "Task created successfully"
        )
      }

      setIsModalOpen(false)

      setSelectedTask(null)

      form.resetFields()

      fetchTasks()
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to save task"
      )
    }
  }

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = (task) => {
    Modal.confirm({
      title: "Delete Task",
      content: `Are you sure you want to delete "${task.title}"?`,

      okText: "Delete",
      okType: "danger",

      cancelText: "Cancel",

      onOk: async () => {
        try {
          const response = await api.delete(
            `/tasks/${task._id}`
          )

          message.success(
            response.data.message ||
              "Task deleted successfully"
          )

          setTasks((previousTasks) =>
            previousTasks.filter(
              (item) =>
                item._id !== task._id
            )
          )
        } catch (error) {
          message.error(
            error.response?.data?.message ||
              "Failed to delete task"
          )
        }
      },
    })
  }

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCancel = () => {
    setIsModalOpen(false)

    setSelectedTask(null)

    form.resetFields()
  }

  // =========================
  // SEARCH
  // =========================

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )

  // =========================
  // TABLE COLUMNS
  // =========================

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

      render: (description) => (
        <Text ellipsis>
          {description}
        </Text>
      ),
    },

    {
      title: "Assigned To",
      key: "assignedTo",

      render: (_, record) => (
        <div>
          <div>
            <strong>
              {record.assignedTo?.name ||
                "Unknown"}
            </strong>
          </div>

          <Text type="secondary">
            {record.assignedTo?.email || ""}
          </Text>
        </div>
      ),
    },

    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",

      render: (deadline) =>
        deadline
          ? dayjs(deadline).format(
              "DD MMM YYYY"
            )
          : "-",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => {
        let color = "gold"

        if (status === "in-progress") {
          color = "blue"
        }

        if (status === "completed") {
          color = "green"
        }

        return (
          <Tag color={color}>
            {status?.toUpperCase()}
          </Tag>
        )
      },
    },

    {
      title: "Actions",
      key: "actions",

      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              handleEdit(record)
            }
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              handleDelete(record)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
          ========================= */}

      <div className={styles.header}>
        <div>
          <Title level={2}>
            Task Management
          </Title>

          <Text type="secondary">
            Create, assign, and manage intern
            tasks.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>

      {/* =========================
          TASK TABLE
          ========================= */}

      <Card>
        <div className={styles.toolbar}>
          <Input
            placeholder="Search task by title"
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
          dataSource={filteredTasks}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* =========================
          ADD / EDIT TASK MODAL
          ========================= */}

      <Modal
        title={
          selectedTask
            ? "Edit Task"
            : "Add Task"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={
          selectedTask
            ? "Save Changes"
            : "Create Task"
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* TITLE */}

          <Form.Item
            label="Task Title"
            name="title"
            rules={[
              {
                required: true,
                message:
                  "Please enter the task title",
              },
            ]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          {/* DESCRIPTION */}

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message:
                  "Please enter the task description",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter task description"
            />
          </Form.Item>

          {/* ASSIGN INTERN */}

          <Form.Item
            label="Assign To"
            name="assignedTo"
            rules={[
              {
                required: true,
                message:
                  "Please select an intern",
              },
            ]}
          >
            <Select
              placeholder="Select an intern"
              showSearch
              optionFilterProp="label"
              options={interns.map(
                (intern) => ({
                  value: intern._id,
                  label: `${intern.name} - ${intern.email}`,
                })
              )}
            />
          </Form.Item>

          {/* DEADLINE */}

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[
              {
                required: true,
                message:
                  "Please select a deadline",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD MMM YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Tasks