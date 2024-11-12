import { getAllUserData, getUserData } from "@/api/user";
import { addWorkSpace } from "@/api/workSpace";
import { FireStoreCollections } from "@/constants/FirebaseConstants";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { UserDataType } from "@/types/UserDataType";
import { WorkSpaceType } from "@/types/WorkSpaceType";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Button,
    Input,
    InputRef,
    List,
    message,
    Modal,
    Popover,
    Row,
    Space,
    Spin,
    Tag,
    Typography
} from "antd";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

interface AddNewWorkspaceModalProps {
    open: boolean;
    onCancel: () => void;
}

export const AddNewWorkspaceModal = ({
    open,
    onCancel,
}: AddNewWorkspaceModalProps) => {
    const pathName = usePathname();
    const i18n = useI18n(pathName.split('/')[1]);
    const { user } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const workspaceInputRef = useRef<InputRef>(null);

    const [requests, setRequests] = useState<UserDataType[]>([]);

    const [workSpaceName, setWorkSpaceName] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("1f423");
    const [searchUser, setSearchUser] = useState<string>("");
    const searchUserDebounce = useDebounce(searchUser, 500);

    const userData = useQuery({
        queryKey: [],
        queryFn: async () => {
            if (!user) return null;
            return await getUserData(user.uid)
        },
    })
    const searchUserResult = useQuery({
        queryKey: [FireStoreCollections.USER_DATA, searchUserDebounce],
        queryFn: async () => {
            const rs = await getAllUserData(searchUserDebounce);
            const rsFiltered = rs.filter((i) => i.id !== user?.uid && !requests.find((request) => request.id === i.id));
            return rsFiltered;
        },
        throwOnError: true
    })
    const addWorkSpaceMutation = useMutation({
        mutationKey: [FireStoreCollections.WORKSPACES],
        mutationFn: async (workSpace: WorkSpaceType) => {
            if (!user) return;
            return await addWorkSpace(workSpace, user.uid);
        }
    })

    return (
        <Modal
            destroyOnClose={true}
            open={open}
            onCancel={() => {
                onCancel();
                setWorkSpaceName("");
            }}
            footer={null}
        >
            <Space
                direction="vertical"
                size={"middle"}
                style={{
                    marginBottom: 24,
                }}
            >
                {contextHolder}
                <Typography.Title level={4}>{i18n.Workspace['Create workspace']}</Typography.Title>
                <Typography.Text type="secondary">
                    {i18n.Workspace['Workspace description']}
                </Typography.Text>

                <Row justify={"start"} align={"middle"} wrap={false}>
                    <Input
                        placeholder={i18n.Workspace['Workspace name']}
                        ref={workspaceInputRef}
                        required
                        value={workSpaceName}
                        onChange={(e) => {
                            setWorkSpaceName(e.target.value);
                        }}
                    />
                    <Space size={8} />
                    <Popover
                        style={{
                            cursor: "pointer",
                        }}
                        trigger={"click"}
                        content={
                            <EmojiPicker
                                onEmojiClick={(emoji) => {
                                    setEmoji(emoji.unified);
                                }}
                            />
                        }
                    >
                        <Button type="text" tabIndex={-1}>
                            <Emoji unified={emoji} size={20} />
                        </Button>
                    </Popover>
                </Row>

                <div>
                    <Typography.Title level={5}>{i18n.Workspace['Members']}</Typography.Title>
                    <List
                        dataSource={[
                            {
                                id: userData.data?.id,
                                name: userData.data?.name,
                                email: userData.data?.email,
                                imageUri: userData.data?.imageUri,
                            } as UserDataType,
                            ...requests,
                        ]}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key={item.id}
                                        disabled={item.id === user?.uid}
                                        onClick={() => {
                                            if (item.id === user?.uid) return;
                                            setRequests(requests.filter((request) => request.id !== item.id));
                                        }}>
                                        {i18n.Common['Remove']}
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            <Typography.Text>
                                                {item.name}
                                            </Typography.Text>
                                            {item.id === user?.uid && <Tag>{`${i18n.Common['Owner']}`}</Tag>}
                                        </Space>
                                    }
                                    description={item.email}
                                    avatar={
                                        <Image height={36} width={36} src={item.imageUri} alt={item.name} style={{
                                            borderRadius: "50%",
                                        }} />
                                    }

                                />
                            </List.Item>
                        )}
                    />
                </div>

                {/* <Typography.Title level={5}>{i18n.Workspace['Add members']}</Typography.Title>
                <Input
                    placeholder={i18n.Workspace['Search by email']}
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                />
                <List
                    dataSource={searchUserResult.data}
                    loading={searchUserResult.isLoading}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key={item.id}
                                    onClick={() => {
                                        if (requests.find((request) => request.id === item.id)) {
                                            messageApi.error(i18n.Message['This user is already in the list']);
                                            return;
                                        }
                                        setRequests([...requests, item]);
                                        setSearchUser("");
                                    }}>Add</Button>
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
                /> */}
                <Space direction="vertical" className="w-full" size={'large'}>
                    <Typography.Title level={5}>{i18n.Workspace['Add members']}</Typography.Title>
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
                            onClick={() => {
                                if (requests.find((request) => request.id === searchUserResult.data[0].id)) {
                                    messageApi.error(i18n.Message['This user is already in the list']);
                                    return;
                                }
                                setRequests([...requests, searchUserResult.data[0]]);
                                setSearchUser("");
                            }}
                        >
                            {i18n.Common['Add']}
                        </Button>
                    </Row>
                    )}
                </Space>

                <Row justify={"end"}>
                    <Button
                        type="primary"
                        onClick={async () => {
                            if (!workSpaceName) {
                                messageApi.error(i18n.Message['Workspace name is required']);
                                return;
                            }
                            if (user === null) return
                            if (!userData.data) return
                            await addWorkSpaceMutation.mutateAsync({
                                name: workSpaceName,
                                owner: userData.data,
                                icon_unified: emoji,
                                members: [],
                                requests: requests.map((request) => request.id).filter((id): id is string => id !== undefined),
                                created_at: Timestamp.now(),
                            });
                            setWorkSpaceName("");
                            onCancel();
                        }}
                        loading={addWorkSpaceMutation.isPending}
                    >
                        {i18n.Common['Create']}
                    </Button>
                </Row>
            </Space>
        </Modal>
    );
};
