'use client'
import SidebarMenu, { MenuItemType } from "@/components/SidebarMenu/SidebarMenu";
import { useI18n } from "@/contexts/i18n/i18nProvider";
import { useTheme } from "@/contexts/Theme/ThemeProvider";
import {
  AlertFilled,
  AlertOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Row, Space, Typography } from 'antd';
import Sider from 'antd/es/layout/Sider';
import useToken from 'antd/es/theme/useToken';
import { motion, useAnimate } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from 'react';
import WorkSpaceReorder from "./workSpacesReorder/WorkSpacesReorder";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getWorkSpacesMember, getWorkSpacesOwner, onSnapshotWorkSpacesMember, onSnapshotWorkSpacesOwner } from "@/api/workSpace";
import { FireStoreCollectionFields } from "@/constants/FirebaseConstants";
import { Unsubscribe } from "firebase/firestore";
import { getUserData, setUserData } from "@/api/user";

function SidebarLayout() {
  const { user } = useAuth()
  const pathName = usePathname();
  const lang = pathName.split('/')[1];
  const i18n = useI18n(lang);
  const token = useToken();
  const router = useRouter()
  const pathname = usePathname()
  const { setThemeApp, themeApp } = useTheme();

  // control state
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [scope, animate] = useAnimate()

  // state
  const [selectedKey, setSelectedKey] = useState<string>('')

  // useEffect
  useEffect(() => {
    const key = pathname.split('/')[2]
    if (key) {
      setSelectedKey(key)
    } else {
      setSelectedKey('')
    }
  }, [pathname])

  const workSpacesOwner = useQuery({
    queryKey: ['OWNER'],
    queryFn: async () => {
      if (user) {
        return await getWorkSpacesOwner(user.uid)
      }
      return []
    }
  })
  const workSpacesMember = useQuery({
    queryKey: ['MEMBERS'],
    queryFn: async () => {
      if (user) {
        return await getWorkSpacesMember(user.uid)
      }
      return []
    }
  })
  const workSpacesOwnerOrder = useQuery({
    queryKey: [FireStoreCollectionFields.USER_DATA.WORKSPACE_OWNER_ORDER],
    queryFn: async () => {
      if (user) {
        const rs = await getUserData(user.uid)
        return rs?.workSpaceOwnerOrder
      }
      return []
    }
  })
  const workSpacesMemberOrder = useQuery({
    queryKey: [FireStoreCollectionFields.USER_DATA.WORKSPACE_MEMBER_ORDER],
    queryFn: async () => {
      if (user) {
        const rs = await getUserData(user.uid)
        return rs?.workSpaceMemberOrder
      }
      return []
    }
  })

  useEffect(() => {
    let unsubscribeOwner: Unsubscribe;
    let unsubscribeMember: Unsubscribe;
    if (user) {
      unsubscribeOwner = onSnapshotWorkSpacesOwner(() => {
        workSpacesOwner.refetch();
      }, user?.uid)
      unsubscribeMember = onSnapshotWorkSpacesMember(() => {
        workSpacesMember.refetch();
      }, user?.uid)
    }
    return () => {
      unsubscribeOwner?.()
      unsubscribeMember?.()
    }
  }, [user])

  // menu items
  const menuItems: MenuItemType[] = useMemo(() => [
    {
      key: '',
      type: 'item',
      label: i18n.Sidebar['Home'],
      icon: <HomeOutlined />,
      title: i18n.Sidebar['Home'],
    },
    {
      type: 'divider',
    },
    {
      type: 'custom',
      label: i18n.Sidebar['Your workspaces'],
      renderCustom: (inlineCollapsed) => <WorkSpaceReorder inlineCollapsed={inlineCollapsed}
        workSpaces={workSpacesOwner.data ?? []}
        workSpacesOrder={workSpacesOwnerOrder.data ?? []}
        onWorkSpaceOrderChange={(order) => {
          if (user) {
            setUserData(user.uid, order)
          }
        }}
      />,
    },
    {
      type: 'divider',
    },
    {
      type: 'custom',
      label: i18n.Sidebar['Guest workspaces'],
      renderCustom: (inlineCollapsed) => <WorkSpaceReorder
        inlineCollapsed={inlineCollapsed}
        isFooter={false}
        workSpaces={workSpacesMember.data ?? []}
        workSpacesOrder={workSpacesMemberOrder.data ?? []}
        onWorkSpaceOrderChange={(order) => {
          if (user) {
            setUserData(user.uid, undefined, order)
          }
        }}
        isEditable={false}
      />,
    },
    {
      type: 'divider',
    },
    {
      key: '_appearance',
      type: 'item',
      label: themeApp === 'light' ? i18n.Sidebar['Dark mode'] : i18n.Sidebar['Light mode'],
      icon: themeApp === 'light' ? <AlertOutlined /> : <AlertFilled />,
      title: themeApp === 'light' ? i18n.Sidebar['Dark mode'] : i18n.Sidebar['Light mode'],
    },
    {
      key: 'settings',
      type: 'item',
      label: i18n.Common['Settings'],
      icon: <SettingOutlined />,
      title: i18n.Common['Settings'],
    }
  ], [lang, themeApp, workSpacesOwner, workSpacesMember, workSpacesOwnerOrder, workSpacesMemberOrder]);

  return (
    <Sider
      trigger={null}
      collapsible
      breakpoint="md"
      onBreakpoint={(broken) => {
        if (broken) {
          setCollapsed(true)
        } else {
          setCollapsed(false)
        }
      }}
      collapsed={collapsed}
      width={256}
      className={`rounded-lg h-screen overflow-y-auto overflow-x-hidden scrollbar-thin`}
      style={{
        backgroundColor: token[3].colorBgElevated
      }}
    >
      <Row
        style={{
          justifyContent: "space-between",
          padding: "16px 24px",
          alignItems: "center",
        }}
      >
        <Space align="start">
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => {
              if (collapsed) {
                animate(scope.current, {
                  opacity: 1,
                })
              } else {
                animate(scope.current, {
                  opacity: 0,
                })
              }
              setCollapsed(!collapsed);
            }}
            style={{
              width: 32,
              height: 32,
            }}
          />
          <motion.div
            ref={scope}
            style={{
              textWrap: 'nowrap'
            }}
          >
            <Typography.Title level={4} type="secondary">
              Kanban Board
            </Typography.Title>
          </motion.div>
        </Space>
      </Row>

      <SidebarMenu
        inlineCollapsed={collapsed}
        items={menuItems}
        onPress={(key) => {
          if (key.startsWith('_')) {
            switch (key) {
              case '_appearance':
                setThemeApp(themeApp === 'light' ? 'dark' : 'light')
                break;
            }
          } else {
            setSelectedKey(key)
            router.push(`/${lang}/${key}`)
          }
        }}
        selectedKey={selectedKey}
      />
    </Sider>
  )
}

export default SidebarLayout