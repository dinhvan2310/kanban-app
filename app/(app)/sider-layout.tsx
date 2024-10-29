"use client";
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Menu, Row, Space, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import useToken from "antd/es/theme/useToken";
import { motion, useAnimate } from "framer-motion";
import { useState } from "react";

function SiderLayout() {
    const token = useToken();

    // control state
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [scope, animate] = useAnimate()

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={256}
            className={`bg-white rounded-lg h-screen overflow-y-auto overflow-x-hidden scrollbar-thin`}
        >
            <Row
                style={{
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    alignItems: "center",
                }}
            >
                <Space align="start">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => {
                            if (collapsed) {
                                animate(scope.current, {
                                    opacity: 1,
                                })
                            } else {
                                animate(scope.current, {
                                    opacity: 0,
                                })
                            }
                            setCollapsed(!collapsed);
                        }}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                    <motion.div
                            ref={scope}
                            style={{
                                textWrap: 'nowrap'
                            }}
                        >
                            <Typography.Title level={4} type="secondary">
                                Tab Manager
                            </Typography.Title>
                        </motion.div>
                </Space>
            </Row>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ background: token[1].colorBgContainer }}
            >
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    Home
                </Menu.Item>
                <Menu.Item key="2" icon={<PlusOutlined />}>
                    Add Tab
                </Menu.Item>
                <Menu.Item key="3" icon={<SettingOutlined />}>
                    Settings
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default SiderLayout;
