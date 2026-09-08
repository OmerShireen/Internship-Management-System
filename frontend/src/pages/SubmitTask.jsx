import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd"

import {
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import api from "../api/axios"

import styles from "./SubmitTask.module.css"

const { Title, Text } = Typography
const { TextArea } = Input

function SubmitTask() {
  const navigate = useNavigate()
  const location = useLocation()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form] = Form.useForm()

  const selectedTaskId = location.state?.taskId

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const response = await api.get("/tasks/my")

      const availableTasks = response.data.tasks.filter(
        (task) => task.status !== "completed"
      )

      setTasks(availableTasks)

      if (selectedTaskId) {
        const taskExists = availableTasks.some(
          (task) => task._id === selectedTaskId
        )

        if (taskExists) {
          form.setFieldValue("task", selectedTaskId)
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch tasks"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true)

      const response = await api.post("/submissions", {
        task: values.task,
        submissionLink: values.submissionLink,
        comments: values.comments,
      })

      message.success(
        response.data.message ||
          "Task submitted successfully"
      )

      navigate("/intern-dashboard")
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to submit task"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/intern-dashboard")}
          className={styles.backButton}
        >
          Back to Dashboard
        </Button>

        <div className={styles.header}>
          <Title level={2}>Submit Task</Title>

          <Text type="secondary">
            Submit your completed work for review.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            label="Select Task"
            name="task"
            rules={[
              {
                required: true,
                message: "Please select your task",
              },
            ]}
          >
            <Select
              loading={loading}
              placeholder="Select your task"
              options={tasks.map((task) => ({
                value: task._id,
                label: task.title,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Submission Link"
            name="submissionLink"
            rules={[
              {
                required: true,
                message:
                  "Please enter your submission link",
              },
              {
                type: "url",
                message:
                  "Please enter a valid URL",
              },
            ]}
          >
            <Input
              placeholder="Enter GitHub or project link"
            />
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
          >
            <TextArea
              rows={5}
              placeholder="Add any comments about your submission"
            />
          </Form.Item>

          <Form.Item
            className={styles.submitButton}
          >
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={submitting}
              block
            >
              Submit Task
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SubmitTask