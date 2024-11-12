import { getUserData } from '@/api/user';
import { FireStoreCollectionFields } from '@/constants/FirebaseConstants';
import { useI18n } from '@/contexts/i18n/i18nProvider';
import { WorkSpaceType } from '@/types/WorkSpaceType';
import { useQuery } from '@tanstack/react-query';
import { Drawer, Form, Input, List, Space, Typography } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface WorkspaceInfoProps {
    open: boolean;
    onClose: () => void;
    workSpace?: WorkSpaceType;
}

function WorkspaceInfo({ open, workSpace, onClose }: WorkspaceInfoProps) {
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);

    const members = useQuery({
        queryKey: [FireStoreCollectionFields.WORKSPACES.MEMBERS],
        queryFn: async () => {
            if (!workSpace?.members) return [];
            return await Promise.all(workSpace.members.map(async (member) => {
                return (await getUserData(member))
            }))
        }
    })
    const requests = useQuery({
        queryKey: [FireStoreCollectionFields.WORKSPACES.REQUEST],
        queryFn: async () => {
            if (!workSpace?.requests) return [];
            return await Promise.all(workSpace.requests.map(async (request) => {
                return (await getUserData(request))
            })
            )
        }
    })

    useEffect(() => {
        if (open) {
            console.log('refetch')
            members.refetch()
            requests.refetch()
        }
    }, [open])

    return (
        <Drawer open={open} closable={true} onClose={onClose}
            title={workSpace?.name}
        >
            <Form labelCol={{
                span: 8,
            }}
                labelAlign='left'
            >
                <Form.Item label="Name">
                    <Input
                        disabled
                        value={workSpace?.name}
                    />
                </Form.Item>
                <Form.Item label="Create at">
                    <Input value={workSpace?.created_at?.toDate().toDateString()} disabled />
                </Form.Item>
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>{i18n.Common['Owner']}</Typography.Title>
                    <List>
                        <List.Item>
                            <List.Item.Meta
                                title={workSpace?.owner.name}
                                description={workSpace?.owner.email}
                                avatar={<Image height={36} width={36} src={workSpace?.owner.imageUri ?? ''} alt={workSpace?.owner.name ?? 'avt'} style={{
                                    borderRadius: "50%",
                                }} />}
                            />
                        </List.Item>
                    </List>
                </Space>
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>{i18n.Workspace['Members']}</Typography.Title>
                    <List
                        loading={members.isLoading}
                        dataSource={members.data}
                        renderItem={(item) => (
                            <List.Item
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
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>{i18n.Common['RequestingToJoin']}</Typography.Title>
                    <List
                        dataSource={requests.data}
                        loading={requests.isLoading}
                        renderItem={(item) => (
                            <List.Item
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
            </Form>
        </Drawer>
    )
}

export default WorkspaceInfo