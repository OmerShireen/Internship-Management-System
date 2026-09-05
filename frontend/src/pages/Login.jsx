import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { Form, Input, Button, Card, Typography, message } from "antd"
import { Link, useNavigate } from "react-router-dom"

import api from "../api/axios"
import styles from "./Login.module.css"

const { Title, Text } = Typography

function Login() {
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    try {
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      message.success("Login successful!")

      if (user.role === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/intern-dashboard")
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Login failed"
      )
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={2}>Welcome Back</Title>

          <Text type="secondary">
            Login to your Internship Management System account.
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
        >
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
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
          </Form.Item>

          <div className={styles.registerLink}>
            <Text>
              Don't have an account?{" "}
              <Link to="/register">
                Register here
                </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}


export default Login