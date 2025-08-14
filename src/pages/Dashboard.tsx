import React from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Avatar,
  Tag,
  Timeline,
  Alert
} from 'antd'
import {
  EnvironmentOutlined,
  BugOutlined,
  UserOutlined,
  EyeOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined
} from '@ant-design/icons'

// 模拟数据
const mockData = {
  statistics: {
    totalSpots: 156,
    totalSpecies: 45,
    totalUsers: 1234,
    todayVisits: 2456,
    monthlyGrowth: 12.5
  },
  recentSpots: [
    {
      id: '1',
      name: '西湖断桥野钓点',
      submitter: '钓鱼爱好者小王',
      avatar: 'https://via.placeholder.com/32x32?text=王',
      status: 'pending',
      time: '2小时前'
    },
    {
      id: '2',
      name: '钱塘江野钓区',
      submitter: '老钓手李师傅',
      avatar: 'https://via.placeholder.com/32x32?text=李',
      status: 'approved',
      time: '5小时前'
    },
    {
      id: '3',
      name: '千岛湖深水区',
      submitter: '钓鱼达人张三',
      avatar: 'https://via.placeholder.com/32x32?text=张',
      status: 'approved',
      time: '1天前'
    }
  ],
  hotSpots: [
    { name: '西湖断桥', visits: 1234, rating: 4.8 },
    { name: '钱塘江边', visits: 987, rating: 4.6 },
    { name: '千岛湖', visits: 856, rating: 4.9 },
    { name: '东钱湖', visits: 743, rating: 4.5 }
  ],
  recentActivities: [
    {
      type: 'spot_added',
      content: '新增钓点"西湖断桥野钓点"',
      time: '2024-12-01 14:30',
      user: '钓鱼爱好者小王'
    },

    {
      type: 'species_added',
      content: '新增鱼种"黑鱼"',
      time: '2024-12-01 09:15',
      user: '管理员李四'
    },
    {
      type: 'user_registered',
      content: '新用户"钓鱼新手小刘"注册',
      time: '2024-12-01 08:45',
      user: '系统'
    }
  ]
}

const Dashboard: React.FC = () => {
  const { statistics, recentSpots, hotSpots, recentActivities } = mockData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange'
      case 'approved': return 'green'
      case 'rejected': return 'red'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待审核'
      case 'approved': return '已通过'
      case 'rejected': return '已拒绝'
      default: return '未知'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'spot_added': return <EnvironmentOutlined style={{ color: '#1890ff' }} />
      case 'review_approved': return <CheckOutlined style={{ color: '#52c41a' }} />
      case 'species_added': return <BugOutlined style={{ color: '#722ed1' }} />
      case 'user_registered': return <UserOutlined style={{ color: '#fa8c16' }} />
      default: return <ClockCircleOutlined />
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 欢迎信息 */}
      <Alert
        message="欢迎使用钓鱼佬后端管理系统"
        description="这里是您管理钓点信息、鱼种数据和用户审核的中心控制台。让我们一起为钓友们打造更好的钓鱼体验！"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="钓点总数"
              value={statistics.totalSpots}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={75} size="small" showInfo={false} />
              <span style={{ fontSize: 12, color: '#666' }}>目标: 200个</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="鱼种数量"
              value={statistics.totalSpecies}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="种"
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={90} size="small" showInfo={false} strokeColor="#52c41a" />
              <span style={{ fontSize: 12, color: '#666' }}>目标: 50种</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="注册用户"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="人"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, color: '#52c41a' }}>📈 本月增长 {statistics.monthlyGrowth}%</span>
            </div>
          </Card>
        </Col>

      </Row>

      <Row gutter={16}>
        {/* 最新钓点提交 */}
        <Col span={12}>
          <Card title="最新钓点提交" extra={<a href="#/fishing/spots">查看全部</a>}>
            <List
              itemLayout="horizontal"
              dataSource={recentSpots}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag color={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Tag>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} icon={<UserOutlined />} />}
                    title={<a href={`#/fishing/spots`}>{item.name}</a>}
                    description={`${item.submitter} · ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 热门钓点排行 */}
        <Col span={12}>
          <Card title="热门钓点排行" extra={<a href="#/fishing/spots">查看全部</a>}>
            <List
              itemLayout="horizontal"
              dataSource={hotSpots}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        background: index < 3 ? '#faad14' : '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}>
                        {index < 3 ? <TrophyOutlined /> : index + 1}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name}</span>
                        <div>
                          <span style={{ color: '#faad14', marginRight: 8 }}>⭐ {item.rating}</span>
                          <span style={{ color: '#666', fontSize: 12 }}>
                            <EyeOutlined style={{ marginRight: 4 }} />
                            {item.visits}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="最近活动" extra={<a href="#">查看全部</a>}>
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  dot={getActivityIcon(activity.type)}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{activity.content}</div>
                    <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                      {activity.user} · {activity.time}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="快捷操作">
            <Row gutter={16}>
              <Col span={8}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.hash = '#/fishing/spots'}
                >
                  <EnvironmentOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>管理钓点</div>
                  <div style={{ color: '#666', fontSize: 12 }}>添加、编辑钓点信息</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.hash = '#/fishing/species'}
                >
                  <BugOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>管理鱼种</div>
                  <div style={{ color: '#666', fontSize: 12 }}>维护鱼种数据库</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.hash = '#/system/users'}
                >
                  <UserOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 8 }} />
                  <div style={{ fontWeight: 'bold' }}>用户管理</div>
                  <div style={{ color: '#666', fontSize: 12 }}>管理系统用户</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard