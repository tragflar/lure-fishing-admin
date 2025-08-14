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
  Col,
  Tree
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  KeyOutlined,
  MenuOutlined,
  ApiOutlined,
  ControlOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'

interface Permission {
  id: string
  permissionName: string
  permissionCode: string
  permissionType: 'menu' | 'button' | 'api'
  parentId: string | null
  description: string
  status: 'active' | 'inactive'
  createTime: string
  children?: Permission[]
}

const PermissionManagement: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [viewingPermission, setViewingPermission] = useState<Permission | null>(null)
  const [searchText, setSearchText] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')
  const [form] = Form.useForm()

  // 模拟权限数据
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: '1',
      permissionName: '系统管理',
      permissionCode: 'system',
      permissionType: 'menu',
      parentId: null,
      description: '系统管理模块',
      status: 'active',
      createTime: '2024-01-10 10:00:00'
    },
    {
      id: '2',
      permissionName: '用户管理',
      permissionCode: 'system:user',
      permissionType: 'menu',
      parentId: '1',
      description: '用户管理页面',
      status: 'active',
      createTime: '2024-01-10 10:05:00'
    },
    {
      id: '3',
      permissionName: '用户查看',
      permissionCode: 'system:user:view',
      permissionType: 'button',
      parentId: '2',
      description: '查看用户信息',
      status: 'active',
      createTime: '2024-01-10 10:10:00'
    },
    {
      id: '4',
      permissionName: '用户编辑',
      permissionCode: 'system:user:edit',
      permissionType: 'button',
      parentId: '2',
      description: '编辑用户信息',
      status: 'active',
      createTime: '2024-01-10 10:15:00'
    },
    {
      id: '5',
      permissionName: '用户删除',
      permissionCode: 'system:user:delete',
      permissionType: 'button',
      parentId: '2',
      description: '删除用户',
      status: 'active',
      createTime: '2024-01-10 10:20:00'
    },
    {
      id: '6',
      permissionName: '用户API',
      permissionCode: 'api:user',
      permissionType: 'api',
      parentId: '2',
      description: '用户相关API接口',
      status: 'active',
      createTime: '2024-01-10 10:25:00'
    },
    {
      id: '7',
      permissionName: '角色管理',
      permissionCode: 'system:role',
      permissionType: 'menu',
      parentId: '1',
      description: '角色管理页面',
      status: 'active',
      createTime: '2024-01-10 10:30:00'
    },
    {
      id: '8',
      permissionName: '角色查看',
      permissionCode: 'system:role:view',
      permissionType: 'button',
      parentId: '7',
      description: '查看角色信息',
      status: 'active',
      createTime: '2024-01-10 10:35:00'
    },
    {
      id: '9',
      permissionName: '角色编辑',
      permissionCode: 'system:role:edit',
      permissionType: 'button',
      parentId: '7',
      description: '编辑角色信息',
      status: 'active',
      createTime: '2024-01-10 10:40:00'
    },
    {
      id: '10',
      permissionName: '数据导出',
      permissionCode: 'data:export',
      permissionType: 'api',
      parentId: null,
      description: '数据导出功能',
      status: 'active',
      createTime: '2024-01-10 10:45:00'
    }
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'menu':
        return <MenuOutlined style={{ color: '#1890ff' }} />
      case 'button':
        return <ControlOutlined style={{ color: '#52c41a' }} />
      case 'api':
        return <ApiOutlined style={{ color: '#fa8c16' }} />
      default:
        return <KeyOutlined />
    }
  }

  const getTypeTag = (type: string) => {
    const typeMap = {
      'menu': { color: 'blue', text: '菜单' },
      'button': { color: 'green', text: '按钮' },
      'api': { color: 'orange', text: 'API' }
    }
    const config = typeMap[type as keyof typeof typeMap] || { color: 'default', text: '未知' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const statusMap = {
      'active': { color: 'success', text: '启用' },
      'inactive': { color: 'error', text: '禁用' }
    }
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns: ColumnsType<Permission> = [
    {
      title: '权限信息',
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: 200,
      align: 'center',
      render: (text: string, record: Permission) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          {getTypeIcon(record.permissionType)}
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '权限代码',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
      width: 180,
      align: 'center',
      render: (code: string) => (
        <Tag style={{ fontFamily: 'monospace' }}>{code}</Tag>
      )
    },
    {
      title: '权限类型',
      dataIndex: 'permissionType',
      key: 'permissionType',
      width: 100,
      align: 'center',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: '父级权限',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 150,
      align: 'center',
      render: (parentId: string | null) => {
        if (!parentId) return <Tag color="purple">根权限</Tag>
        const parent = permissions.find(p => p.id === parentId)
        return parent ? <Tag>{parent.permissionName}</Tag> : <Tag color="red">未找到</Tag>
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      align: 'center'
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
      render: (_: any, record: Permission) => (
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
            title="确定要删除这个权限吗？"
            description="删除后相关角色将失去此权限"
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

  // 构建树形数据
  const buildTreeData = (permissions: Permission[]): DataNode[] => {
    const convertToTreeNode = (node: Permission, children: Permission[] = []): DataNode => ({
      key: node.id,
      title: (
        <Space>
          {getTypeIcon(node.permissionType)}
          <span>{node.permissionName}</span>
          {getTypeTag(node.permissionType)}
          {getStatusTag(node.status)}
        </Space>
      ),
      children: children.length > 0 ? children.map(child => {
        const grandChildren = permissions.filter(p => p.parentId === child.id)
        return convertToTreeNode(child, grandChildren)
      }) : undefined
    })

    const roots = permissions.filter(p => !p.parentId)
    
    return roots.map(root => {
      const children = permissions.filter(p => p.parentId === root.id)
      return convertToTreeNode(root, children)
    })
  }

  const handleAdd = () => {
    setEditingPermission(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    form.setFieldsValue(permission)
    setModalVisible(true)
  }

  const handleViewDetail = (permission: Permission) => {
    setViewingPermission(permission)
    setDetailModalVisible(true)
  }

  const handleDelete = async (permission: Permission) => {
    setLoading(true)
    try {
      // 检查是否有子权限
      const hasChildren = permissions.some(p => p.parentId === permission.id)
      if (hasChildren) {
        message.error('该权限下还有子权限，请先删除子权限！')
        return
      }

      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPermissions(permissions.filter(p => p.id !== permission.id))
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
      
      if (editingPermission) {
        // 编辑权限
        setPermissions(permissions.map(permission => 
          permission.id === editingPermission.id 
            ? { ...permission, ...values }
            : permission
        ))
        message.success('编辑成功！')
      } else {
        // 新增权限
        const newPermission: Permission = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString('zh-CN')
        }
        setPermissions([...permissions, newPermission])
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

  const filteredPermissions = permissions.filter(permission => 
    permission.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.permissionCode.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const parentOptions = permissions
    .filter(p => p.permissionType === 'menu')
    .map(p => ({ label: p.permissionName, value: p.id }))

  return (
    <div style={{ background: 'transparent' }}>
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <Input.Search
                placeholder="搜索权限名称、权限代码或描述..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                value={viewMode}
                onChange={setViewMode}
                style={{ width: 120 }}
              >
                <Select.Option value="table">表格视图</Select.Option>
                <Select.Option value="tree">树形视图</Select.Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增权限
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据展示区 */}
      <Card>
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={filteredPermissions}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
            }}
            scroll={{ x: 'max-content' }}
          />
        ) : (
          <Tree
            treeData={buildTreeData(filteredPermissions)}
            defaultExpandAll
            showLine
            showIcon={false}
            style={{ background: '#fafafa', padding: '16px', borderRadius: '6px' }}
          />
        )}
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新增权限'}
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
                name="permissionName"
                label="权限名称"
                rules={[
                  { required: true, message: '请输入权限名称' },
                  { min: 2, max: 20, message: '权限名称长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissionCode"
                label="权限代码"
                rules={[
                  { required: true, message: '请输入权限代码' },
                  { pattern: /^[a-zA-Z][a-zA-Z0-9:_]*$/, message: '权限代码只能包含字母、数字、冒号和下划线，且以字母开头' }
                ]}
              >
                <Input placeholder="请输入权限代码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionType"
                label="权限类型"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型">
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                  <Select.Option value="api">API</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="父级权限"
              >
                <Select placeholder="请选择父级权限（可选）" allowClear>
                  {parentOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="权限描述"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <Input.TextArea
              placeholder="请输入权限描述"
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
            <Select placeholder="请选择状态">
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
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
                {editingPermission ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="权限详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {viewingPermission && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}><strong>权限名称:</strong></Col>
              <Col span={16}>{viewingPermission.permissionName}</Col>
              <Col span={8}><strong>权限代码:</strong></Col>
              <Col span={16}>
                <Tag style={{ fontFamily: 'monospace' }}>
                  {viewingPermission.permissionCode}
                </Tag>
              </Col>
              <Col span={8}><strong>权限类型:</strong></Col>
              <Col span={16}>{getTypeTag(viewingPermission.permissionType)}</Col>
              <Col span={8}><strong>父级权限:</strong></Col>
              <Col span={16}>
                {viewingPermission.parentId ? (
                  (() => {
                    const parent = permissions.find(p => p.id === viewingPermission.parentId)
                    return parent ? <Tag>{parent.permissionName}</Tag> : <Tag color="red">未找到</Tag>
                  })()
                ) : (
                  <Tag color="purple">根权限</Tag>
                )}
              </Col>
              <Col span={8}><strong>权限描述:</strong></Col>
              <Col span={16}>{viewingPermission.description}</Col>
              <Col span={8}><strong>状态:</strong></Col>
              <Col span={16}>{getStatusTag(viewingPermission.status)}</Col>
              <Col span={8}><strong>创建时间:</strong></Col>
              <Col span={16}>{viewingPermission.createTime}</Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PermissionManagement