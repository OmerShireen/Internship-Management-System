import {
    Card,
    Empty,
    Tag,
    Typography,
  } from "antd"
  
  import {
    CheckCircleOutlined,
    CommentOutlined,
    FileTextOutlined,
  } from "@ant-design/icons"
  
  import styles from "./Feedback.module.css"
  
  const { Title, Text, Paragraph } = Typography
  
  function Feedback() {
    const feedbacks = [
      {
        id: 1,
        task: "Create Login Page",
        status: "approved",
        feedback:
          "Good work! The login page is responsive and the form validation is working correctly.",
        date: "10 September 2026",
      },
      {
        id: 2,
        task: "Build Intern Dashboard",
        status: "needs-improvement",
        feedback:
          "The dashboard layout looks good, but please improve the mobile responsiveness and spacing.",
        date: "12 September 2026",
      },
    ]
  
    const getStatusColor = (status) => {
      if (status === "approved") {
        return "green"
      }
  
      if (status === "needs-improvement") {
        return "orange"
      }
  
      return "blue"
    }
  
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2}>My Feedback</Title>
  
          <Text type="secondary">
            View feedback and comments from your administrator.
          </Text>
        </div>
  
        {feedbacks.length === 0 ? (
          <Card>
            <Empty
              description="No feedback available yet"
            />
          </Card>
        ) : (
          <div className={styles.feedbackList}>
            {feedbacks.map((item) => (
              <Card
                key={item.id}
                className={styles.feedbackCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.taskInfo}>
                    <FileTextOutlined
                      className={styles.taskIcon}
                    />
  
                    <div>
                      <Title
                        level={4}
                        className={styles.taskTitle}
                      >
                        {item.task}
                      </Title>
  
                      <Text type="secondary">
                        Feedback received on {item.date}
                      </Text>
                    </div>
                  </div>
  
                  <Tag color={getStatusColor(item.status)}>
                    {item.status
                      .replace("-", " ")
                      .toUpperCase()}
                  </Tag>
                </div>
  
                <div className={styles.feedbackContent}>
                  <div className={styles.feedbackTitle}>
                    <CommentOutlined />
  
                    <Text strong>
                      Administrator Feedback
                    </Text>
                  </div>
  
                  <Paragraph>
                    {item.feedback}
                  </Paragraph>
                </div>
  
                {item.status === "approved" && (
                  <div className={styles.approved}>
                    <CheckCircleOutlined />
  
                    <Text>
                      This task has been approved.
                    </Text>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default Feedback