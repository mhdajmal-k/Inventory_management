import type React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

interface LoadingFallbackProps {
    tip?: string
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ tip = "Loading..." }) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
            <Spin indicator={antIcon} tip={tip} />
        </div>
    )
}

export default LoadingFallback

