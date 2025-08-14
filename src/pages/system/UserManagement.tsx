import React, { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface User {
  id: string
  userId: string
  userName: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
  lastLogin: string
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 模拟用户数据
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      userId: 'U001',
      userName: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
      createTime: '2024-01-15 10:30:00',
      lastLogin: '2024-01-20 09:15:00'
    },
    {
      id: '2',
      userId: 'U002',
      userName: '李四',
      email: 'lisi@example.com',
      role: '普通用户',
      status: 'active',
      createTime: '2024-01-16 14:20:00',
      lastLogin: '2024-01-19 16:30:00'
    },
    {
      id: '3',
      userId: 'U003',
      userName: '王五',
      email: 'wangwu@example.com',
      role: '编辑员',
      status: 'inactive',
      createTime: '2024-01-17 09:45:00',
      lastLogin: '2024-01-18 11:20:00'
    },
    {
      id: '4',
      userId: 'U004',
      userName: '赵六',
      email: 'zhaoliu@example.com',
      role: '普通用户',
      status: 'active',
      createTime: '2024-01-18 16:10:00',
      lastLogin: '2024-01-20 08:45:00'
    }
  ])

  const getStatusTag = (status: string) => {
    const statusMap = {
      'active': { color: 'success', text: '启用' },
      'inactive': { color: 'error', text: '禁用' }
    }
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      align: 'center',
      render: (text: string, record: User) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
            {record.userId}
          </Tag>
        </Space>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      align: 'center'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      align: 'center',
      render: (role: string) => (
        <Tag color="blue">{role}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      align: 'center',
      sorter: true
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 160,
      align: 'center',
      sorter: true
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: User) => (
        <Space size={8}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalVisible(true)
  }

  const handleViewDetail = (user: User) => {
    setViewingUser(user)
    setDetailModalVisible(true)
  }

  const handleDelete = async (user: User) => {
    setLoading(true)
    try {
      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(users.filter(u => u.id !== user.id))
      message.success('删除成功！')
    } catch (error) {
      message.error('删除失败！')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // 模拟提交请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ))
        message.success('编辑成功！')
      } else {
        // 新增用户
        const newUser: User = {
          id: Date.now().toString(),
          userId: `U${String(users.length + 1).padStart(3, '0')}`,
          ...values,
          createTime: new Date().toLocaleString('zh-CN'),
          lastLogin: '-'
        }
        setUsers([...users, newUser])
        message.success('新增成功！')
      }
      
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败！')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.userName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div style={{ background: 'transparent' }}>
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索用户名、邮箱或用户ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增用户
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据列表区 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userName"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 2, max: 20, message: '用户名长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Select.Option value="管理员">管理员</Select.Option>
                  <Select.Option value="编辑员">编辑员</Select.Option>
                  <Select.Option value="普通用户">普通用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Select.Option value="active">启用</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false)
                form.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="用户详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {viewingUser && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}><strong>用户ID:</strong></Col>
              <Col span={16}>{viewingUser.userId}</Col>
              <Col span={8}><strong>用户名:</strong></Col>
              <Col span={16}>{viewingUser.userName}</Col>
              <Col span={8}><strong>邮箱:</strong></Col>
              <Col span={16}>{viewingUser.email}</Col>
              <Col span={8}><strong>角色:</strong></Col>
              <Col span={16}><Tag color="blue">{viewingUser.role}</Tag></Col>
              <Col span={8}><strong>状态:</strong></Col>
              <Col span={16}>{getStatusTag(viewingUser.status)}</Col>
              <Col span={8}><strong>创建时间:</strong></Col>
              <Col span={16}>{viewingUser.createTime}</Col>
              <Col span={8}><strong>最后登录:</strong></Col>
              <Col span={16}>{viewingUser.lastLogin}</Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UserManagement