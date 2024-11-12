'use client'
import ReorderComponent from '@/components/Reorder/Reorder'
import { useI18n } from '@/contexts/i18n/i18nProvider'
import { useAuth } from '@/hooks/useAuth'
import { WorkSpaceType } from '@/types/WorkSpaceType'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AddNewWorkspaceModal } from './modal/ModalAddNewWorkspace'
import WorkSpaceItem from './WorkSpaceItem'

export interface WorkSpaceReorderItem {
    key: string;
    name: string,
    members: string[],
    icon_unified: string,
}

interface WorkSpaceReorderProps {
    inlineCollapsed?: boolean;
    workSpaces: WorkSpaceType[];
    workSpacesOrder: string[];
    onWorkSpaceOrderChange: (workSpacesOrder: string[]) => void;
    isFooter?: boolean;
    isEditable?: boolean;
}

function WorkSpaceReorder({ inlineCollapsed, workSpaces, onWorkSpaceOrderChange, workSpacesOrder, isFooter = true, isEditable = true }: WorkSpaceReorderProps) {
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname();
    const lang = pathname.split('/')[1];
    const i18n = useI18n(lang);

    const [openModalAddNewWorkspace, setOpenModalAddNewWorkspace] =
        useState(false);
    const [order, setOrder] = useState<string[]>(workSpacesOrder);
    useEffect(() => {
        setOrder(workSpacesOrder)
    }, [workSpacesOrder])

    const workSpaceSorted = workSpaces.sort((a, b) => {
        return order.indexOf(a.id!) - order.indexOf(b.id!)
    })

    return (
        <Space direction='vertical' className='w-full'>
            <ReorderComponent<WorkSpaceReorderItem>
                items={workSpaceSorted.map(item => {
                    return {
                        icon_unified: item.icon_unified,
                        key: item.id!,
                        members: item.members,
                        name: item.name
                    }
                })}
                onReorder={(items) => {
                    if (!user) return
                    const newWorkSpaceOrder = items.map(item => item.key)
                    setOrder(newWorkSpaceOrder)
                    onWorkSpaceOrderChange(newWorkSpaceOrder)
                }}
                renderItem={(item) => (
                    <WorkSpaceItem item={item}
                        active={(pathname.split('/')[2] ?? '') === `${item.key}`}
                        inlineCollapsed={inlineCollapsed}
                        onPress={(key) => {
                            router.push(`/${lang}/${key}`)
                        }}
                        isEditable={isEditable}
                    />
                )}
            />
            {isFooter && (
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    className='w-full'
                    onClick={() => {
                        setOpenModalAddNewWorkspace(true);
                    }}
                >
                    {i18n.Common.Add}
                </Button>
            )}
            <AddNewWorkspaceModal
                open={openModalAddNewWorkspace}
                onCancel={() => {
                    setOpenModalAddNewWorkspace(false);
                }}
            />
        </Space>
    )
}

export default WorkSpaceReorder