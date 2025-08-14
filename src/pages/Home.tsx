import React from 'react'
import { Card, Row, Col, Statistic, List, Avatar, Tag, Space } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  KeyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined
} from '@ant-design/icons'

const Home: React.FC = () => {
  // 模拟数据
  const stats = [
    {
      title: '总用户数',
      value: 1234,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '人'
    },
    {
      title: '在线用户',
      value: 89,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      suffix: '人'
    },
    {
      title: '系统角色',
      value: 8,
      precision: 0,
      valueStyle: { color: '#722ed1' },
      suffix: '个'
    },
    {
      title: '权限数量',
      value: 156,
      precision: 0,
      valueStyle: { color: '#fa8c16' },
      suffix: '项'
    }
  ]

  const quickActions = [
    {
      title: '用户管理',
      description: '管理系统用户',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/system/users'
    },
    {
      title: '角色管理',
      description: '配置用户角色',
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/system/roles'
    },
    {
      title: '权限管理',
      description: '设置系统权限',
      icon: <KeyOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      path: '/system/permissions'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      user: '张三',
      action: '登录系统',
      type: 'login',
      time: '2024-01-20 10:30:00'
    },
    {
      id: 2,
      user: '李四',
      action: '编辑用户信息',
      type: 'edit',
      time: '2024-01-20 10:25:00'
    },
    {
      id: 3,
      user: '王五',
      action: '新增角色',
      type: 'add',
      time: '2024-01-20 10:20:00'
    },
    {
      id: 4,
      user: '赵六',
      action: '删除权限',
      type: 'delete',
      time: '2024-01-20 10:15:00'
    },
    {
      id: 5,
      user: '钱七',
      action: '登录系统',
      type: 'login',
      time: '2024-01-20 10:10:00'
    }
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LoginOutlined style={{ color: '#1890ff' }} />
      case 'edit':
        return <EditOutlined style={{ color: '#fa8c16' }} />
      case 'add':
        return <PlusOutlined style={{ color: '#52c41a' }} />
      case 'delete':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />
      default:
        return <UserOutlined />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'blue'
      case 'edit':
        return 'orange'
      case 'add':
        return 'green'
      case 'delete':
        return 'red'
      default:
        return 'default'
    }
  }

  const systemStatus = [
    {
      title: 'CPU使用率',
      value: 45,
      unit: '%',
      status: 'normal'
    },
    {
      title: '内存使用率',
      value: 68,
      unit: '%',
      status: 'warning'
    },
    {
      title: '磁盘使用率',
      value: 32,
      unit: '%',
      status: 'normal'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#52c41a'
      case 'warning':
        return '#fa8c16'
      case 'error':
        return '#ff4d4f'
      default:
        return '#1890ff'
    }
  }

  return (
    <div style={{ background: 'transparent' }}>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, color: '#262626' }}>欢迎回来！</h2>
            <p style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
              今天是 {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}，系统运行正常
            </p>
          </Col>
          <Col>
            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
              系统正常
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* 数据统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 功能区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {/* 快捷操作 */}
        <Col xs={24} lg={12}>
          <Card title="快捷操作" style={{ height: '100%' }}>
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col span={24} key={index}>
                  <Card
                    size="small"
                    hoverable
                    style={{
                      cursor: 'pointer',
                      border: '1px solid #f0f0f0'
                    }}
                    onClick={() => {
                      // 这里可以添加路由跳转逻辑
                      console.log('Navigate to:', action.path)
                    }}
                  >
                    <Space>
                      {action.icon}
                      <div>
                        <div style={{ fontWeight: 500 }}>{action.title}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                          {action.description}
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card title="最近活动" style={{ height: '100%' }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <span>{item.user}</span>
                        <Tag
                          color={getActionColor(item.type)}
                          icon={getActionIcon(item.type)}
                          style={{ margin: 0 }}
                        >
                          {item.action}
                        </Tag>
                      </Space>
                    }
                    description={
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        {item.time}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Row gutter={[16, 16]}>
        {systemStatus.map((status, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card>
              <Statistic
                title={status.title}
                value={status.value}
                suffix={status.unit}
                valueStyle={{ color: getStatusColor(status.status) }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home