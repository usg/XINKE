import { Form, Input, Select, Card, Modal, Upload, Steps, message } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { FormComponentProps } from 'antd/es/form';
import { IStateType } from '../../model';
import { GatewayListItem, GroupListItem, GatewayUpgradeParams, UploadResultData } from '../../data';
import styles from './index.less';
import { getModalBodyHeight } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;

// 表单标签的字段及全球化
const fieldLabels = {
  group: formatMessage({ id: 'networkSetting.gateway.label.select-group' }),
  firmware: formatMessage({ id: 'networkSetting.gateway.label.select-firmware' }),
};

// 输入字段类型定义
interface UpgradeFormProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  dvaNetworkGateway?: IStateType;
  handleModalVisible: (modal: string, flag?: boolean, record?: Partial<GatewayListItem>) => void;
}

// 状态字段类型定义
interface UpgradeFormState {
  modelValue: string;
  fileData: File[];
  uploading: boolean;
  disabled: boolean;
  checkResult: Partial<UploadResultData>;
}

// 封装CPNNetworkGatewayOTA组件
class CPNNetworkGatewayOTA extends Component<UpgradeFormProps, UpgradeFormState> {
  constructor(props: UpgradeFormProps) {
    super(props);
    this.state = {
      modelValue: '',
      fileData: [],
      uploading: false,
      disabled: true,
      checkResult: {},
    };
  }

  /** 生命周期，所有的子组件都render完之后才调用 */
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/fetchGroup',
      });
    }
  }

  /**
   * 处理OTA操作
   */
  handleUpgrade = (upgradeObj: GatewayUpgradeParams) => {
    const { dispatch, handleModalVisible } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/upgrade',
        payload: upgradeObj,
        callback: (res: any) => {
          if (res.error === 100000) {
            message.success(res.message);
          } else {
            message.error(res.message || 'Oops! Something went wrong.');
          }
          this.setState({ checkResult: res });
        },
      });
    }
    handleModalVisible('upgrade', false);
  };

  // model存储至state
  handleModelChange = (value: string) => {
    const { disabled, fileData } = this.state;
    this.setState({ modelValue: value }, () => {
      if (disabled || !Object.keys(fileData).length) {
        this.setState({
          disabled: !value,
        });
      } else {
        this.uploadCheck();
      }
    });
  };

  // 文件上传至state存储
  handleFileUpload = (file: File) => {
    const { form } = this.props;
    this.setState({ fileData: [file] }, () => {
      // 这里打印的是最新的state值
      this.uploadCheck();
    });
    form.setFieldsValue({
      version: file.name,
    });
    return false; // 拦截upload插件默认上传行为
  };

  // 文件与model通过API进行验证
  uploadCheck = () => {
    const { dispatch, form } = this.props;
    const { modelValue, fileData } = this.state;
    form.validateFields((err: string | undefined) => {
      if (err) return;
      const formData = new FormData();
      formData.append('file', fileData[0]);
      formData.append('model', modelValue);
      this.setState({
        uploading: true,
      });
      if (dispatch) {
        dispatch({
          type: 'dvaNetworkGateway/upload',
          payload: formData,
          callback: (result: UploadResultData) => {
            this.setState({
              uploading: false,
              checkResult: result,
            });
          },
        });
      }
    });
  };

  // 提交升级操作
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    const { checkResult } = this.state;
    const firmwareVersion = checkResult.version;

    if (!firmwareVersion) {
      form.setFields({ version: { errors: [new Error('error')] } });
      return;
    }

    form.validateFields((err: string | undefined, fieldsValue: GatewayUpgradeParams) => {
      if (err) return;
      this.setState({
        fileData: [],
      });
      const upgradeValue: GatewayUpgradeParams = {
        id: fieldsValue.id,
        version: firmwareVersion,
      };
      // console.log('upgradeValue', upgradeValue);
      this.handleUpgrade(upgradeValue);
    });
  };

  // 取消关闭窗口
  handleCancel = () => {
    const { handleModalVisible } = this.props;
    this.setState({
      fileData: [],
      checkResult: {},
    });
    handleModalVisible('upgrade', false);
  };

  render() {
    const {
      form: { getFieldDecorator },
      dvaNetworkGateway,
    } = this.props;
    const { gatewayGroup = [], upgradeModalVisible } = dvaNetworkGateway || {};
    const { disabled, checkResult } = this.state;
    const { devicesConfirm, checksumConfirm, firmwareConfirm } = checkResult;
    const okButtonDisabled = !(devicesConfirm && checksumConfirm && firmwareConfirm);

    /**
     * @param conentHeight 模态框内容高度
     * @param hasModalFooter 是否含footer
     * @return number 模态框内容框可视高度
     */
    const maxHeight = getModalBodyHeight(366);

    const getModalContent = () => {
      const { uploading } = this.state;
      return (
        <Card bordered={false} bodyStyle={{ padding: '0' }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label={fieldLabels.group}>
              {getFieldDecorator('id', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.gateway.label.select-group',
                    })}`,
                  },
                ],
                validateTrigger: 'onBlur',
              })(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'networkSetting.gateway.label.select-group',
                  })}
                  onChange={this.handleModelChange}
                >
                  {gatewayGroup.map((item: GroupListItem) => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label={fieldLabels.firmware}>
              {getFieldDecorator('version', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.gateway.label.select-firmware',
                    })}`,
                  },
                ],
                validateTrigger: 'onBlur',
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'networkSetting.gateway.label.select-firmware',
                  })}
                  disabled={disabled}
                  addonAfter={
                    <Upload
                      withCredentials
                      className={styles.uploadSoftware}
                      disabled={disabled}
                      beforeUpload={this.handleFileUpload}
                    >
                      {uploading ? (
                        <LoadingOutlined />
                      ) : (
                        <>
                          <UploadOutlined />
                          <FormattedMessage
                            id="networkSetting.gateway.dialog.button.upload"
                            defaultMessage="Upload"
                          />
                        </>
                      )}
                    </Upload>
                  }
                />,
              )}
            </FormItem>
            <FormItem>
              <Steps direction="vertical" size="small" current={2}>
                <Step
                  title={formatMessage({
                    id: 'networkSetting.gateway.label.confirm-devices',
                    defaultMessage: 'Confirm devices',
                  })}
                  status={
                    // eslint-disable-next-line no-nested-ternary
                    Object.keys(checkResult).length ? (devicesConfirm ? 'finish' : 'error') : 'wait'
                  }
                />
                <Step
                  title={formatMessage({
                    id: 'networkSetting.gateway.label.confirm-checksum',
                    defaultMessage: 'Confirm checksum',
                  })}
                  status={
                    // eslint-disable-next-line no-nested-ternary
                    Object.keys(checkResult).length
                      ? checksumConfirm
                        ? 'finish'
                        : 'error'
                      : 'wait'
                  }
                />
                <Step
                  title={formatMessage({
                    id: 'networkSetting.gateway.label.confirm-firmware',
                    defaultMessage: 'Confirm firmware',
                  })}
                  status={
                    // eslint-disable-next-line no-nested-ternary
                    Object.keys(checkResult).length
                      ? firmwareConfirm
                        ? 'finish'
                        : 'error'
                      : 'wait'
                  }
                />
              </Steps>
            </FormItem>
          </Form>
        </Card>
      );
    };

    return (
      <Modal
        title={formatMessage({
          id: 'networkSetting.gateway.dialog.upgrade-device',
          defaultMessage: 'Gateway OTA',
        })}
        width={416}
        className={styles.otaModal}
        style={{ minWidth: '416px' }}
        bodyStyle={{ paddingTop: 16, paddingBottom: 16, maxHeight }}
        destroyOnClose
        visible={upgradeModalVisible}
        okButtonProps={{ disabled: okButtonDisabled }}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText={formatMessage({
          id: 'networkSetting.gateway.dialog.button-submit',
          defaultMessage: 'Confirm',
        })}
      >
        {getModalContent()}
      </Modal>
    );
  }
}

/* 连接数据流dvaNetworkGateway */
export default Form.create<UpgradeFormProps>({ name: 'gateway_overview_upgrade' })(
  connect(
    ({
      dvaNetworkGateway,
      loading,
    }: {
      dvaNetworkGateway: IStateType;
      loading: {
        effects: { [key: string]: boolean };
      };
    }) => ({
      dvaNetworkGateway,
      loading: loading.effects['dvaNetworkGateway/fetchGroup'],
    }),
  )(CPNNetworkGatewayOTA),
);
