import { useI18n } from '@/contexts/i18n/i18nProvider';
import { UserDataType } from '@/types/UserDataType';
import { UseQueryResult } from '@tanstack/react-query';
import { Avatar, Checkbox, Drawer, Input, Space, Typography } from 'antd';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface WorkSpaceFilterProps {
    open: boolean;
    onClose: () => void;
    members: UseQueryResult<UserDataType[], Error>;
    filterAssignee: string[];
    setFilterAssignee: Dispatch<SetStateAction<string[]>>;
    filterDueDate: boolean;
    setFilterDueDate: Dispatch<SetStateAction<boolean>>;
    searchValue: string;
    setSearchValue: Dispatch<SetStateAction<string>>;
}

function WorkSpaceFilter({ open, onClose, filterAssignee, filterDueDate, members, setFilterAssignee, setFilterDueDate, searchValue, setSearchValue }: WorkSpaceFilterProps) {
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);

    return (
        <Drawer open={open} closable={true} onClose={onClose}
            title={i18n.Common['Filter']} width={400}
        >
            <Space direction='vertical' className='w-full' size={'large'}>
                <Space direction='vertical' className='w-full'>
                    <Typography.Title level={5}>Search</Typography.Title>
                    <Input
                        placeholder={i18n.Common['Search']}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Space>
                <Space direction='vertical'>
                    <Typography.Title level={5}>
                        {i18n.Workspace['Members']}
                    </Typography.Title>
                    <Checkbox.Group
                        value={filterAssignee}
                        onChange={(value) => {
                            console.log(value)
                            setFilterAssignee(value as string[])
                        }}
                    >
                        <Space direction='vertical'>
                            {members.data?.map((member) => (
                                <Checkbox key={member.id} value={member.id}>
                                    <Space>
                                        <Avatar src={member.imageUri} size={'small'} />
                                        <Typography.Text>
                                            {member.name}
                                        </Typography.Text>
                                    </Space>
                                </Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                </Space>
                <Space direction='vertical'>
                    <Typography.Title level={5}>
                        {i18n.Card['Due date']}
                    </Typography.Title>
                    <Checkbox
                        checked={filterDueDate}
                        onChange={(e) => setFilterDueDate(e.target.checked)}
                    >
                        {i18n.Common['Show']}
                    </Checkbox>
                </Space>
            </Space>
        </Drawer>
    )
}

export default WorkSpaceFilter