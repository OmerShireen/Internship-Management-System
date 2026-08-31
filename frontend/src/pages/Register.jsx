import { Form, Input, Button, Card, Typography, Select } from "antd"
import { Link } from "react-router-dom"
import styles from "./Register.module.css"
const { Title, Text } = Typography

function Register() {
  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <div className= {styles.container }>
      <Card className="register-card">
        <Title level={2}>Create Account</Title>

        <Text type="secondary">
          Register for the Internship Management System
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
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

          <div className="login-link">
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