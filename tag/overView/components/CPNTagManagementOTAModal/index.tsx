import { Upload, Modal, Steps, Card, Form, Select, Button, Input, message, Icon } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Dispatch } from 'redux';
import { connect } from 'dva';

import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Guideconfig from './otaGuide';

import { PSStateType } from '../../model';
import { SelectListData } from '../../data.d';
import styles from './index.less';


const { Option } = Select;
const { Step } = Steps;

// 表单标签的字段及全球化
const fieldLabels = {
  gatewayGroup: formatMessage({ id: 'networkSetting.tag.form.tag-group' }),
  deviceid: formatMessage({ id: 'networkSetting.tag.table.tag-id' }),
  firmware: formatMessage({ id: 'networkSetting.tag.form.tag-firmware' }),
  name: formatMessage({ id: 'networkSetting.tag.table.tag-name' }),
  description: formatMessage({ id: 'networkSetting.tag.table.tag-description' }),
};

// 上传属性定义
const uploadProps = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  action: '/device/tag/uploadfirmware',
};

// 输入字段类型定义
interface OTAFormProps extends FormComponentProps {
  dvaTagManagementOverview?: PSStateType;
  dispatch?: Dispatch<any>;
}

// 状态字段类型定义
interface OTAState {
  stepNum: number;
  canUpload: Boolean;
  checksumConfirm: boolean | string;
  devicesConfirm: boolean | string;
  firmwareConfirm: boolean | string;
  buttonSubmitStatus: boolean;
  isTourOpen: boolean;
}

// 封装OTA组件
class OTAForm extends Component<OTAFormProps, OTAState> {
  state: OTAState = {
    stepNum: 0,
    canUpload: false,
    buttonSubmitStatus: true,
    checksumConfirm: 'await',
    devicesConfirm: 'await',
    firmwareConfirm: 'await',
    isTourOpen: false,
  }

  // 确认操作
  handleClosedModal = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        OTAModalVisible: !flag,
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  };

  // 图片上传
  uploadOTA = (info?: any) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      this.setState({
        stepNum: 0,
      })
    }

    if (status === 'done') {
      const res = info.fileList[0].response;
      this.setState({
        stepNum: 2,
        checksumConfirm: res.checksumConfirm,
        devicesConfirm: res.devicesConfirm,
        firmwareConfirm: res.firmwareConfirm,
      })

      if (!info.fileList[0].response.err) {
        this.props.form.setFieldsValue({
          version: info.fileList[0].response.version || '',
        });
        // 上传回传信息都正确,则按钮激活
        if (res.checksumConfirm && res.devicesConfirm && res.firmwareConfirm) {
          this.setState({
            buttonSubmitStatus: false
          })
        }
      } else {
        message.error(info.fileList[0].response.err.message);
      }

    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`, 5);
      this.setState({
        buttonSubmitStatus: true
      })
    }
  }

  // ota 更新
  handleOTAUpdate = (vals?: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaTagManagementOverview/otaUpgrade',
        payload: vals,
        callback: (res: any) => {
          if (res.err) {
            // message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
          } else {
            // message.success(formatMessage({ id: 'networkSetting.tag.form.action.success' }));
          }
        },
      });
    }
  }

  // 提交验证控制
  tagOTAHandle = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleOTAUpdate(fieldsValue);
      if (dispatch) {
        const payload = {
          OTAModalVisible: false,
        };
        dispatch({
          type: 'dvaTagManagementOverview/modalVisible',
          payload,
        });
      }
    });
  };

  // 上传按钮失效控制
  beforeUploadCheck = (e?: string) => {
    if (e) {
      this.setState({
        canUpload: true
      })
    }
  }

  // 引导层控制
  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  disableBody = (target: any) => disableBodyScroll(target);

  enableBody = (target: any) => enableBodyScroll(target);

  render() {
    const { form, dvaTagManagementOverview } = this.props;
    const { OTAModalVisible, groupList } = dvaTagManagementOverview;
    const { stepNum, canUpload, checksumConfirm, devicesConfirm, firmwareConfirm, buttonSubmitStatus, isTourOpen } = this.state;

    // Steps 上传状态判断
    let ckDev = 'await';
    let ckSum = 'await';
    let ckFire = 'await';
    if (checksumConfirm !== 'await') {
      ckSum = checksumConfirm === false ? 'error' : 'finish';
    }
    if (devicesConfirm !== 'await') {
      ckDev = devicesConfirm === false ? 'error' : 'finish';
    }
    if (firmwareConfirm !== 'await') {
      ckFire = firmwareConfirm === false ? 'error' : 'finish';
    }

    return (
      <Modal
        title={<><FormattedMessage id="networkSetting.tag.overview.action.tagota" defaultMessage="Tag OTA" />
          <span style={{ float: 'right', marginRight: '24px', marginTop: '-4px' }}>
            <Button onClick={this.openTour} type="primary" shape="round" icon="question-circle">
              Help
      </Button>
          </span></>}
        width={416}
        bodyStyle={{
          padding: "16px 24px"
        }}
        // okButtonProps={{ disabled: buttonSubmitStatus }}
        destroyOnClose
        visible={OTAModalVisible}
        onCancel={this.handleClosedModal}
        // okText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
        // cancelText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
        // onOk={this.tagOTAHandle}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleClosedModal}
            guide-id="tag-ota-cancel"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
          </Button>,
          <Button
            type="primary"
            key="ok"
            disabled={buttonSubmitStatus}
            onClick={this.tagOTAHandle}
            guide-id="tag-ota-submit"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
          </Button>
        ]}
        className={styles.otaModal}
      >
        <Tour
          onRequestClose={this.closeTour}
          steps={Guideconfig}
          isOpen={isTourOpen}
          className="helper"
          rounded={5}
          showNumber={false}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />

        <Card bordered={false} bodyStyle={{ padding: 0, maxHeight: 360 }}>
          <Form >
            <Form.Item label={fieldLabels.gatewayGroup} guide-id="tag-ota-select-gateway">
              {form.getFieldDecorator('id', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-gateway-group',
                    })}`,
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'networkSetting.tag-overview.placeholder.tag-group',
                  })}
                  onChange={this.beforeUploadCheck}

                >
                  {groupList.data.map((item: SelectListData) => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>,
              )}

            </Form.Item>

            <Form.Item label={fieldLabels.firmware}>
              {form.getFieldDecorator('version', {
                rules: [
                  {
                    required: false,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-firmware',
                    })}`,
                  },
                ],
                initialValue: '',
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'networkSetting.tag.label.select-firmware',
                  })}

                  addonAfter={

                    <Upload
                      {...uploadProps}
                      onChange={this.uploadOTA}
                      disabled={!canUpload}

                    ><span guide-id="tag-ota-upload">
                        <Icon type="upload" />
                        <FormattedMessage
                          id="networkSetting.tag.overview.dialog.button.upload"
                          defaultMessage="Upload"
                        /></span>
                    </Upload>
                  }
                />,
              )}
            </Form.Item>

            <Form.Item >
              <Steps size='small' current={stepNum} direction="vertical" style={{ marginTop: '10px', marginLeft: '8px' }}>
                <Step status={ckSum} description={<FormattedMessage
                  id="networkSetting.tag.ota.confirm.step1"
                  defaultMessage="Confirm devices"
                />} />
                <Step status={ckDev} description={<FormattedMessage
                  id="networkSetting.tag.ota.confirm.step2"
                  defaultMessage="Confirm checksum"
                />} />
                <Step status={ckFire} description={<FormattedMessage
                  id="networkSetting.tag.ota.confirm.step3"
                  defaultMessage="Confirm firmware"
                />} />
              </Steps>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    );
  }
}

/* 连接数据流 */
export default Form.create<OTAFormProps>({ name: 'tag-ota' })(
  connect(
    ({
      dvaTagManagementOverview,
    }: {
      dvaTagManagementOverview: PSStateType;
      loading: {
        effects: { [key: string]: boolean };
      };
    }) => ({
      dvaTagManagementOverview,
    }),
  )(OTAForm),
);
