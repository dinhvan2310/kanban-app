import { editWorkSpace } from '@/api/workSpace';
import { useTheme } from '@/contexts/Theme/ThemeProvider';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Popover, Row, Space, Typography } from 'antd';
import useToken from 'antd/es/theme/useToken';
import EmojiPicker, { Emoji, Theme } from 'emoji-picker-react';
import React, { useState } from 'react';
import { DeleteWorkspaceModal } from './modal/ModalDeleteWorkspace';
import { EditWorkspaceModal } from './modal/ModalEditWorkspace';
import { WorkSpaceReorderItem } from './WorkSpacesReorder';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/contexts/i18n/i18nProvider';
import { useAuth } from '@/hooks/useAuth';

interface WorkSpaceItemProps {
    item: WorkSpaceReorderItem,
    active: boolean,
    inlineCollapsed?: boolean,
    onPress?: (key: string, e: React.MouseEvent) => void,
    isEditable?: boolean,
}
function WorkSpaceItem({ item, active, inlineCollapsed, onPress, isEditable = true }: WorkSpaceItemProps) {
    const { user } = useAuth()
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);
    const [open, setOpen] = useState(false);
    const { themeApp } = useTheme();
    const token = useToken();
    const [hover, setHover] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);

    return (
        <div
            title={item.name}
            key={item.key}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
                onPress?.(item.key, e);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                minHeight: 32,
                backgroundColor: active
                    ? token[3].colorPrimaryBg : hover
                        ? token[3].colorFillContentHover
                        : token[3].colorBgElevated,
                borderRadius: 4,
                justifyContent: inlineCollapsed ? "center" : "flex-start",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: inlineCollapsed
                        ? "center"
                        : "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: 'center'
                    }}
                >
                    {inlineCollapsed ? (
                        <Typography.Text
                            style={{
                                padding: "8px 8px",
                            }}
                        >
                            <Emoji unified={item.icon_unified} size={20} />
                        </Typography.Text>
                    ) : (
                        <Row justify={'space-between'} className='w-full'>
                            <Space>
                                <Popover
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    trigger={"click"}
                                    content={
                                        <EmojiPicker
                                            onEmojiClick={async (emoji) => {
                                                if (!user?.uid) return;
                                                await editWorkSpace(
                                                    user?.uid,
                                                    item.key,
                                                    undefined,
                                                    emoji.unified,
                                                    undefined,
                                                );
                                            }}
                                            theme={
                                                themeApp === "dark"
                                                    ? Theme.DARK
                                                    : Theme.LIGHT
                                            }
                                        />
                                    }
                                >
                                    <Button
                                        type="text"
                                        style={{
                                            padding: "18px 8px",
                                        }}
                                    >
                                        <Emoji unified={item.icon_unified} size={20} />
                                    </Button>
                                </Popover>
                                <Typography.Text
                                    style={{
                                        display: inlineCollapsed ? "none" : "inline",
                                        marginLeft: 8,
                                    }}
                                >
                                    {item.name}
                                </Typography.Text>
                            </Space>
                            {
                                isEditable && (
                                    <Popover
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        trigger={"click"}
                                        placement="rightBottom"
                                        open={open}
                                        onOpenChange={(open) => setOpen(open)}
                                        content={
                                            <Space direction="vertical" style={{}}>
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setOpenModalEdit(true);
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                >
                                                    {i18n.Workspace['Edit workspace']}
                                                </Button>
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    danger={true}
                                                    onClick={() => {
                                                        setOpenModalDelete(true);
                                                        setOpen(false);
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                    }}
                                                >
                                                    {i18n.Workspace['Delete workspace']}
                                                </Button>
                                            </Space>
                                        }
                                    >
                                        <Button
                                            type="text"
                                            style={{
                                                padding: "18px 8px",
                                            }}
                                        >
                                            {<MoreOutlined />}
                                        </Button>
                                    </Popover>
                                )
                            }
                        </Row>
                    )}
                </div>
            </div>
            {
                isEditable && (
                    <>
                        <DeleteWorkspaceModal
                            open={openModalDelete}
                            onCancel={() => setOpenModalDelete(false)}
                            workspaceId={item.key}
                            workspaceName={item.name}
                        />
                        <EditWorkspaceModal
                            open={openModalEdit}
                            onCancel={() => setOpenModalEdit(false)}
                            workspaceId={item.key}
                        />
                    </>
                )
            }
        </div >
    )
}

export default WorkSpaceItem