'use client'
import { auth } from "@/lib/firebase/firebase";
import { signupFormSchema, SignupFormType } from "@/lib/schemaValidation/SignupFormSchema";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
function RegisterForm() {
    const router = useRouter();
    const token = useToken();
    const rule = createSchemaFieldRule(signupFormSchema);
    const [form] = Form.useForm();

    // control state
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    async function handleSubmit(values: SignupFormType) {
        try {
            setIsFormSubmitting(true);
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            message.success("User created successfully");
            setIsFormSubmitting(false);
            router.push("/login");
        } catch (e: unknown) {
            message.error(`Failed to create user: ${e}`);
            setIsFormSubmitting(false);
        }
    }

    return (
        <div
            className={`w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0`}
            style={{
                backgroundColor: token[3].colorBgBase,
            }}
        >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <Row justify={"space-between"}>
                    <Title level={2}>Sign up</Title>
                    <Flex vertical align="flex-start" justify="flex-start">
                        <Typography.Text type="secondary">
                            Have an account?
                        </Typography.Text>
                        <Typography.Link href="/login">
                            Sign in
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
                    <Form.Item label="Email" name="email" rules={[rule]}>
                        <Input placeholder="Email" 
                            size="large"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[rule]}>
                        <Input.Password placeholder="Password" 
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item label="Confirm Password" name="confirmPassword" rules={[rule]}>
                        <Input.Password placeholder="Confirm Password" 
                            size="large"
                        />
                    </Form.Item>

                    <Row justify={"end"}>
                        <Form.Item>
                            <Button
                                variant="solid"
                                color="primary"
                                htmlType="submit"
                                loading={isFormSubmitting}
                            >
                                Sign up
                            </Button>
                        </Form.Item>
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

export default RegisterForm;
