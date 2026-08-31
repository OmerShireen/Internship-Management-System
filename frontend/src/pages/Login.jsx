import { useState } from "react"
import { Form, Input, Button, Card, Typography } from "antd"
import { Link } from "react-router-dom"
import styles from "./Login.module.css"

const { Title, Text } = Typography

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    console.log({
      email,
      password,
    })
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Internship Management System
        </Title>

        <Text type="secondary" className={styles.subtitle}>
          Login to continue to your dashboard
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            label="Email"
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <div className={styles.registerLink}>
            <Text>
              Don't have an account?{" "}
              <Link to="/register">Register here</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login