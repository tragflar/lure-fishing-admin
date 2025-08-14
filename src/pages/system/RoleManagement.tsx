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
  message,
  Popconfirm,
  Row,
  Col,
  Checkbox,
  Divider
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Role {
  id: string
  roleName: string
  roleCode: string
  description: string
  userCount: number
  permissions: string[]
  status: 'active' | 'inactive'
  createTime: string
}

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 权限选项
  const permissionOptions = [
    { label: '用户管理', value: 'user:manage' },
    { label: '用户查看', value: 'user:view' },
    { label: '用户编辑', value: 'user:edit' },
    { label: '用户删除', value: 'user:delete' },
    { label: '角色管理', value: 'role:manage' },
    { label: '角色查看', value: 'role:view' },
    { label: '角色编辑', value: 'role:edit' },
    { label: '角色删除', value: 'role:delete' },
    { label: '权限管理', value: 'permission:manage' },
    { label: '权限查看', value: 'permission:view' },
    { label: '系统设置', value: 'system:setting' },
    { label: '数据导出', value: 'data:export' }
  ]

  // 模拟角色数据
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      roleName: '超级管理员',
      roleCode: 'super_admin',
      description: '拥有系统所有权限',
      userCount: 2,
      permissions: ['user:manage', 'user:view', 'user:edit', 'user:delete', 'role:manage', 'role:view', 'role:edit', 'role:delete', 'permission:manage', 'permission:view', 'system:setting', 'data:export'],
      status: 'active',
      createTime: '2024-01-10 10:00:00'
    },
    {
      id: '2',
      roleName: '管理员',
      roleCode: 'admin',
      description: '拥有用户和角色管理权限',
      userCount: 5,
      permissions: ['user:manage', 'user:view', 'user:edit', 'role:view', 'role:edit'],
      status: 'active',
      createTime: '2024-01-12 14:30:00'
    },
    {
      id: '3',
      roleName: '编辑员',
      roleCode: 'editor',
      description: '拥有内容编辑权限',
      userCount: 8,
      permissions: ['user:view', 'data:export'],
      status: 'active',
      createTime: '2024-01-15 09:20:00'
    },
    {
      id: '4',
      roleName: '普通用户',
      roleCode: 'user',
      description: '基础查看权限',
      userCount: 15,
      permissions: ['user:view'],
      status: 'active',
      createTime: '2024-01-16 16:45:00'
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

  const columns: ColumnsType<Role> = [
    {
      title: '角色信息',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 200,
      align: 'center',
      render: (text: string, record: Role) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <SafetyOutlined style={{ color: '#722ed1', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
            {record.roleCode}
          </Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      align: 'center'
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <Tag color="blue">{count}人</Tag>
      )
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 120,
      align: 'center',
      render: (permissions: string[]) => (
        <Tag color="purple">{permissions.length}项</Tag>
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
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: Role) => (
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
            title="确定要删除这个角色吗？"
            description="删除后该角色下的用户将失去相应权限"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.userCount > 0}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setModalVisible(true)
  }

  const handleViewDetail = (role: Role) => {
    setViewingRole(role)
    setDetailModalVisible(true)
  }

  const handleDelete = async (role: Role) => {
    setLoading(true)
    try {
      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRoles(roles.filter(r => r.id !== role.id))
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
      
      if (editingRole) {
        // 编辑角色
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values }
            : role
        ))
        message.success('编辑成功！')
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          userCount: 0,
          createTime: new Date().toLocaleString('zh-CN')
        }
        setRoles([...roles, newRole])
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

  const filteredRoles = roles.filter(role => 
    role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
    role.roleCode.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const getPermissionLabel = (value: string) => {
    const option = permissionOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div style={{ background: 'transparent' }}>
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索角色名称、角色代码或描述..."
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
              新增角色
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据列表区 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredRoles}
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
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="角色名称"
                rules={[
                  { required: true, message: '请输入角色名称' },
                  { min: 2, max: 20, message: '角色名称长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleCode"
                label="角色代码"
                rules={[
                  { required: true, message: '请输入角色代码' },
                  { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '角色代码只能包含字母、数字和下划线，且以字母或下划线开头' }
                ]}
              >
                <Input placeholder="请输入角色代码" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea
              placeholder="请输入角色描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="active"
          >
            <Checkbox.Group>
              <Checkbox value="active">启用</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限配置"
            rules={[{ required: true, message: '请选择至少一个权限' }]}
          >
            <Checkbox.Group>
              <Row gutter={[16, 8]}>
                {permissionOptions.map(option => (
                  <Col span={8} key={option.value}>
                    <Checkbox value={option.value}>
                      {option.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false)
                form.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRole ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="角色详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {viewingRole && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}><strong>角色名称:</strong></Col>
              <Col span={16}>{viewingRole.roleName}</Col>
              <Col span={8}><strong>角色代码:</strong></Col>
              <Col span={16}><Tag>{viewingRole.roleCode}</Tag></Col>
              <Col span={8}><strong>角色描述:</strong></Col>
              <Col span={16}>{viewingRole.description}</Col>
              <Col span={8}><strong>用户数量:</strong></Col>
              <Col span={16}><Tag color="blue">{viewingRole.userCount}人</Tag></Col>
              <Col span={8}><strong>状态:</strong></Col>
              <Col span={16}>{getStatusTag(viewingRole.status)}</Col>
              <Col span={8}><strong>创建时间:</strong></Col>
              <Col span={16}>{viewingRole.createTime}</Col>
            </Row>
            <Divider>权限列表</Divider>
            <div>
              {viewingRole.permissions.map(permission => (
                <Tag key={permission} color="purple" style={{ margin: '4px' }}>
                  {getPermissionLabel(permission)}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RoleManagement