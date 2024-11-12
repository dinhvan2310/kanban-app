'use client'

import { getWorkSpacesOwner, onSnapshotWorkSpacesOwner } from "@/api/workSpace";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Layout, Row, Space, Typography } from "antd";
import { Emoji } from "emoji-picker-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { user } = useAuth()
    const pathName = usePathname();
    const i18n = useI18n(pathName.split("/")[1]);

    const workSpaces = useQuery({
        queryKey: ['home'],
        queryFn: async () => {
            if (!user) return
            return await getWorkSpacesOwner(user.uid);
        }
    })

    useEffect(() => {
        if (!user) return
        const unsubscribe = onSnapshotWorkSpacesOwner(
            () => {
                workSpaces.refetch()
            }, user.uid
        )
        return () => {
            unsubscribe?.()
        }
    }, [user])

    return (
        <Layout>
            <Space direction="vertical" size="large" className="w-full">
                <Typography.Title level={4}>
                    {i18n.Sidebar['Your workspaces']}
                </Typography.Title>
                <Row gutter={16} className="w-full">
                    {
                        workSpaces.data && workSpaces.data.map((workspace) => {
                            return (
                                <Col span={6} key={workspace.id}>
                                    <Card title={
                                        <Space direction="horizontal" size="large" align="center">
                                            <Emoji
                                                unified={workspace.icon_unified ?? ""}
                                                size={28}
                                            />
                                            <Typography.Title
                                                level={4}
                                                style={{
                                                    margin: 0,
                                                }}
                                            >
                                                {workspace.name}
                                            </Typography.Title>
                                        </Space>
                                    }>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Space>
        </Layout>
    )
}
