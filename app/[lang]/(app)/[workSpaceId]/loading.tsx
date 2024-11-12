'use client'
import { Layout, Spin } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import useToken from 'antd/es/theme/useToken';

function Loading() {
    const token = useToken();
    return (
        <Layout>
            <Header style={{ background: token[1].colorBgBase }} />
            <Content className="h-screen flex justify-center items-center">
                <Spin size='large' />
            </Content>
        </Layout>
    )
}

export default Loading