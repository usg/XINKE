import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;
const tourConfig = [
    {
        selector: '[guide-id="tag-export-template"]',
        content: () => (<Text style={{ paddingRight: "16px" }}>
            You can download the template and
            fill in the template before uploading.
        </Text>)
    }
];

export default tourConfig;