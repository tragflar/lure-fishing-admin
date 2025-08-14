import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Rate,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
  Divider,
  Tabs,
  Alert
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  AimOutlined,
  EditFilled
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

// 钓点数据类型
interface FishingSpot {
  id: string
  name: string
  longitude: number
  latitude: number
  waterDepth?: number
  description: string
  fishingGuide?: string
  status: 'open' | 'closed' | 'maintenance'
  coverImageUrl?: string
  rating: number
  fishSpecies: string[]
  createdAt: string
  updatedAt: string
}

// 鱼种数据类型
interface FishSpecies {
  id: string
  name: string
  category: 'freshwater' | 'saltwater' | 'migratory'
}

// 模拟数据
const mockFishingSpots: FishingSpot[] = [
  {
    id: 'FP20241201001',
    name: '西湖断桥野钓点',
    longitude: 120.1234567,
    latitude: 30.2345678,
    waterDepth: 3.5,
    description: '环境优美，水质清澈，适合休闲垂钓',
    fishingGuide: '最佳钓位在桥下阴凉处，推荐使用蚯蚓饵料，早晨和傍晚鱼口较好',
    status: 'open',
    coverImageUrl: 'https://via.placeholder.com/150x100?text=西湖断桥',
    rating: 4.5,
    fishSpecies: ['鲤鱼', '草鱼', '鲫鱼'],
    createdAt: '2024-12-01 10:30:00',
    updatedAt: '2024-12-01 15:20:00'
  },
  {
    id: 'FP20241201002',
    name: '钱塘江野钓区',
    longitude: 120.2345678,
    latitude: 30.1234567,
    waterDepth: 8.0,
    description: '江水流动，鱼类丰富，适合有经验的钓友',
    fishingGuide: '建议使用重铅钓法，饵料以玉米、面包虫为主',
    status: 'open',
    coverImageUrl: 'https://via.placeholder.com/150x100?text=钱塘江',
    rating: 4.2,
    fishSpecies: ['鲈鱼', '黄颡鱼', '鲤鱼'],
    createdAt: '2024-12-01 09:15:00',
    updatedAt: '2024-12-01 14:30:00'
  }
]

const mockFishSpecies: FishSpecies[] = [
  { id: '1', name: '鲤鱼', category: 'freshwater' },
  { id: '2', name: '草鱼', category: 'freshwater' },
  { id: '3', name: '鲫鱼', category: 'freshwater' },
  { id: '4', name: '鲈鱼', category: 'freshwater' },
  { id: '5', name: '黄颡鱼', category: 'freshwater' }
]

const FishingSpotManagement: React.FC = () => {
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>(mockFishingSpots)
  const [fishSpecies] = useState<FishSpecies[]>(mockFishSpecies)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSpot, setEditingSpot] = useState<FishingSpot | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [activeTab, setActiveTab] = useState('map')
  const [mapCoordinates, setMapCoordinates] = useState<{longitude: number, latitude: number} | null>(null)
  const [mapClickEnabled, setMapClickEnabled] = useState(true)

  // 状态标签颜色映射
  const statusColors = {
    open: 'green',
    closed: 'red',
    maintenance: 'orange'
  }

  // 状态文本映射
  const statusTexts = {
    open: '正常开放',
    closed: '临时关闭',
    maintenance: '维护中'
  }

  // 表格列配置
  const columns: ColumnsType<FishingSpot> = [
    {
      title: '封面图片',
      dataIndex: 'coverImageUrl',
      key: 'coverImageUrl',
      width: 100,
      render: (url: string) => (
        <Image
          width={60}
          height={40}
          src={url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    },
    {
      title: '钓点名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: FishingSpot) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
          <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>({record.rating})</span>
        </div>
      )
    },

    {
      title: '鱼种',
      dataIndex: 'fishSpecies',
      key: 'fishSpecies',
      width: 150,
      render: (species: string[]) => (
        <div>
          {species.slice(0, 3).map(fish => (
            <Tag key={fish} color="blue" style={{ marginBottom: 2 }}>
              🐟 {fish}
            </Tag>
          ))}
          {species.length > 3 && <Tag color="default">+{species.length - 3}</Tag>}
        </div>
      )
    },
    {
      title: '水深',
      dataIndex: 'waterDepth',
      key: 'waterDepth',
      width: 80,
      render: (depth?: number) => (
        <span>
          💧 {depth ? `${depth}米` : '未知'}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>
          {statusTexts[status]}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (text: string) => (
        <span style={{ fontSize: 12 }}>📅 {text.split(' ')[0]}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: FishingSpot) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
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
            title="确定要删除这个钓点吗？"
            onConfirm={() => handleDelete(record.id)}
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

  // 处理查看钓点
  const handleView = (spot: FishingSpot) => {
    Modal.info({
      title: spot.name,
      width: 600,
      content: (
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Image
                width="100%"
                src={spot.coverImageUrl}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </Col>
            <Col span={16}>

              <p><strong>坐标：</strong>{spot.longitude}, {spot.latitude}</p>
              <p><strong>水深：</strong>{spot.waterDepth ? `${spot.waterDepth}米` : '未知'}</p>
              <p><strong>状态：</strong><Tag color={statusColors[spot.status]}>{statusTexts[spot.status]}</Tag></p>
              <p><strong>评分：</strong><Rate disabled defaultValue={spot.rating} /> ({spot.rating})</p>
              <p><strong>鱼种：</strong>
                {spot.fishSpecies.map(fish => (
                  <Tag key={fish} color="blue" style={{ margin: 2 }}>🐟 {fish}</Tag>
                ))}
              </p>
            </Col>
          </Row>
          <Divider />
          <p><strong>钓点描述：</strong></p>
          <p>{spot.description}</p>
          {spot.fishingGuide && (
            <>
              <p><strong>钓点攻略：</strong></p>
              <p>{spot.fishingGuide}</p>
            </>
          )}
        </div>
      )
    })
  }

  // 处理编辑钓点
  const handleEdit = (spot: FishingSpot) => {
    setEditingSpot(spot)
    form.setFieldsValue({
      ...spot,
      fishSpecies: spot.fishSpecies
    })
    setActiveTab('map')
    setMapCoordinates({ longitude: spot.longitude, latitude: spot.latitude })
    setMapClickEnabled(true)
    setModalVisible(true)
  }

  // 处理删除钓点
  const handleDelete = (id: string) => {
    setFishingSpots(prev => prev.filter(spot => spot.id !== id))
    message.success('钓点删除成功')
  }

  // 处理新增钓点
  const handleAdd = () => {
    setEditingSpot(null)
    form.resetFields()
    setFileList([])
    setActiveTab('map')
    setMapCoordinates(null)
    setMapClickEnabled(true)
    setModalVisible(true)
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const newSpot: FishingSpot = {
        id: editingSpot?.id || `FP${Date.now()}`,
        ...values,
        rating: editingSpot?.rating || 0,
        coverImageUrl: fileList[0]?.url || editingSpot?.coverImageUrl || 'https://via.placeholder.com/150x100?text=钓点',
        createdAt: editingSpot?.createdAt || new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }

      if (editingSpot) {
        setFishingSpots(prev => prev.map(spot => spot.id === editingSpot.id ? newSpot : spot))
        message.success('钓点更新成功')
      } else {
        setFishingSpots(prev => [newSpot, ...prev])
        message.success('钓点创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      setFileList([])
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 图片上传处理
  const handleUpload = {
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG/WEBP 格式的图片!')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!')
        return false
      }
      return false // 阻止自动上传
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1)) // 只保留最后一个文件
    }
  }

  // 处理地图点击
  const handleMapClick = (lng: number, lat: number) => {
    if (mapClickEnabled) {
      setMapCoordinates({ longitude: lng, latitude: lat })
      form.setFieldsValue({
        longitude: lng,
        latitude: lat
      })
      message.success(`已选择坐标：${lng.toFixed(6)}, ${lat.toFixed(6)}`)
    }
  }

  // 启用/禁用地图点击
  const toggleMapClick = () => {
    setMapClickEnabled(!mapClickEnabled)
    if (!mapClickEnabled) {
      message.info('请在地图上点击选择位置')
    }
  }

  // 使用地图坐标
  const useMapCoordinates = () => {
    if (mapCoordinates) {
      form.setFieldsValue({
        longitude: mapCoordinates.longitude,
        latitude: mapCoordinates.latitude
      })
      setActiveTab('manual')
      message.success('已应用地图选择的坐标')
    }
  }

  // 模拟地图组件
  const MapSelector: React.FC = () => {
    const [mapCenter, setMapCenter] = useState({ lng: 120.1234567, lat: 30.2345678 })
    
    return (
      <div style={{ height: 400, border: '1px solid #d9d9d9', borderRadius: 6, position: 'relative', background: '#f0f2f5' }}>
        {/* 地图头部工具栏 */}
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          right: 10, 
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          padding: '8px 12px',
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: 12, color: '#666' }}>
            🗺️ 地图选点模式 {mapClickEnabled ? '(已启用)' : '(已禁用)'}
          </div>
          <Space size="small">
            <Button 
              size="small" 
              type={mapClickEnabled ? 'primary' : 'default'}
              icon={<AimOutlined />}
              onClick={toggleMapClick}
            >
              {mapClickEnabled ? '禁用选点' : '启用选点'}
            </Button>
            {mapCoordinates && (
              <Button 
                size="small" 
                type="primary"
                icon={<EditFilled />}
                onClick={useMapCoordinates}
              >
                使用此坐标
              </Button>
            )}
          </Space>
        </div>

        {/* 模拟地图区域 */}
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(45deg, #e6f7ff 25%, transparent 25%), linear-gradient(-45deg, #e6f7ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e6f7ff 75%), linear-gradient(-45deg, transparent 75%, #e6f7ff 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            cursor: mapClickEnabled ? 'crosshair' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={(e) => {
            if (mapClickEnabled) {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              // 模拟坐标转换（实际项目中应使用真实地图API）
              const lng = mapCenter.lng + (x - rect.width / 2) * 0.001
              const lat = mapCenter.lat + (rect.height / 2 - y) * 0.001
              handleMapClick(lng, lat)
            }
          }}
        >
          {/* 地图中心标记 */}
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 24,
            color: '#1890ff'
          }}>
            📍
          </div>
          
          {/* 选中的坐标标记 */}
          {mapCoordinates && (
            <div style={{
              position: 'absolute',
              top: `${50 + (mapCenter.lat - mapCoordinates.latitude) / 0.001}%`,
              left: `${50 + (mapCoordinates.longitude - mapCenter.lng) / 0.001}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: 24,
              color: '#52c41a',
              animation: 'pulse 1s infinite'
            }}>
              📌
            </div>
          )}
          
          <div style={{ 
            textAlign: 'center',
            color: '#666',
            fontSize: 14,
            marginTop: 60
          }}>
            <div>🗺️ 地图选择器</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>
              {mapClickEnabled ? '点击地图选择位置' : '点击"启用选点"开始选择'}
            </div>
            {mapCoordinates && (
              <div style={{ 
                marginTop: 12, 
                padding: '4px 8px', 
                background: 'rgba(82, 196, 26, 0.1)',
                borderRadius: 4,
                fontSize: 12
              }}>
                已选择：{mapCoordinates.longitude.toFixed(6)}, {mapCoordinates.latitude.toFixed(6)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>钓点管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增钓点
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={fishingSpots}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingSpot ? '编辑钓点' : '新增钓点'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* 基本信息区域 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>📝 基本信息</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="钓点名称"
                  rules={[
                    { required: true, message: '请输入钓点名称' },
                    { max: 50, message: '钓点名称不能超过50个字符' }
                  ]}
                >
                  <Input placeholder="请输入钓点名称（1-50字符）" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterDepth"
                  label="水深（米）"
                  rules={[
                    { type: 'number', min: 0.1, max: 50, message: '水深范围为0.1-50米' }
                  ]}
                >
                  <InputNumber
                    placeholder="请输入水深"
                    style={{ width: '100%' }}
                    min={0.1}
                    max={50}
                    step={0.1}
                    precision={1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="钓点状态"
                  rules={[{ required: true, message: '请选择钓点状态' }]}
                >
                  <Select placeholder="请选择钓点状态">
                    <Option value="open">🔵 正常开放</Option>
                    <Option value="closed">🔴 临时关闭</Option>
                    <Option value="maintenance">🟡 维护中</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fishSpecies"
                  label="鱼种类"
                  rules={[{ required: true, message: '请选择鱼种类' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择鱼种类"
                    style={{ width: '100%' }}
                  >
                    {fishSpecies.map(fish => (
                      <Option key={fish.id} value={fish.name}>
                        🐟 {fish.name} ({fish.category === 'freshwater' ? '淡水鱼' : fish.category === 'saltwater' ? '海水鱼' : '洄游鱼'})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 位置信息区域 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>📍 位置信息</h4>
            <Form.Item label="坐标录入方式">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                {
                  key: 'manual',
                  label: (
                    <span>
                      <EditFilled style={{ marginRight: 4 }} />
                      手动输入
                    </span>
                  ),
                  children: (
                    <div>
                      <Alert
                        message="手动输入坐标"
                        description="请输入准确的经纬度坐标，支持小数点后7位精度"
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="longitude"
                            label="经度"
                            rules={[
                              { required: true, message: '请输入经度' },
                              { type: 'number', min: -180, max: 180, message: '经度范围为-180到180' }
                            ]}
                          >
                            <InputNumber
                              placeholder="请输入经度（-180~180）"
                              style={{ width: '100%' }}
                              min={-180}
                              max={180}
                              step={0.000001}
                              precision={7}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="latitude"
                            label="纬度"
                            rules={[
                              { required: true, message: '请输入纬度' },
                              { type: 'number', min: -90, max: 90, message: '纬度范围为-90到90' }
                            ]}
                          >
                            <InputNumber
                              placeholder="请输入纬度（-90~90）"
                              style={{ width: '100%' }}
                              min={-90}
                              max={90}
                              step={0.000001}
                              precision={7}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'map',
                  label: (
                    <span>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      地图选择
                    </span>
                  ),
                  children: (
                    <div>
                      <Alert
                        message="地图选点录入"
                        description="在地图上点击选择位置，系统将自动获取对应的经纬度坐标"
                        type="success"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                      <MapSelector />
                      {mapCoordinates && (
                        <div style={{ 
                          marginTop: 16, 
                          padding: 12, 
                          background: '#f6ffed', 
                          border: '1px solid #b7eb8f',
                          borderRadius: 6
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>📍 已选择坐标：</div>
                          <Row gutter={16}>
                            <Col span={12}>
                              <div>经度：{mapCoordinates.longitude.toFixed(7)}</div>
                            </Col>
                            <Col span={12}>
                              <div>纬度：{mapCoordinates.latitude.toFixed(7)}</div>
                            </Col>
                          </Row>
                          <Button 
                            type="primary" 
                            size="small" 
                            style={{ marginTop: 8 }}
                            onClick={useMapCoordinates}
                          >
                            应用此坐标到表单
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                }
              ]}
            />
            </Form.Item>
          </div>

          {/* 详细描述区域 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>📄 详细描述</h4>
            <Form.Item
              name="description"
              label="钓点描述"
              rules={[
                { required: true, message: '请输入钓点描述' },
                { max: 500, message: '描述不能超过500个字符' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="请输入钓点描述（最多500字符）"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="fishingGuide"
              label="钓点攻略"
              rules={[{ max: 1000, message: '攻略不能超过1000个字符' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入钓点攻略，包括最佳钓位、饵料推荐、钓法技巧等（最多1000字符）"
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </div>

          {/* 图片上传区域 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>📷 钓点图片</h4>
            <Form.Item label="钓点图片">
              <Upload
                {...handleUpload}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
              <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
                支持 JPG/PNG/WEBP 格式，单张不超过 5MB
              </div>
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSpot ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FishingSpotManagement