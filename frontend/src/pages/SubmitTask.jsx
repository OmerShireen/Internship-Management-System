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
  
  import { useNavigate } from "react-router-dom"
  
  import styles from "./SubmitTask.module.css"
  
  const { Title, Text } = Typography
  const { TextArea } = Input
  
  function SubmitTask() {
    const navigate = useNavigate()
  
    const handleSubmit = (values) => {
      console.log("Submission:", values)
  
      message.success("Task submitted successfully!")
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
                  message: "Please select a task",
                },
              ]}
            >
              <Select placeholder="Select your task">
                <Select.Option value="login-page">
                  Create Login Page
                </Select.Option>
  
                <Select.Option value="intern-dashboard">
                  Build Intern Dashboard
                </Select.Option>
  
                <Select.Option value="api-integration">
                  Complete API Integration
                </Select.Option>
              </Select>
            </Form.Item>
  
            <Form.Item
              label="Submission Link"
              name="submissionLink"
              rules={[
                {
                  required: true,
                  message: "Please enter your submission link",
                },
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input placeholder="Enter GitHub or project link" />
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
  
            <Form.Item className={styles.submitButton}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
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