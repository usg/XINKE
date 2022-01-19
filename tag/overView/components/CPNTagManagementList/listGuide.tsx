import React from 'react';
import { Typography, } from 'antd';
import AudioPlayer from "../CPNAudioPlayer";


const { Text } = Typography;
// 测试引导层对图片和音频文件的支持
const tourConfig = [
    {
        selector: '[data-id="tag-search-button"]',
        content: () => (
            <>
                <img style={{ float: "left" }} width={250} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                <Text style={{ paddingRight: '8px' }}>Click the input box, start to input the information to be searched, and click the search tool chart to start searching
                </Text>
            </>),
    },
    {
        selector: '[data-id="tag-add-button"]',
        content: () => (
            <>
                <AudioPlayer id="audio5" src="https://www.w3school.com.cn/i/horse.ogg" >
                    Your browser does not support the audio element.
                </AudioPlayer>
                <p style={{ marginTop: "16px" }}>
                    <Text style={{ paddingRight: '8px' }}>Click here to start adding basic tag information.
                </Text>
                </p>
            </>),
    },
    {
        selector: '[data-id="tag-select-button"]',
        content: () => (<div>
            <Text style={{ paddingRight: '8px' }}>Select here to enter the corresponding tags export, import, configuration, delete, and OTA operation interface.
           </Text>
        </div>)
    },
];

export default tourConfig;