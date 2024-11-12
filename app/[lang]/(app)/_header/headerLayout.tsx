"use client";
import { getUserData, onSnapshotUserDataWorkSpaceRequest } from "@/api/user";
import { acceptRequest, declineRequest } from "@/api/workSpace";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useTheme } from "@/contexts/Theme/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/firebase";
import { cn } from "@/lib/utils";
import { WorkSpaceType } from "@/types/WorkSpaceType";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Badge,
    Button,
    Divider,
    List,
    Popover,
    Row,
    Space,
    Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";
import useToken from "antd/es/theme/useToken";
import { signOut } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function HeaderLayout() {
    const pathName = usePathname();
    const lang = pathName.split("/")[1];
    const i18n = useI18n(lang);
    const token = useToken();
    const { user } = useAuth();
    const router = useRouter();
    const { themeApp } = useTheme();

    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (user) {
            unsubscribe = onSnapshotUserDataWorkSpaceRequest(() => {
                userData.refetch();
            }, user?.uid);
        }
        return () => {
            unsubscribe?.();
        };
    }, [user]);

    const userData = useQuery({
        queryKey: [user],
        queryFn: async () => {
            if (!user) return null;
            return await getUserData(user.uid);
        },
    });

    const acceptRequestMutation = useMutation({
        mutationFn: async ({
            uid,
            workspaceId,
        }: {
            uid: string;
            workspaceId: string;
        }) => {
            try {
                await acceptRequest(uid, workspaceId);
                userData.refetch();
            } catch (error) {
                console.error(error);
            }
        },
    });
    const declineRequestMutation = useMutation({
        mutationFn: async ({
            uid,
            workspaceId,
        }: {
            uid: string;
            workspaceId: string;
        }) => {
            try {
                declineRequest(uid, workspaceId);
                userData.refetch();
            } catch (error) {
                console.error(error);
            }
        },
    });

    const notificationContent = useMemo(() => {
        return (
            <Space direction="vertical" className="w-[338px]">
                <Typography.Title level={5}>
                    {i18n.Common["Notifications"]}
                </Typography.Title>
                <Divider
                    style={{
                        margin: 0,
                    }}
                />
                <List
                    className={cn("max-h-[338px] overflow-y-auto", {
                        scrollbar: themeApp === "light",
                        scrollbarDark: themeApp === "dark",
                    })}
                    style={{
                        marginRight: 12,
                        marginLeft: 12,
                    }}
                    itemLayout="horizontal"
                    dataSource={userData.data?.workSpaceRequest}
                    renderItem={(item: WorkSpaceType) => (
                        <List.Item className="mr-3">
                            <Space
                                direction="vertical"
                                style={{
                                    maxWidth: 360,
                                }}
                            >
                                <Space>
                                    <Image
                                        src={item.owner.imageUri}
                                        alt={item.owner.name}
                                        width={36}
                                        height={36}
                                        style={{
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <Space
                                        direction="vertical"
                                        size={"small"}
                                        align="start"
                                    >
                                        <Typography.Text strong>
                                            {item.owner.name}
                                        </Typography.Text>
                                        <Typography.Text type="secondary">
                                            {item.owner.email}
                                        </Typography.Text>
                                    </Space>
                                </Space>
                                <Typography.Text type="secondary">
                                    <Typography.Text>
                                        {" "}
                                        {item.owner.name}{" "}
                                    </Typography.Text>
                                    {i18n.Common["inviteYouToJoin"]}{" "}
                                    <Typography.Text>
                                        {i18n.Common["theirWorkspace"]}
                                    </Typography.Text>
                                    {". "}
                                    {i18n.Common["doYouWantToJoin?"]}
                                </Typography.Text>
                                <Row justify={"end"}>
                                    <Space size={"small"}>
                                        <Button
                                            variant="text"
                                            color="danger"
                                            loading={
                                                declineRequestMutation.isPending
                                            }
                                            onClick={() =>
                                                declineRequestMutation.mutate({
                                                    uid: user?.uid ?? "",
                                                    workspaceId: item.id!,
                                                })
                                            }
                                        >
                                            {i18n.Common["Decline"]}
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            loading={
                                                acceptRequestMutation.isPending
                                            }
                                            onClick={() =>
                                                acceptRequestMutation.mutate({
                                                    uid: user?.uid ?? "",
                                                    workspaceId: item.id!,
                                                })
                                            }
                                        >
                                            {i18n.Common["Accept"]}
                                        </Button>
                                    </Space>
                                </Row>
                            </Space>
                        </List.Item>
                    )}
                />
            </Space>
        );
    }, [i18n.Common, userData.data?.workSpaceRequest]);

    const settingContent = useMemo(() => {
        return (
            <Space direction="vertical" className="w-72">
                <List>
                    <List.Item>
                        <List.Item.Meta
                            title={userData.data?.name}
                            description={userData.data?.email}
                            avatar={
                                <Image
                                    height={36}
                                    width={36}
                                    src={userData.data?.imageUri ?? ""}
                                    alt={userData.data?.name ?? "avt"}
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            }
                        />
                    </List.Item>
                </List>

                <Divider
                    style={{
                        margin: 0,
                    }}
                />
                <Button
                    type="text"
                    className="w-full"
                    onClick={async () => {
                        await Promise.all([
                            signOut(auth),
                            fetch("/api/logout"),
                        ]);
                        router.replace(`/${lang}/login`);
                    }}
                    icon={<LogoutOutlined />}
                >
                    {i18n.Common["Logout"]}
                </Button>
            </Space>
        );
    }, [lang, user, i18n.Common, router, userData]);

    return (
        <Header style={{ background: token[1].colorBgElevated }}>
            <Row justify={"end"} align={"middle"} className="h-full">
                <Popover
                    content={notificationContent}
                    trigger={"click"}
                    placement="bottomRight"
                >
                    <Badge count={userData.data?.workSpaceRequest?.length ?? 0}>
                        <Button type="text" icon={<BellOutlined />} />
                    </Badge>
                </Popover>
                <Popover
                    content={settingContent}
                    trigger={"click"}
                    placement="bottomRight"
                >
                    <Button type="link" className="flex items-center">
                        <Image
                            src={userData.data?.imageUri ?? "/images/no_avatar.png"}
                            alt="User avatar"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                    </Button>
                </Popover>
            </Row>
        </Header>
    );
}

export default HeaderLayout;
