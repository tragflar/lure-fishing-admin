import React, { useState, useEffect } from 'react'
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SyncOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import Breadcrumb from '@/components/Breadcrumb'

const { Option } = Select
const { TextArea } = Input

// 用户数据类型定义
interface FishingUser {
  id: string
  openid: string
  nickname: string
  avatar_url: string
  gender: '男' | '女' | '未知'
  age?: number
  region: string
  phone?: string
  wechat_id?: string
  real_name?: string
  id_card?: string
  experience_level: '新手' | '老手' | '专家'
  user_status: '正常' | '冻结' | '注销'
  user_tags: string[]
  activity_score: number
  created_at: string
  updated_at: string
  last_login_at: string
  // 统计数据
  login_count: number
  spot_visit_count: number
  favorite_count: number
  share_count: number
  comment_count: number
}

// 模拟数据
const mockUsers: FishingUser[] = [
  {
    id: 'FU20241201001',
    openid: 'wx_openid_001',
    nickname: '钓鱼达人小王',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    gender: '男',
    age: 28,
    region: '浙江省杭州市',
    phone: '138****8888',
    wechat_id: 'fisher001',
    real_name: '王小明',
    experience_level: '专家',
    user_status: '正常',
    user_tags: ['活跃用户', '专家级'],
    activity_score: 95,
    created_at: '2024-01-15 10:30:00',
    updated_at: '2024-12-01 15:20:00',
    last_login_at: '2024-12-01 09:15:00',
    login_count: 156,
    spot_visit_count: 89,
    favorite_count: 45,
    share_count: 23,
    comment_count: 67
  },
  {
    id: 'FU20241201002',
    openid: 'wx_openid_002',
    nickname: '江边垂钓者',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    gender: '女',
    age: 35,
    region: '江苏省南京市',
    phone: '139****6666',
    wechat_id: 'laowang123',
    real_name: '李红',
    experience_level: '老手',
    user_status: '正常',
    user_tags: ['老手', '分享达人'],
    activity_score: 78,
    created_at: '2024-02-20 14:45:00',
    updated_at: '2024-11-30 18:30:00',
    last_login_at: '2024-11-30 20:45:00',
    login_count: 98,
    spot_visit_count: 56,
    favorite_count: 32,
    share_count: 18,
    comment_count: 41
  },
  {
    id: 'FU20241201003',
    openid: 'wx_openid_003',
    nickname: '新手小鱼',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    gender: '男',
    age: 22,
    region: '广东省深圳市',
    wechat_id: 'xiaoli2023',
    real_name: '张小鱼',
    experience_level: '新手',
    user_status: '冻结',
    user_tags: ['新手'],
    activity_score: 25,
    created_at: '2024-11-15 16:20:00',
    updated_at: '2024-11-28 10:15:00',
    last_login_at: '2024-11-25 14:30:00',
    login_count: 12,
    spot_visit_count: 8,
    favorite_count: 5,
    share_count: 1,
    comment_count: 3
  }
]

const FishingUserManagement: React.FC = () => {
  const [users, setUsers] = useState<FishingUser[]>(mockUsers)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<FishingUser | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 辅助函数（保留备用）

  // 表格列定义
  const columns: ColumnsType<FishingUser> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar_url} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.nickname}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
          </div>
        </Space>
      )
    },
    {
      title: '地理位置',
      dataIndex: 'region',
      key: 'region',
      width: 150,
      render: (region) => (
        <div>
          <EnvironmentOutlined /> {region}
        </div>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (time) => (
        <div style={{ fontSize: '12px' }}>
          {time ? new Date(time).toLocaleDateString() : '-'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="状态管理">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleStatusManagement(record)}
            />
          </Tooltip>
          <Tooltip title="同步数据">
            <Button 
              type="text" 
              icon={<SyncOutlined />} 
              onClick={() => handleSyncUser(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  // 查看用户详情
  const handleViewDetail = (user: FishingUser) => {
    setSelectedUser(user)
    setIsDetailDrawerOpen(true)
  }

  // 状态管理
  const handleStatusManagement = (user: FishingUser) => {
    setSelectedUser(user)
    form.setFieldsValue({
      user_status: user.user_status,
      reason: ''
    })
    setIsStatusModalOpen(true)
  }

  // 同步用户数据
  const handleSyncUser = async (user: FishingUser) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(`用户 ${user.nickname} 数据同步成功`)
    } catch (error) {
      message.error('数据同步失败')
    } finally {
      setLoading(false)
    }
  }

  // 批量同步所有用户数据
  const handleSyncAllUsers = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.success('所有用户数据同步成功')
    } catch (error) {
      message.error('批量同步失败')
    } finally {
      setLoading(false)
    }
  }

  // 提交状态变更
  const handleStatusSubmit = async (values: any) => {
    if (!selectedUser) return
    
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新本地数据
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, user_status: values.user_status }
          : user
      ))
      
      message.success('用户状态更新成功')
      setIsStatusModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('状态更新失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Breadcrumb />
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input.Search
              placeholder="搜索用户名"
              allowClear
              style={{ width: 200 }}
              onSearch={(value) => {
                // 搜索逻辑
                console.log('搜索:', value)
              }}
            />
            <Button 
              type="primary" 
              icon={<SyncOutlined />}
              loading={loading}
              onClick={handleSyncAllUsers}
            >
              同步小程序用户数据
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        width={600}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        styles={{
          body: { padding: '24px' }
        }}
      >
        {selectedUser && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 头像区域 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 24, 
              padding: '20px 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ marginRight: 20 }}>
                <Badge 
                  dot 
                  status="success" 
                  offset={[-8, 8]}
                  title="在线"
                >
                  <Avatar 
                    size={80} 
                    src={selectedUser.avatar_url} 
                    icon={<UserOutlined />}
                    style={{ border: '3px solid #f0f0f0' }}
                  />
                </Badge>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: 8,
                  color: '#262626'
                }}>
                  {selectedUser.nickname}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#8c8c8c', 
                  marginBottom: 8 
                }}>
                  ID: {selectedUser.id}
                </div>

                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  📱 最后登录: {selectedUser.last_login_at}
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* 基础信息卡片 */}
              <Card 
                title={<span><UserOutlined style={{ marginRight: 8 }} />基础信息</span>} 
                style={{ marginBottom: 16 }}
                size="small"
              >
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>👤</span>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>性别:</span>
                      <span>{selectedUser.gender}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>📍</span>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>地区:</span>
                      <span>{selectedUser.region}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>📅</span>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>注册时间:</span>
                      <span>{selectedUser.created_at}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>🕐</span>
                      <span style={{ color: '#8c8c8c', marginRight: 8 }}>最后登录:</span>
                      <span>{selectedUser.last_login_at}</span>
                    </div>
                  </Col>

                </Row>
              </Card>

              {/* 联系信息卡片 */}
              <Card 
                title={<span><PhoneOutlined style={{ marginRight: 8 }} />联系信息</span>} 
                style={{ marginBottom: 16 }}
                size="small"
              >
                <Row gutter={[16, 12]}>
                  <Col span={24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#8c8c8c', marginRight: 8 }}>📱</span>
                        <span style={{ color: '#8c8c8c', marginRight: 8 }}>手机号:</span>
                        <span>{selectedUser.phone || '未绑定'}</span>
                      </div>
                      {selectedUser.phone && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigator.clipboard.writeText(selectedUser.phone!)}
                        >
                          复制
                        </Button>
                      )}
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#8c8c8c', marginRight: 8 }}>💬</span>
                        <span style={{ color: '#8c8c8c', marginRight: 8 }}>微信号:</span>
                        <span>{selectedUser.wechat_id || '未绑定'}</span>
                      </div>
                      {selectedUser.wechat_id && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigator.clipboard.writeText(selectedUser.wechat_id!)}
                        >
                          复制
                        </Button>
                      )}
                    </div>
                  </Col>

                </Row>
              </Card>


            </div>


          </div>
        )}
      </Drawer>

      {/* 状态管理弹窗 */}
      <Modal
        title="用户状态管理"
        open={isStatusModalOpen}
        onCancel={() => {
          setIsStatusModalOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStatusSubmit}
        >
          <Form.Item
            label="用户状态"
            name="user_status"
            rules={[{ required: true, message: '请选择用户状态' }]}
          >
            <Select>
              <Option value="正常">正常</Option>
              <Option value="冻结">冻结</Option>
              <Option value="注销">注销</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="变更原因"
            name="reason"
            rules={[{ required: true, message: '请输入变更原因' }]}
          >
            <TextArea rows={4} placeholder="请输入状态变更的原因..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认变更
              </Button>
              <Button onClick={() => {
                setIsStatusModalOpen(false)
                form.resetFields()
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FishingUserManagement