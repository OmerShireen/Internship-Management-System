import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd"

import {
  CheckOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons"

import { useEffect, useState } from "react"

import api from "../api/axios"

import styles from "./Submissions.module.css"

const { Title, Text } = Typography
const { TextArea } = Input

function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [selectedSubmission, setSelectedSubmission] =
    useState(null)

  const [reviewing, setReviewing] =
    useState(false)

  const [form] = Form.useForm()

  const fetchSubmissions = async () => {
    try {
      setLoading(true)

      const response =
        await api.get("/submissions")

      setSubmissions(
        response.data.submissions
      )
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch submissions"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleReview = (submission) => {
    setSelectedSubmission(submission)

    form.setFieldsValue({
      status:
        submission.status === "approved" ||
        submission.status === "rejected"
          ? submission.status
          : undefined,
      feedback: submission.feedback || "",
    })

    setIsModalOpen(true)
  }

  const handleReviewSubmit = async (values) => {
    try {
      setReviewing(true)

      const response =
        await api.patch(
          `/submissions/${selectedSubmission._id}/review`,
          {
            status: values.status,
            feedback: values.feedback,
          }
        )

      message.success(
        response.data.message ||
          "Submission reviewed successfully"
      )

      setSubmissions((previousSubmissions) =>
        previousSubmissions.map((submission) =>
          submission._id ===
          selectedSubmission._id
            ? {
                ...submission,
                ...response.data.submission,
              }
            : submission
        )
      )

      setIsModalOpen(false)
      setSelectedSubmission(null)
      form.resetFields()
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to review submission"
      )
    } finally {
      setReviewing(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedSubmission(null)
    form.resetFields()
  }

  const getStatusColor = (status) => {
    if (status === "pending") return "blue"
    if (status === "approved") return "green"
    if (status === "rejected") return "red"

    return "default"
  }

  const columns = [
    {
      title: "Intern",
      key: "intern",
      render: (_, record) =>
        record.intern?.name || "Unknown",
    },

    {
      title: "Task",
      key: "task",
      render: (_, record) =>
        record.task?.title || "Unknown",
    },

    {
      title: "Submitted At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "N/A",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
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
            onClick={() =>
              window.open(
                record.submissionLink,
                "_blank"
              )
            }
          >
            View
          </Button>

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              handleReview(record)
            }
            disabled={
              record.status === "approved"
            }
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
          <Title level={2}>
            Work Submissions
          </Title>

          <Text type="secondary">
            Review and manage intern task
            submissions.
          </Text>
        </div>
      </div>

      <Card>
        <div className={styles.cardHeader}>
          <FileTextOutlined
            className={styles.icon}
          />

          <Text>
            Submitted work from interns
          </Text>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={submissions}
          rowKey="_id"
          pagination={{
            pageSize: 5,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title="Review Submission"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save Review"
        confirmLoading={reviewing}
      >
        {selectedSubmission && (
          <div className={styles.submissionInfo}>
            <Text strong>
              Intern:{" "}
            </Text>

            <Text>
              {selectedSubmission.intern?.name}
            </Text>

            <br />

            <Text strong>
              Task:{" "}
            </Text>

            <Text>
              {selectedSubmission.task?.title}
            </Text>

            <br />

            <Text strong>
              Submission:{" "}
            </Text>

            <Button
              type="link"
              onClick={() =>
                window.open(
                  selectedSubmission.submissionLink,
                  "_blank"
                )
              }
            >
              Open Submission
            </Button>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleReviewSubmit}
        >
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message:
                  "Please select a status",
              },
            ]}
          >
            <Select
              placeholder="Select review status"
              options={[
                {
                  value: "approved",
                  label: "Approved",
                },
                {
                  value: "rejected",
                  label: "Rejected",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Feedback"
            name="feedback"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    getFieldValue("status") ===
                      "rejected" &&
                    !value
                  ) {
                    return Promise.reject(
                      new Error(
                        "Feedback is required when rejecting"
                      )
                    )
                  }

                  return Promise.resolve()
                },
              }),
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Write feedback for the intern..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Submissions