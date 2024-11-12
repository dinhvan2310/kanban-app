import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import HeaderLayout from "./_header/headerLayout";
import SidebarLayout from "./_sidebar/sidebarLayout";
import { PropsWithChildren } from "react";


async function AppLayout({children}: PropsWithChildren) {
    return (
        <Layout className="h-screen">
            <SidebarLayout />
            <Layout>
                <HeaderLayout />
                <Content className="h-screen overflow-hidden mx-6 my-4">{children}</Content>
            </Layout>
        </Layout>
    );
}

export default AppLayout;
