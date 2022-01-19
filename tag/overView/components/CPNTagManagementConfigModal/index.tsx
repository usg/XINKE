import React, { Component } from 'react';
import { Select, Form, Card, Modal, InputNumber, Button, message, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Guideconfig from './configGuide';
import { PSStateType } from '../../model';
import styles from './index.less';

const { Option } = Select;

// 表单标签的字段及全球化 
const fieldLabels = {
  gatewayGroup: formatMessage({ id: 'networkSetting.tag.form.tag-group' }),
  deviceid: formatMessage({ id: 'networkSetting.tag.table.tag-id' }),
  name: formatMessage({ id: 'networkSetting.tag.table.tag-name' }),
  tx: formatMessage({ id: 'networkSetting.tag.form.tag-tx' }),
  ota: formatMessage({ id: 'networkSetting.tag.form.tag-ota' }),
  boardcastInt: formatMessage({ id: 'networkSetting.tag.form.tag-bint' }),
  description: formatMessage({ id: 'networkSetting.tag.table.tag-description' }),
  repeat: formatMessage({ id: 'networkSetting.tag.form.tag-repeat' }),
  tagStatus: formatMessage({ id: 'networkSetting.tag.form.tag-status' }),
};

// 输入字段类型定义
interface ConfigFormProps extends FormComponentProps {
  dvaTagManagementOverview?: PSStateType;
  dispatch?: Dispatch<any>;
}


// 状态字段类型定义
interface ConfigState {
  isTourOpen: boolean;
}

// 封装UpdateForm组件
class ConfigForm extends Component<ConfigFormProps, ConfigState> {
  state = {
    isTourOpen: false
  }

  handleUpdateModalVisible = (flag?: Boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        configModalVisible: !flag,
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  }

  // 提交标签配置
  okHandle = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'dvaTagManagementOverview/configUpdate',
          payload: fieldsValue,
          callback: (res: any) => {
            if (res.error) {
              message.error(formatMessage({ id: 'networkSetting.tag.form.config.fail' }), 5);
            } else {
              message.success(formatMessage({ id: 'networkSetting.tag.form.config.success' }));
            }
          },
        });
        dispatch({
          type: 'dvaTagManagementOverview/save',
          payload: {
            tagConfigInfo: fieldsValue,
            configModalVisible: false,
          },
        })
      }
    });
  };

  // 根据组获取相关信息
  getGroupInfo = (val?: string) => {
    const { dispatch } = this.props;
    if (dispatch && val) {
      dispatch({
        type: 'dvaTagManagementOverview/configGet',
        payload: { groupID: val },
        callback: (res: any) => {
          this.props.form.resetFields();
          if (res.err) {
            message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
          }
        }
      });
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
    const {
      form,
      dvaTagManagementOverview
    } = this.props;
    const { isTourOpen } = this.state;
    const { configModalVisible, tagConfigInfo, groupList } = dvaTagManagementOverview;
    // 组带出信息
    let groupData = {};
    if (tagConfigInfo && tagConfigInfo.data) {
      groupData = tagConfigInfo.data;
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

    return (
      <Modal
        destroyOnClose
        title={<>
          <span style={{ float: 'right', marginRight: '24px', marginTop: '-4px' }}>
            <Button onClick={this.openTour} type="primary" shape="round" icon="question-circle">
              Help
          </Button>
          </span>
          {formatMessage({ id: 'networkSetting.tag.dialog.config' })}</>}
        style={{ height: '80%' }}
        bodyStyle={{
          minHeight: 200,
          overflow: 'auto',
          padding: "16px 24px"
        }}
        width={720}
        visible={configModalVisible}
        // okText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
        // cancelText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
        // onOk={this.okHandle}
        onCancel={this.handleUpdateModalVisible}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleUpdateModalVisible}
            guide-id="tag-ota-cancel"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
          </Button>,
          <Button
            type="primary"
            key="ok"
            onClick={this.okHandle}
            guide-id="tag-ota-submit"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
          </Button>
        ]}
        className={styles.configModal}
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

        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <Form {...formItemLayout} className={styles.itemForm}>
            <Form.Item label={fieldLabels.gatewayGroup}>
              {form.getFieldDecorator('groupID', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-gateway-group',
                    })}`,
                  },
                ],
                initialValue: groupData.groupID,
              })(
                <Select
                  placeholder={formatMessage({
                    id: 'networkSetting.tag-overview.placeholder.tag-group',
                  })}
                  onChange={this.getGroupInfo}
                >
                  {groupList.data.map((item?: any) => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label={fieldLabels.tx}>
              {form.getFieldDecorator('txPower', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-tx',
                    })}`,
                  },
                ],
                initialValue: groupData.txPower !== undefined ? Number(groupData.txPower) : '',
              })(
                <InputNumber min={-40} max={8} />
              )} dBm
              </Form.Item>

            <Form.Item label={fieldLabels.boardcastInt}>
              {form.getFieldDecorator('broadcastInterval', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-boardcastInt',
                    })}`,
                  },
                ],
                initialValue: Number(groupData.broadcastInterval) || '',
              })(
                <InputNumber min={1} max={14400} />
              )} {formatMessage({
                id: 'networkSetting.tag.form.item.second',
              })}
            </Form.Item>

            <Row gutter={24} style={{ height: "64px" }}>
              <Col span={17} offset={2} >
                <Form.Item label={fieldLabels.ota} >
                  {form.getFieldDecorator('otaInterval', {
                    rules: [
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'networkSetting.tag.require.tag-ota',
                        })}`,
                      },
                    ],
                    initialValue: groupData.otaInterval ? Number(groupData.otaInterval[0]) : '',
                  })(
                    <InputNumber min={1} max={43200} />
                  )}
                </Form.Item>
              </Col>
              <Col span={17} offset={6} >
                <Form.Item className={styles.secondOTAinterval}>
                  {form.getFieldDecorator('otaInterval2', {
                    rules: [
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'networkSetting.tag.require.tag-ota',
                        })}`,
                      },
                    ],
                    initialValue: groupData.otaInterval ? Number(groupData.otaInterval[1]) : '',
                  })(
                    <InputNumber min={1} max={2592000} style={{ marginLeft: '3px' }} />
                  )} {formatMessage({
                    id: 'networkSetting.tag.form.item.second',
                  })}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={fieldLabels.repeat}>
              {form.getFieldDecorator('repeatBroadcast', {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({
                      id: 'networkSetting.tag.require.tag-repeat',
                    })}`,
                  },
                ],
                initialValue: Number(groupData.repeatBroadcast) || '',
              })(
                <InputNumber min={1} max={100} />
              )} {formatMessage({
                id: 'networkSetting.tag.form.item.time',
              })}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    );
  }
}

/* 连接数据流 */
export default Form.create<ConfigFormProps>({ name: 'tag-manegment' })(
  connect(
    ({
      dvaTagManagementOverview,
      loading,
    }: {
      dvaTagManagementOverview: PSStateType;
      loading: {
        effects: { [key: string]: boolean };
      };
    }) => ({
      dvaTagManagementOverview,
      loading: loading.effects['dvaTagManagementOverview/fetchInformation'],
    }),
  )(ConfigForm),
);


