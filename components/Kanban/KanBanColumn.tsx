"use client";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { KanbanType } from "@/types/enum";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Divider, Input, Popover, Space } from "antd";
import useToken from "antd/es/theme/useToken";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Card, Column, Id } from "../../types/KanBanType";
import KanbanCard from "./KanbanCard/KanbanCard";
import { useTheme } from "@/contexts/Theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

interface ColumnProps {
    column: Column;
    cards: Card[];
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string, index: number) => void;
    createCard: (id: Id) => Promise<void>;
    deleteCard: (id: Id) => void;
    workspaceId: string;
}

const KanbanColumn = ({ column, deleteColumn, updateColumn, createCard, cards, deleteCard, workspaceId }: ColumnProps) => {
    const { themeApp } = useTheme()
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);
    const token = useToken()
    const [isEdit, setIsEdit] = useState(false);
    const cardsId = useMemo(() => cards.map((card) => card.id), [cards],);
    const [columTitle, setColumnTitle] = useState(column.title);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging, } = useSortable(
        {
            id: column.id,
            data: {
                type: KanbanType.KanbanColumn,
                column,
            },
            disabled: isEdit,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const createCardMutation = useMutation({
        mutationFn: (id: Id) => {
            return createCard(id)
        },
    })

    if (isDragging) {
        return (
                <div
                    ref={setNodeRef}
                    style={{
                        backgroundColor: token[3].colorBgElevated,
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
                        border : '1px solid',
                        borderColor: token[3].colorBorder,
                        ...style
                    }}
                    className="w-[300px] flex flex-col rounded-lg h-full overflow-x-hidden pt-2 pb-2"
                />
        );
    }

    return (
        <div className="h-full"
            ref={setNodeRef}
        >
            <div
                style={{
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
                    border: '1px solid',
                    borderColor: token[3].colorBorder,
                    backgroundColor: token[3].colorBgElevated,
                    height: 'fit-content',
                    maxHeight: '100%',
                    ...style
                }}
                className="min-w-[300px] flex flex-col rounded-lg overflow-x-hidden pt-2 pb-2"
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="flex px-4"
                >
                    {isEdit ? (<Input
                        size="large"
                        variant="outlined"
                        type="text"
                        style={{
                            fontWeight: 'bold'
                        }}
                        value={columTitle}
                        onBlur={(e) => {
                            setIsEdit(false);
                            updateColumn(column.id, e.target.value, column.columnIndex)

                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setIsEdit(false);
                        }}
                        onChange={(e) =>
                                setColumnTitle(e.target.value)
                        }
                    />) : (<Input
                        size="large"
                        style={{
                            border: '1px solid transparent',
                            pointerEvents: 'none',
                            fontWeight: 'bold'
                        }}
                        onClick={() => setIsEdit(true)}
                        variant="borderless"
                        type="text"
                        value={column.title}
                        onBlur={() => setIsEdit(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setIsEdit(false);
                        }}
                        onChange={(e) =>
                            updateColumn(column.id, e.target.value, column.columnIndex)
                        }
                    />)}
                    <Popover
                        style={{
                            cursor: "pointer",
                            marginLeft: "8px",
                        }}
                        trigger={"click"}
                        placement="rightBottom"
                        content={
                            <Space direction="vertical" style={{}}>
                                <Button
                                    icon={<EditOutlined />}
                                    type="text"
                                    onClick={() => {
                                        setIsEdit(true);
                                    }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    {i18n.Column['Edit column']}
                                </Button>
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger={true}
                                    onClick={() => {
                                        deleteColumn(column.id);
                                    }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    {i18n.Column['Delete column']}
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
                </div>
                <Divider style={{
                    marginTop: 8,
                    marginBottom: 0,
                }} />
                <div className={cn("px-4", {
                    'scrollbar': themeApp === 'light',
                    'scrollbarDark': themeApp === 'dark',
                    'pt-4': cards.length !== 0,
                })}
                    style={{
                        maxHeight: 'calc(100% - 128px)',
                        overflowY: 'auto',
                    }}
                >
                    <SortableContext items={cardsId}>
                        <Space direction="vertical" size={'small'} className="w-full">
                            {cards.map((card, index) => (
                                <KanbanCard key={card.id} card={card} deleteCard={deleteCard}
                                    containerStyle={{
                                        marginBottom: index === cards.length - 1 ? 16 : 0,
                                    }}
                                    workspaceId={workspaceId}
                                />
                            ))}
                        </Space>
                    </SortableContext>
                </div>
                <Divider style={{
                    marginTop: 0,
                    marginBottom: 0,
                }} />
                <Button
                    onClick={() => createCardMutation.mutate(column.id)}
                    type="primary"
                    className="mt-4 mx-4"
                    title="Add Card"
                    icon={<PlusCircleOutlined />}
                    loading={createCardMutation.isPending}
                >
                    {i18n.Card['Add card']}
                </Button>
            </div>
        </div>
    );
};

export default KanbanColumn;
