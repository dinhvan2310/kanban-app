import { addTasksAPI, updateAssignAPI, updateCardAPI, updateDueDateAPI } from '@/api/card';
import { useI18n } from '@/contexts/i18n/i18nProvider';
import { Card, Id, Task } from '@/types/KanBanType';
import { UserDataType } from '@/types/UserDataType';
import { CloudUploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DefinedQueryObserverResult, useMutation } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Divider, Input, List, message, Modal, Popover, Row, Space, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface ModalEditCardProps {
    open: boolean;
    onClose: () => void;
    card: Card;
    members: DefinedQueryObserverResult<UserDataType[], Error>;
}

function ModalEditCard({
    open,
    onClose,
    card,
    members,
}: ModalEditCardProps) {
    const pathName = usePathname();
    const i18n = useI18n(pathName.split("/")[1]);
    const [popoverAssignVisible, setPopoverAssignVisible] = React.useState(false);
    const [cardName, setCardName] = React.useState(card.content);
    const [taskContent, setTaskContent] = React.useState('');
    const [tasks, setTasks] = React.useState<Task[]>(card.tasks);

    const editCardName = useMutation({
        mutationFn: async (name: string) => {
            await updateCardAPI(
                card.id,
                name
            )
        }
    })
    const editDueDate = useMutation({
        mutationFn: async (date: string) => {
            await updateDueDateAPI(
                card.id,
                date
            )
        }
    })
    const assignCard = useMutation({
        mutationFn: async ({ cardId, assignId }: {
            cardId: Id,
            assignId: string
        }) => {
            await updateAssignAPI(
                cardId,
                assignId
            )
        }
    })
    const addTaskMutation = useMutation({
        mutationFn: async (tasks: Task[]) => {
            await addTasksAPI(
                card.id,
                tasks
            )
        }
    })

    useEffect(() => {
        addTaskMutation.mutate(tasks)
    }, [tasks])

    const [assignMember, setAssignMember] = React.useState<UserDataType>()
    const [dueDate, setDueDate] = React.useState(dayjs(card.dueDate, 'DD/MM/YYYY'))
    useEffect(() => {
        if (card.dueDate) {
            setDueDate(dayjs(card.dueDate, 'DD/MM/YYYY'))
        }
        if (card.tasks) {
            setTasks(card.tasks)
        }
    }, [card])
    useEffect(() => {
        if (card.assigneeId) {
            const member = members.data?.filter((member) => member.id === card.assigneeId) || undefined
            if (member) {
                setAssignMember(member[0])
            }
        }
    }, [card.assigneeId, members.data])

    return (
        <Modal
            open={open}
            destroyOnClose
            onCancel={onClose}
            footer={null}
        >
            <Space direction='vertical' className='w-full'
                size={'middle'}
                style={{
                    marginBottom: 32
                }}
            >
                <Typography.Title level={4}>{i18n.Card['Edit card']}</Typography.Title>
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>{i18n.Card['Edit card title']}</Typography.Title>
                    <Space.Compact className='w-full'>
                        <Input value={cardName} onChange={(e) => {
                            setCardName(e.target.value)
                        }} />
                        <Button
                            loading={editCardName.isPending}
                            type="primary" icon={<CloudUploadOutlined />}
                            onClick={() => {
                                editCardName.mutate(cardName);
                            }}
                        />
                    </Space.Compact>
                </Space>
                <Row justify={'space-between'}>
                    <Space direction='vertical'>
                        <Typography.Title level={5}>{i18n.Card['Assign to']}</Typography.Title>
                        <Space size={'small'}>
                            {
                                assignMember && (
                                    <Tooltip
                                        title={assignMember.name}
                                    >
                                        <Image src={assignMember.imageUri} alt={assignMember.name} width={32} height={32}
                                            style={{
                                                borderRadius: '50%'
                                            }}
                                        />
                                    </Tooltip>
                                )
                            }
                            <Popover
                                trigger={'click'}
                                open={popoverAssignVisible}
                                onOpenChange={(open) => setPopoverAssignVisible(open)}
                                content={
                                    <Space direction='vertical' className='w-48'>
                                        <Typography.Title level={5}>{i18n.Card['Assign to']}</Typography.Title>
                                        <Divider type='horizontal' style={{
                                            margin: 0
                                        }} />
                                        <List
                                            dataSource={members.data}
                                            renderItem={(member) => (
                                                <Button
                                                    loading={assignCard.isPending}
                                                    type='text'
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        height: '100%'
                                                    }}
                                                    onClick={async () => {
                                                        await assignCard.mutate({
                                                            cardId: card.id,
                                                            assignId: member.id!
                                                        });
                                                        setPopoverAssignVisible(false);
                                                    }}
                                                >
                                                    <Space>
                                                        <Image src={member.imageUri} alt={member.name} width={32} height={32}
                                                            style={{
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                        <Typography.Text>{member.name}</Typography.Text>
                                                    </Space>
                                                </Button>
                                            )}
                                        />
                                    </Space>
                                }
                            >
                                <Button variant='outlined'
                                    style={{
                                        borderRadius: '50%'
                                    }}
                                    icon={<PlusOutlined />}
                                />
                            </Popover>
                        </Space>
                    </Space>
                    <Space direction='vertical'>
                        <Typography.Title level={5}>{i18n.Card['Due date']}</Typography.Title>
                        <DatePicker
                            value={
                                dueDate
                            }
                            onChange={(date) => {
                                setDueDate(date);
                                editDueDate.mutate(date?.format('DD/MM/YYYY') || '');
                            }}
                        />
                    </Space>
                </Row>
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>{i18n.Card['Tasks']}</Typography.Title>
                    <Space direction='vertical' className='w-full'>
                        {tasks.map((task, index) => (
                            <Row key={index} className='w-full' justify={'space-between'} align={'middle'}>
                                <Checkbox value={task.isDone} defaultChecked={
                                    task.isDone
                                } key={index}
                                    onChange={(e) => {
                                        const newTasks = tasks.map((t) => {
                                            if (t.content === task.content) {
                                                return {
                                                    content: t.content,
                                                    isDone: e.target.checked
                                                }
                                            }
                                            return t
                                        })
                                        setTasks(newTasks)
                                    }}
                                >
                                    <Row justify={'space-between'}>
                                        <Space>
                                            <Typography.Text>{task.content}</Typography.Text>
                                            <Tag color={task.isDone ? 'green' : 'red'}>
                                                {task.isDone ? i18n.Common['Completed'] : i18n.Common['In progress']}
                                            </Tag>
                                        </Space>
                                    </Row>
                                </Checkbox>
                                <Button
                                    onClick={() => {
                                        setTasks(tasks.filter((t) => t.content !== task.content))
                                    }}
                                    type='text'
                                    icon={<DeleteOutlined />}
                                />
                            </Row>
                        ))}
                    </Space>
                    <Space.Compact className='w-full mt-1'>
                        <Input value={taskContent} onChange={(e) => {
                            setTaskContent(e.target.value)
                        }}
                            placeholder={i18n.Card['Add task']}
                        />
                        <Button
                            onClick={() => {
                                let isValid = true;
                                if (taskContent === '') {
                                    isValid = false
                                }
                                tasks.forEach((task) => {
                                    if (task.content === taskContent) {
                                        isValid = false
                                    }
                                })
                                if (isValid) {
                                    setTasks([...tasks, {
                                        content: taskContent,
                                        isDone: false
                                    }])
                                    setTaskContent('')
                                } else {
                                    message.error(i18n.Message['Task already exists or empty'])
                                }
                            }}
                            type='primary' icon={
                                <CloudUploadOutlined />
                            } />
                    </Space.Compact>
                </Space>
            </Space>
        </Modal>
    )
}

export default ModalEditCard