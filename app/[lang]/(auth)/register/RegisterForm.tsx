/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useAuth } from "@/hooks/useAuth";
import { signupFormSchema, SignupFormType } from "@/lib/schemaValidation/SignupFormSchema";
import { FacebookOutlined, GithubOutlined, GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function RegisterForm() {
    const pathName = usePathname();
    const lang = pathName.split('/')[1];
    const i18n = useI18n(lang);
    const router = useRouter();
    const token = useToken();
    const rule = createSchemaFieldRule(signupFormSchema);
    const [form] = Form.useForm();
    const { signUpWithEmailPassword, signInWithFacebook, signInWithGoogle, signInWithGithub } = useAuth();

    const handleSubmit = useMutation({
        mutationFn: async (values: SignupFormType) => {
            try {
                await signUpWithEmailPassword(values.email, values.password);
                message.success(i18n.Message["User created successfully"]);
                router.push(`/${lang}/login`);
            } catch (e: any) {
                console.error(e)
                message.error(`${i18n.Message['Failed to create user']}`);
            }
        }
    })
    const handleSocialLogin = useMutation({
        mutationFn: async (type: 'google' | 'facebook' | 'github') => {
            try {
                switch (type) {
                    case 'google':
                        await signInWithGoogle();
                        break;
                    case 'facebook':
                        await signInWithFacebook();
                        break;
                    case 'github':
                        await signInWithGithub();
                        break;
                }
                window.location.href = `/${lang}/`;
                message.success(i18n.Message['Login successful']);
            } catch (e: any) {
                console.error(e)
                message.error(i18n.Message['Failed to login']);
            }
        }
    })

    return (
        <div
            className={`w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0`}
            style={{
                backgroundColor: token[3].colorBgBase,
                borderColor: token[3].colorBorder,
                borderWidth: 1,
                borderStyle: "solid",
            }}
        >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <Row justify={"space-between"}>
                    <Title level={2}>{i18n.Common['Register']}</Title>
                    <Flex vertical align="flex-start" justify="flex-start">
                        <Typography.Text type="secondary">
                            {i18n.RegisterForm['Already have an account?']}
                        </Typography.Text>
                        <Link href={`/${lang}/login`}>
                            {i18n.Common['Sign in']}
                        </Link>
                    </Flex>
                </Row>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        handleSubmit.mutate(values);
                    }}
                >
                    <Form.Item label={i18n.Common['Email']} name="email" rules={[rule]}>
                        <Input placeholder={i18n.Common['Email']}
                            size="large"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                    <Form.Item label={i18n.Common['Password']} name="password" rules={[rule]}>
                        <Input.Password placeholder={i18n.Common['Password']}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item label={i18n.RegisterForm['Confirm password']} name="confirmPassword" rules={[rule]}>
                        <Input.Password placeholder={i18n.RegisterForm['Confirm password']}
                            size="large"
                        />
                    </Form.Item>
                    <Row justify={"end"}>
                        <Form.Item>
                            <Button
                                variant="solid"
                                color="primary"
                                htmlType="submit"
                                loading={handleSubmit.isPending || handleSocialLogin.isPending}
                            >
                                {i18n.Common['Register']}
                            </Button>
                        </Form.Item>
                    </Row>
                    <Divider type="horizontal">
                        <Typography.Text type="secondary">{i18n.Common['Or']}</Typography.Text>
                    </Divider>
                    <Space direction="vertical" className="w-full" size={"middle"}>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                handleSocialLogin.mutate('google')
                            }
                            className="w-full"
                            icon={
                                <GoogleOutlined />
                            }
                        >
                            {i18n.Common['Sign in with']} Google
                        </Button>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                handleSocialLogin.mutate('facebook')
                            }
                            className="w-full"
                            icon={
                                <FacebookOutlined />
                            }
                        >
                            {i18n.Common['Sign in with']} Facebook
                        </Button>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                                handleSocialLogin.mutate('github')
                            }
                            className="w-full"
                            icon={
                                <GithubOutlined />
                            }
                        >
                            {i18n.Common['Sign in with']} Github
                        </Button>
                    </Space>
                </Form>
            </div>
        </div>
    );
}

export default RegisterForm;
