import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
  Progress,
  Divider,
  Alert
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  BugOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
const { Option } = Select

// 鱼种数据类型
interface FishSpecies {
  id: string
  name: string
  scientificName?: string
  category: 'freshwater' | 'saltwater' | 'migratory'
  fishingMethods: string[]
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  usageCount: number // 被钓点引用的次数
}

// 模拟数据
const mockFishSpecies: FishSpecies[] = [
  {
    id: 'FS20241201001',
    name: '鲤鱼',
    scientificName: 'Cyprinus carpio',
    category: 'freshwater',
    fishingMethods: ['台钓', '传统钓', '路亚'],
    description: '常见淡水鱼类，适应性强，分布广泛',
    status: 'active',
    createdAt: '2024-12-01 10:30:00',
    updatedAt: '2024-12-01 15:20:00',
    usageCount: 15
  },
  {
    id: 'FS20241201002',
    name: '草鱼',
    scientificName: 'Ctenopharyngodon idellus',
    category: 'freshwater',
    fishingMethods: ['台钓', '传统钓'],
    description: '大型淡水鱼类，喜食水草',
    status: 'active',
    createdAt: '2024-12-01 09:15:00',
    updatedAt: '2024-12-01 14:30:00',
    usageCount: 12
  },
  {
    id: 'FS20241201003',
    name: '鲫鱼',
    scientificName: 'Carassius auratus',
    category: 'freshwater',
    fishingMethods: ['台钓', '传统钓'],
    description: '小型淡水鱼类，分布极广',
    status: 'active',
    createdAt: '2024-12-01 08:45:00',
    updatedAt: '2024-12-01 13:15:00',
    usageCount: 20
  },
  {
    id: 'FS20241201004',
    name: '鲈鱼',
    scientificName: 'Micropterus salmoides',
    category: 'freshwater',
    fishingMethods: ['路亚', '台钓'],
    description: '肉食性鱼类，喜欢攻击性强的饵料',
    status: 'active',
    createdAt: '2024-12-01 11:20:00',
    updatedAt: '2024-12-01 16:10:00',
    usageCount: 8
  },
  {
    id: 'FS20241201005',
    name: '黄颡鱼',
    scientificName: 'Pelteobagrus fulvidraco',
    category: 'freshwater',
    fishingMethods: ['传统钓', '台钓'],
    description: '小型肉食性鱼类，夜间活跃',
    status: 'active',
    createdAt: '2024-12-01 12:00:00',
    updatedAt: '2024-12-01 17:30:00',
    usageCount: 6
  }
]

const FishSpeciesManagement: React.FC = () => {
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>(mockFishSpecies)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState<FishSpecies | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<'uploading' | 'processing' | 'success' | 'error' | null>(null)

  // 分类颜色映射
  const categoryColors = {
    freshwater: 'blue',
    saltwater: 'cyan',
    migratory: 'purple'
  }

  // 分类文本映射
  const categoryTexts = {
    freshwater: '淡水鱼',
    saltwater: '海水鱼',
    migratory: '洄游鱼'
  }

  // 状态颜色映射
  const statusColors = {
    active: 'green',
    inactive: 'red'
  }

  // 状态文本映射
  const statusTexts = {
    active: '启用',
    inactive: '禁用'
  }

  // 钓法选项
  const fishingMethodOptions = [
    '台钓', '传统钓', '路亚', '海钓', '矶钓', '船钓', '筏钓', '野钓'
  ]



  // 表格列配置
  const columns: ColumnsType<FishSpecies> = [
    {
      title: '鱼种名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text: string, record: FishSpecies) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <BugOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {text}
          </div>
          {record.scientificName && (
            <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>
              {record.scientificName}
            </div>
          )}
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: keyof typeof categoryColors) => (
        <Tag color={categoryColors[category]}>
          {categoryTexts[category]}
        </Tag>
      ),
      filters: [
        { text: '淡水鱼', value: 'freshwater' },
        { text: '海水鱼', value: 'saltwater' },
        { text: '洄游鱼', value: 'migratory' }
      ],
      onFilter: (value, record) => record.category === value
    },
    {
      title: '钓法',
      dataIndex: 'fishingMethods',
      key: 'fishingMethods',
      width: 150,
      render: (methods: string[]) => (
        <div>
          {methods.slice(0, 2).map(method => (
            <Tag key={method} color="orange" style={{ marginBottom: 2 }}>
              🎣 {method}
            </Tag>
          ))}
          {methods.length > 2 && <Tag color="default">+{methods.length - 2}</Tag>}
        </div>
      )
    },

    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>
          {statusTexts[status]}
        </Tag>
      ),
      filters: [
        { text: '启用', value: 'active' },
        { text: '禁用', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (text: string) => (
        <span style={{ fontSize: 12 }}>📅 {text.split(' ')[0]}</span>
      ),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: FishSpecies) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要删除鱼种"${record.name}"吗？`}
            description={record.usageCount > 0 ? `该鱼种被${record.usageCount}个钓点引用，删除后相关钓点的鱼种信息将被移除。` : undefined}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.usageCount > 0}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 处理编辑鱼种
  const handleEdit = (species: FishSpecies) => {
    setEditingSpecies(species)
    form.setFieldsValue({
      ...species,
      fishingMethods: species.fishingMethods
    })
    setModalVisible(true)
  }

  // 处理删除鱼种
  const handleDelete = (id: string) => {
    setFishSpecies(prev => prev.filter(species => species.id !== id))
    message.success('鱼种删除成功')
  }

  // 处理新增鱼种
  const handleAdd = () => {
    setEditingSpecies(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const newSpecies: FishSpecies = {
        id: editingSpecies?.id || `FS${Date.now()}`,
        ...values,
        usageCount: editingSpecies?.usageCount || 0,
        createdAt: editingSpecies?.createdAt || new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }

      if (editingSpecies) {
        setFishSpecies(prev => prev.map(species => species.id === editingSpecies.id ? newSpecies : species))
        message.success('鱼种更新成功')
      } else {
        setFishSpecies(prev => [newSpecies, ...prev])
        message.success('鱼种创建成功')
      }

      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理批量导入
  const handleImport = () => {
    setImportModalVisible(true)
    setFileList([])
    setImportProgress(0)
    setImportStatus(null)
  }

  // 处理文件上传
  const handleFileUpload = {
    beforeUpload: (file: File) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        message.error('只能上传 Excel 文件!')
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!')
        return false
      }
      return false // 阻止自动上传
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1)) // 只保留最后一个文件
    }
  }

  // 模拟导入处理
  const processImport = async () => {
    if (fileList.length === 0) {
      message.error('请先选择要导入的文件')
      return
    }

    setImportStatus('processing')
    setImportProgress(0)

    // 模拟导入进度
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setImportStatus('success')
          message.success('导入成功！共导入 5 条鱼种数据')
          // 这里可以添加实际导入的数据
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // 下载模板
  const downloadTemplate = () => {
    // 这里应该实现实际的模板下载逻辑
    message.info('模板下载功能开发中...')
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>鱼种管理</h2>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
              下载模板
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              批量导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增鱼种
            </Button>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={fishSpecies}
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

      {/* 新增/编辑鱼种弹窗 */}
      <Modal
        title={editingSpecies ? '编辑鱼种' : '新增鱼种'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="鱼种名称"
                rules={[
                  { required: true, message: '请输入鱼种名称' },
                  { max: 30, message: '鱼种名称不能超过30个字符' }
                ]}
              >
                <Input placeholder="请输入鱼种名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scientificName"
                label="学名"
                rules={[{ max: 100, message: '学名不能超过100个字符' }]}
              >
                <Input placeholder="请输入学名（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="鱼种分类"
                rules={[{ required: true, message: '请选择鱼种分类' }]}
              >
                <Select placeholder="请选择鱼种分类">
                  <Option value="freshwater">🔵 淡水鱼</Option>
                  <Option value="saltwater">🔵 海水鱼</Option>
                  <Option value="migratory">🟣 洄游鱼</Option>
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
                  <Option value="active">🟢 启用</Option>
                  <Option value="inactive">🔴 禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="fishingMethods"
            label="适用钓法"
            rules={[{ required: true, message: '请选择适用钓法' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择适用钓法"
              style={{ width: '100%' }}
            >
              {fishingMethodOptions.map(method => (
                <Option key={method} value={method}>
                  🎣 {method}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="鱼种描述"
            rules={[{ max: 500, message: '描述不能超过500个字符' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入鱼种描述，包括习性、特点等（最多500字符）"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSpecies ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量导入弹窗 */}
      <Modal
        title="批量导入鱼种"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            取消
          </Button>,
          <Button key="download" icon={<DownloadOutlined />} onClick={downloadTemplate}>
            下载模板
          </Button>,
          <Button
            key="import"
            type="primary"
            icon={<UploadOutlined />}
            onClick={processImport}
            loading={importStatus === 'processing'}
            disabled={fileList.length === 0 || importStatus === 'processing'}
          >
            开始导入
          </Button>
        ]}
        width={600}
        destroyOnHidden
      >
        <Alert
          message="导入说明"
          description={
            <div>
              <p>1. 请下载并使用标准模板进行数据录入</p>
              <p>2. 支持 Excel 格式文件（.xlsx, .xls），文件大小不超过 10MB</p>
              <p>3. 必填字段：鱼种名称、分类、适用钓法</p>
              <p>4. 导入前请确保数据格式正确，避免重复数据</p>
            </div>
          }
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Upload.Dragger
          {...handleFileUpload}
          fileList={fileList}
          maxCount={1}
          style={{ marginBottom: 16 }}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 Excel 文件格式，单个文件不超过 10MB
          </p>
        </Upload.Dragger>

        {importStatus === 'processing' && (
          <div>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <p>正在导入数据，请稍候...</p>
              <Progress percent={importProgress} status="active" />
            </div>
          </div>
        )}

        {importStatus === 'success' && (
          <div>
            <Divider />
            <Alert
              message="导入成功"
              description="鱼种数据已成功导入系统，您可以在列表中查看新增的数据。"
              type="success"
              showIcon
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default FishSpeciesManagement