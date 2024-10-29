"use client";
import { auth } from "@/lib/firebase/firebase";
import {
    loginFormSchema,
    LoginFormType,
} from "@/lib/schemaValidation/LoginFormSchema";
import { cn } from "@/lib/utils";
import { FacebookOutlined, GithubOutlined, GoogleOutlined, MailOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Flex,
    Form,
    Input,
    message,
    Row,
    Space,
    Typography,
} from "antd";
import { createSchemaFieldRule } from "antd-zod";
import useToken from "antd/es/theme/useToken";
import Title from "antd/es/typography/Title";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginForm() {
    const router = useRouter();
    const token = useToken();
    const { Item } = Form;
    const [form] = Form.useForm();
    const rule = createSchemaFieldRule(loginFormSchema);

    // control state
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    async function handleSubmit(values: LoginFormType) {
        try {
            setIsFormSubmitting(true);
            const credential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );
            const idToken = await credential.user.getIdToken();

            await fetch("/api/login", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            setIsFormSubmitting(false);
            router.push("/");
            message.success("Login successful");
        } catch (e: unknown) {
            console.log(e);
            message.error("Invalid email or password");
            form.resetFields(
                ["password"],
            );
            setIsFormSubmitting(false);
        }
    }

    return (
        <div
            className={cn(`w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0`, {
            })}
            style={{
                backgroundColor: token[3].colorBgBase,
            }}
        >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <Row justify={"space-between"}>
                    <Title level={2}>Sign in</Title>
                    <Flex vertical align="flex-start" justify="flex-start">
                        <Typography.Text type="secondary">
                            No account?
                        </Typography.Text>
                        <Typography.Link href="/register">
                            Register
                        </Typography.Link>
                    </Flex>
                </Row>
                <Form
                    form={form}
                    labelCol={{
                        span: 8,
                    }}
                    labelAlign="left"
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Item label="Email" name="email" rules={[rule]}>
                        <Input placeholder="Email" 
                            prefix={<MailOutlined />}
                            size="large"
                        />
                    </Item>
                    <Item label="Password" name="password" rules={[rule]}>
                        <Input.Password placeholder="Password" 
                            size="large"
                        />
                    </Item>
                    <Row justify={"end"} className="-mt-4 mb-4">
                            <Typography.Link href="/auth/forgot-password" type="secondary">
                                Forgot password?
                            </Typography.Link>
                    </Row>
                    <Row justify={"end"}>
                        <Item>
                            <Button
                                variant="solid"
                                color="primary"
                                htmlType="submit"
                                loading={isFormSubmitting}
                            >
                                Sign in
                            </Button>
                        </Item>
                    </Row>
                    <Divider type="horizontal">
                        <Typography.Text type="secondary">Or</Typography.Text>
                    </Divider>
                    <Space direction="vertical" className="w-full" size={"middle"}>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                router.push("/auth/google")
                            }
                            className="w-full"
                            icon={
                                <GoogleOutlined />
                            }
                        >
                            Login with Google
                        </Button>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                router.push("/auth/github")
                            }
                            className="w-full"
                            icon={
                                <FacebookOutlined />
                            }
                        >
                            Login with Facebook
                        </Button>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                router.push("/auth/github")
                            }
                            className="w-full"
                            icon={
                                <GithubOutlined />
                            }
                        >
                            Login with Github
                        </Button>
                    </Space>
                </Form>
            </div>
        </div>
    );
}

export default LoginForm;
