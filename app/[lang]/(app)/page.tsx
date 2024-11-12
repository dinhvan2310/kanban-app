'use client'

import { Layout, Space, Typography } from "antd"
import { Content } from "antd/es/layout/layout"

export default function HomePage() {
    return (
        <Layout>
            <Content>
                <Space direction="vertical" size="large">
                    <Typography.Title level={1}>Welcome to the app!</Typography.Title>
                </Space>
            </Content>
        </Layout>
    )
}
