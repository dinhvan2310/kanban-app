"use client";
import { Header } from "antd/es/layout/layout";
import useToken from "antd/es/theme/useToken";
import { useAuth } from "@/hooks/useAuth";
import { Button, Dropdown, MenuProps, Row } from "antd";
import Image from "next/image";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";

function HeaderLayout() {
    const token = useToken();
    const { user } = useAuth();
    const router = useRouter();

    const items: MenuProps["items"] = [
        {
            key: "Setting",
            icon: <SettingOutlined />,
            label: "Setting",
            onClick: () => console.log("Setting"),
        },
        {
            key: "Logout",
            icon: <HomeOutlined />,
            label: "Logout",
            onClick: async () => {
                await signOut(auth);
                await fetch("/api/logout");
                router.replace("/login");
            },
        },
    ];

    return (
        <Header style={{ background: token[1].colorBgContainer }}>
            <Row justify={"end"} align={"middle"} className="h-full">
                <Dropdown menu={{ items }} trigger={["click"]} 
                    
                >
                    <Button type="link" className="flex items-center">
                        <Image
                            src={user?.photoURL ?? "/images/no_avatar.png"}
                            alt="User avatar"
                            width={42}
                            height={42}
                            className="rounded-full"
                        />
                    </Button>
                </Dropdown>
            </Row>
        </Header>
    );
}

export default HeaderLayout;
