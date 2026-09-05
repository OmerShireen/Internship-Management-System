import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  message,
} from "antd"

import { Link, useNavigate } from "react-router-dom"

import api from "../api/axios"
import styles from "./Register.module.css"

const { Title, Text } = Typography

function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    try {
      const response = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        university: values.university,
        department: values.department,
        role: values.role,
      })

      message.success(response.data.message)

      navigate("/")
    } catch (error) {
      message.error(
        error.response?.data?.message || "Registration failed"
      )
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Create Account
        </Title>

        <Text type="secondary" className={styles.subtitle}>
          Register for the Internship Management System
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name",
              },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="University"
            name="university"
            rules={[
              {
                required: true,
                message: "Please enter your university",
              },
            ]}
          >
            <Input placeholder="Enter your university name" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: "Please enter your department",
              },
            ]}
          >
            <Input placeholder="Enter your department" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select placeholder="Select your role">
              <Select.Option value="intern">
                Intern
              </Select.Option>

              <Select.Option value="admin">
                Admin
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Register
            </Button>
          </Form.Item>

          <div className={styles.loginLink}>
            <Text>
              Already have an account?{" "}
              <Link to="/">Login here</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register