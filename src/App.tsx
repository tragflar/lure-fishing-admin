import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyOutlined,
  KeyOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  EnvironmentOutlined,
  BugOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useTheme } from '@/hooks/useTheme'
import Breadcrumb from '@/components/Breadcrumb'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Dashboard from './pages/Dashboard'
import SystemManagement from '@/pages/SystemManagement'
import UserManagement from './pages/system/UserManagement'
import RoleManagement from './pages/system/RoleManagement'
import PermissionManagement from './pages/system/PermissionManagement'
import FishingSpotManagement from './pages/FishingSpotManagement'
import FishSpeciesManagement from './pages/FishSpeciesManagement'
import FishingUserManagement from './pages/FishingUserManagement'


const { Header, Sider, Content } = Layout

// 模拟登录状态
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// 主布局组件
const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 菜单配置
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/fishing',
      icon: <EnvironmentOutlined />,
      label: '钓点管理',
      children: [
        {
          key: '/fishing/spots',
          icon: <EnvironmentOutlined />,
          label: '钓点信息'
        },
        {
          key: '/fishing/species',
          icon: <BugOutlined />,
          label: '鱼种管理'
        },
        {
          key: '/fishing/users',
          icon: <TeamOutlined />,
          label: '钓鱼佬用户管理'
        }
      ]
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          icon: <UserOutlined />,
          label: '用户管理'
        },
        {
          key: '/system/roles',
          icon: <SafetyOutlined />,
          label: '角色管理'
        },
        {
          key: '/system/permissions',
          icon: <KeyOutlined />,
          label: '权限管理'
        }
      ]
    }
  ]

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'theme',
      icon: isDark ? <SunOutlined /> : <MoonOutlined />,
      label: isDark ? '切换到亮色模式' : '切换到暗色模式',
      onClick: toggleTheme
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          {collapsed ? '路亚' : '路亚管理系统'}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          defaultOpenKeys={['/system']}
          style={{ borderRight: 0, background: 'transparent' }}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key)
          }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 16px',
          background: colorBgContainer,
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Breadcrumb />
          </Space>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{
          margin: '16px',
          padding: '16px',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 'calc(100vh - 112px)'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fishing/spots" element={<FishingSpotManagement />} />
            <Route path="/fishing/species" element={<FishSpeciesManagement />} />
            <Route path="/fishing/users" element={<FishingUserManagement />} />

            <Route path="/system/overview" element={<SystemManagement />} />
            <Route path="/system/users" element={<UserManagement />} />
            <Route path="/system/roles" element={<RoleManagement />} />
            <Route path="/system/permissions" element={<PermissionManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App