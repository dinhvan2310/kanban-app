'use client'
import { Layout, Row, Skeleton, Space, Spin } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import useToken from 'antd/es/theme/useToken'

function Loading() {
    const token = useToken()
    return (
        <Layout className="h-screen">
            <Sider
                trigger={null}
                collapsible
                width={256}
                className={`rounded-lg h-screen`}
                style={{
                    backgroundColor: token[3].colorBgBase,
                    padding: "16px 24px",
                }}
            >
                <Row>
                    <Skeleton.Input active size="default" block />
                </Row>
                <Space direction='vertical' className='w-full mt-8' size={'large'}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton.Button key={index} active size="default" block />
                    ))}
                </Space>
            </Sider>
            <Layout>
                <Header style={{ background: token[1].colorBgBase }} />
                <Content className="h-screen flex justify-center items-center">
                    <Spin size='large' />
                </Content>
            </Layout>
        </Layout>
    )
}

export default Loading