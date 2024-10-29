import { PropsWithChildren } from "react";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import HeaderLayout from "./header-layout";
import SiderLayout from "./sider-layout";

function AppLayout({ children }: PropsWithChildren) {
    return (
        <Layout className="h-screen">
            <SiderLayout />
            <Layout>
                <HeaderLayout />
                <Content className="mx-6 my-4">{children}</Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout;
