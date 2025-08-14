import React from 'react'
import { Empty as AntEmpty } from 'antd'

interface EmptyProps {
  description?: string
  image?: React.ReactNode
}

const Empty: React.FC<EmptyProps> = ({ description = '暂无数据', image }) => {
  return (
    <AntEmpty
      image={image || AntEmpty.PRESENTED_IMAGE_SIMPLE}
      description={description}
    />
  )
}

export default Empty