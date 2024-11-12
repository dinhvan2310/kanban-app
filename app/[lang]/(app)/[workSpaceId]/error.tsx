'use client'

import { Button, Result } from 'antd'
import { useEffect } from 'react'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <Result
            status="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => {
                window.location.href = '/'
            }}>Back Home</Button>}
        />
    )
}