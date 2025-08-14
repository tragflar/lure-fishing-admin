import React from 'react'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeOutlined, SettingOutlined, UserOutlined, SafetyOutlined, KeyOutlined, EnvironmentOutlined, BugOutlined, TeamOutlined } from '@ant-design/icons'

const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/': { title: '首页', icon: <HomeOutlined /> },
  '/fishing': { title: '钓点管理', icon: <EnvironmentOutlined /> },
  '/fishing/spots': { title: '钓点信息', icon: <EnvironmentOutlined /> },
  '/fishing/species': { title: '鱼种管理', icon: <BugOutlined /> },
  '/fishing/users': { title: '钓鱼佬用户管理', icon: <TeamOutlined /> },
  '/system': { title: '系统管理', icon: <SettingOutlined /> },
  '/system/users': { title: '用户管理', icon: <UserOutlined /> },
  '/system/roles': { title: '角色管理', icon: <SafetyOutlined /> },
  '/system/permissions': { title: '权限管理', icon: <KeyOutlined /> },
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const pathnames = location.pathname.split('/').filter(x => x)

  const breadcrumbItems = [
    {
      title: (
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <HomeOutlined style={{ marginRight: 4 }} />
          首页
        </span>
      ),
    },
  ]

  let currentPath = ''
  pathnames.forEach((name, index) => {
    currentPath += `/${name}`
    const config = routeConfig[currentPath]
    
    if (config) {
      const isLast = index === pathnames.length - 1
      breadcrumbItems.push({
        title: isLast ? (
          <span>
            {config.icon && <span style={{ marginRight: 4 }}>{config.icon}</span>}
            {config.title}
          </span>
        ) : (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate(currentPath)}>
            {config.icon && <span style={{ marginRight: 4 }}>{config.icon}</span>}
            {config.title}
          </span>
        ),
      })
    }
  })

  // 如果当前在首页，只显示首页
  if (location.pathname === '/') {
    return (
      <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
        <AntBreadcrumb
          style={{ fontSize: '14px', padding: '12px 0' }}
          items={[{ title: <span><HomeOutlined style={{ marginRight: 4 }} />首页</span> }]}
        />
      </div>
    )
  }

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
      <AntBreadcrumb
        style={{ fontSize: '14px', padding: '12px 0' }}
        items={breadcrumbItems}
      />
    </div>
  )
}

export default Breadcrumb