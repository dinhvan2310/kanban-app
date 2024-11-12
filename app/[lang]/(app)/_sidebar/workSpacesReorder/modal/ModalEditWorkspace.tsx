import { getAllUserData, getUserData } from "@/api/user";
import { addRequestWorkSpace, editWorkSpace, getWorkSpace, onSnapshotWorkSpacesOwner, removeRequestWorkSpace } from "@/api/workSpace";
import { FireStoreCollectionFields } from "@/constants/FirebaseConstants";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, List, message, Modal, Row, Space, Spin, Typography } from "antd";
import { Unsubscribe } from "firebase/firestore";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface EditWorkspaceModalProps {
    open: boolean;
    workspaceId: string;
    onCancel: () => void;
}

export const EditWorkspaceModal = ({
    open,
    onCancel,
    workspaceId,
}: EditWorkspaceModalProps) => {
    const { user } = useAuth();
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);

    const [workSpaceName, setWorkSpaceName] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const searchUserDebounce = useDebounce(searchUser, 500);

    const searchUserResult = useQuery({
        queryKey: [searchUserDebounce],
        queryFn: async () => {
            const rs = await getAllUserData(searchUserDebounce);
            const rsFiltered = rs.filter((i) => i.id !== user?.uid
                && !workSpace.data?.members.find((member) => member === i.id)
                && !workSpace.data?.requests.find((request) => request === i.id)
            );
            return rsFiltered;
        },
        throwOnError: true
    })
    const workSpace = useQuery({
        queryKey: [workspaceId],
        queryFn: async () => {
            return await getWorkSpace(workspaceId);
        }
    })
    const members = useQuery({
        queryKey: [workSpace.data?.members],
        queryFn: async () => {
            if (!workSpace.data?.members) return [];
            return await Promise.all(workSpace.data.members.map(async (member) => {
                return (await getUserData(member))
            }))
        }
    })
    const requests = useQuery({
        queryKey: [workSpace.data?.requests],
        queryFn: async () => {
            if (!workSpace.data?.requests) return [];
            return await Promise.all(workSpace.data.requests.map(async (request) => {
                return (await getUserData(request))
            }))
        }
    })
    const editWorkSpaceMutation = useMutation({
        mutationFn: async ({
            name, workSpaceTcon_unified, members
        }: {
            name?: string,
            workSpaceTcon_unified?: string,
            members?: string[]
        }) => {
            if (!user) return;
            await editWorkSpace(
                user?.uid, workspaceId, name, workSpaceTcon_unified, members
            );
        },
        throwOnError: true
    })

    useEffect(() => {
        if (workSpace.data) {
            setWorkSpaceName(workSpace.data.name);
        }
    }, [workSpace.data])

    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if (user)
            unsubscribe = onSnapshotWorkSpacesOwner(() => {
                workSpace.refetch();
                members.refetch();
                requests.refetch();
            }, user.uid)
        return () => {
            unsubscribe?.()
        }
    }, [user])

    return (
        <Modal
            open={open}
            onCancel={() => {
                onCancel();
            }}
            footer={null}
            destroyOnClose={true}
        >
            <Space
                direction="vertical"
                size={"middle"}
                style={{
                    marginBottom: 24,
                    width: "100%",
                }}
            >
                <Typography.Title level={4}>{i18n.Workspace['Edit workspace']}</Typography.Title>
                <Form
                    style={{
                        width: "100%",
                        maxHeight: "70vh",
                        overflowY: "auto",
                        scrollbarWidth: 'none',
                    }}
                    layout="vertical"
                >
                    <Form.Item
                        name={FireStoreCollectionFields.WORKSPACES.NAME}
                        label={i18n.Workspace['Change Workspace Name']}
                        initialValue={workSpace.data?.name}
                        rules={[
                            {
                                required: true,
                                message: i18n.Message['Please enter the workspace name'],
                            },
                        ]}
                    >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={workSpaceName} onChange={(e) => {
                                setWorkSpaceName(e.target.value);
                            }} />
                            <Button
                                loading={editWorkSpaceMutation.isPending}
                                type="primary" icon={<CloudUploadOutlined />}
                                onClick={() => {
                                    editWorkSpaceMutation.mutate({ name: workSpaceName });
                                    onCancel();
                                    message.success(i18n.Message['Workspace updated successfully']);
                                }}
                            />
                        </Space.Compact>
                    </Form.Item>
                    <Space direction='vertical' className='w-full'>
                        <Typography.Title level={5}>{i18n.Workspace['Members']}</Typography.Title>
                        <List
                            dataSource={members.data}
                            loading={members.isLoading}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            danger
                                            key={item.id}
                                            type="text"
                                            onClick={() => {
                                                editWorkSpaceMutation.mutate({
                                                    name: undefined,
                                                    workSpaceTcon_unified: undefined,
                                                    members: workSpace.data?.members?.filter((member) => member !== item.id)
                                                });
                                                members.refetch();
                                            }}
                                        >
                                            {i18n.Common['Remove']}
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={item.email}
                                        avatar={<Image height={36} width={36} src={item.imageUri} alt={item.name} style={{
                                            borderRadius: "50%",
                                        }} />}
                                    />
                                </List.Item>
                            )}
                        />
                    </Space>
                    <Space direction="vertical" className="w-full" size='large'>
                        <Space direction='vertical' className='w-full' size={'small'}>
                            <Typography.Title level={5}>{i18n.Workspace['Add members']}</Typography.Title>
                            <Space direction="vertical" size={'large'} className="w-full">
                                <Input
                                    placeholder={i18n.Workspace['Search by email']}
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                />
                                {searchUserResult.isLoading && <Row justify={'center'} ><Spin size="default"/></Row>}
                                {searchUserResult.isSuccess && searchUserResult.data.length > 0 && (
                                    <Row justify={'space-between'}>
                                        <Space>
                                            <Image src={searchUserResult.data?.[0]?.imageUri} alt={searchUserResult.data?.[0]?.name} width={32} height={32}  style={{
                                                borderRadius: '50%'
                                            }}/>
                                            <Typography.Text>{searchUserResult.data?.[0]?.name}</Typography.Text>
                                        </Space>
                                        <Button
                                            onClick={async () => {
                                                if (!searchUserResult.data?.[0]?.id) return;
                                                await addRequestWorkSpace(
                                                    searchUserResult.data?.[0]?.id,
                                                    workspaceId
                                                )
                                                requests.refetch();
                                                setSearchUser("");
                                            }}
                                        >
                                            {i18n.Common['Add']}
                                        </Button>
                                    </Row>
                                )}
                            </Space>
                        </Space>
                        <Space direction="vertical" className="w-full">
                            <Typography.Title level={5}>{i18n.Common['RequestingToJoin']}</Typography.Title>
                            <List
                                dataSource={requests.data}
                                loading={requests.isLoading}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                danger
                                                key={item.id}
                                                type="text"
                                                onClick={async () => {
                                                    await removeRequestWorkSpace(
                                                        item.id!,
                                                        workspaceId
                                                    )
                                                    requests.refetch();
                                                }}
                                            >
                                                {i18n.Common['Remove']}
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
                                            description={item.email}
                                            avatar={<Image height={36} width={36} src={item.imageUri} alt={item.name} style={{
                                                borderRadius: "50%",
                                            }} />}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Space>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};
