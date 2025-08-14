import React from 'react'
import { Card, Row, Col, Statistic, Button, Space } from 'antd'
import {
  UserOutlined,
  SafetyOutlined,
  KeyOutlined,
  SettingOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SystemManagement: React.FC = () => {
  const navigate = useNavigate()

  const systemStats = [
    {
      title: '用户总数',
      value: 1234,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/system/users'
    },
    {
      title: '角色数量',
      value: 8,
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/system/roles'
    },
    {
      title: '权限数量',
      value: 156,
      icon: <KeyOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      path: '/system/permissions'
    }
  ]

  const quickActions = [
    {
      title: '用户管理',
      description: '管理系统用户，包括用户的增删改查、状态管理等功能',
      icon: <UserOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      path: '/system/users',
      color: '#1890ff'
    },
    {
      title: '角色管理',
      description: '配置用户角色，设置角色权限，管理角色与用户的关联关系',
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      path: '/system/roles',
      color: '#722ed1'
    },
    {
      title: '权限管理',
      description: '设置系统权限，管理菜单、按钮、API等各类权限配置',
      icon: <KeyOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      path: '/system/permissions',
      color: '#fa8c16'
    }
  ]

  return (
    <div style={{ background: 'transparent' }}>
      {/* 系统管理概览 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row align="middle">
          <Col flex="auto">
            <Space align="center">
              <SettingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <div>
                <h2 style={{ margin: 0, color: '#262626' }}>系统管理</h2>
                <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
                  管理系统用户、角色和权限，确保系统安全稳定运行
                </p>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {systemStats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card
              hoverable
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(stat.path)}
            >
              <Row align="middle">
                <Col flex="auto">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ color: '#262626' }}
                  />
                </Col>
                <Col>
                  {stat.icon}
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷操作 */}
      <Row gutter={[16, 16]}>
        {quickActions.map((action, index) => (
          <Col xs={24} lg={8} key={index}>
            <Card
              hoverable
              style={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: `1px solid ${action.color}20`,
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px'
              }}
              onClick={() => navigate(action.path)}
            >
              <div>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  {action.icon}
                </div>
                <h3 style={{ 
                  textAlign: 'center', 
                  margin: '0 0 12px 0', 
                  color: action.color,
                  fontSize: '18px'
                }}>
                  {action.title}
                </h3>
                <p style={{ 
                  color: '#8c8c8c', 
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {action.description}
                </p>
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  style={{ backgroundColor: action.color, borderColor: action.color }}
                >
                  进入管理
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default SystemManagement