import React, { Component } from 'react';
import { Input, InputNumber, Select, Form, Modal, Row, Col, Typography, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import AMSSetMapPosition from '@/components/AMSSetMapPosition';
import { returnPosition } from '@/components/AMSSetMapPosition/data.d';
import { IStateType } from '../../model';
import { GatewayListItem, GatewayPosition, GroupListItem } from '../../data';
import styles from './index.less';

const { Option } = Select;
const { Text } = Typography;

// 表单标签的字段及全球化
const fieldLabels = {
  gatewayID: formatMessage({ id: 'networkSetting.gateway.table.id' }),
  name: formatMessage({ id: 'networkSetting.gateway.table.name' }),
  groupName: formatMessage({ id: 'networkSetting.gateway.table.group' }),
  description: formatMessage({ id: 'networkSetting.gateway.table.description' }),
  coordinate_x: formatMessage({ id: 'networkSetting.gateway.table.coordinate-x' }),
  coordinate_y: formatMessage({ id: 'networkSetting.gateway.table.coordinate-y' }),
};

// 添加/修改表单字段数据类型定义
interface GatewayFormData extends GatewayListItem {
  x: number;
  y: number;
}

// 输入字段类型定义
interface UpdateFormProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  dvaNetworkGateway?: IStateType;
  handleModalVisible: (modal: string, flag?: boolean, record?: Partial<GatewayListItem>) => void;
}

// 状态字段类型定义
interface UpdateFormState {
  action: string;
  gatewayPosition: GatewayPosition;
}

// 封装CPNNetworkGatewayModal组件
class CPNNetworkGatewayModal extends Component<UpdateFormProps, UpdateFormState> {
  constructor(props: UpdateFormProps) {
    super(props);
    const { dvaNetworkGateway } = props;
    const { updateModalValues = {} } = dvaNetworkGateway || {};
    this.state = {
      action: updateModalValues.id ? 'update' : 'add', // 操作类型
      gatewayPosition: {
        id: (Math.random() * 100000).toFixed(0),
        floorID: updateModalValues.floorID || '',
        coordinates: updateModalValues.coordinates || [NaN, NaN],
      },
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
   * 清除位置信息
   */
  clearPosition = () => {
    this.setState({
      gatewayPosition: {
        id: '',
        floorID: '',
        coordinates: [NaN, NaN],
      },
    });
  };

  /**
   * 点击地图中mark点，同步表单中坐标
   */
  onPositionClick = (res: returnPosition) => {
    const { form } = this.props;
    const { floorID, coordinate = [NaN, NaN] } = res || {};
    const gatewayPosition: GatewayPosition = {
      id: (Math.random() * 100000).toFixed(0),
      floorID,
      coordinates: coordinate,
    };
    this.setState({
      gatewayPosition,
    });
    form.setFieldsValue({
      x: coordinate[0],
      y: coordinate[1],
    });
  };

  changeMarkerPos = (type: string, value?: number) => {
    const { gatewayPosition } = this.state;
    const { coordinates, ...rest } = gatewayPosition || {};
    if (type === 'X') {
      coordinates[0] = value || NaN;
    } else if (type === 'Y') {
      coordinates[1] = value || NaN;
    }
    this.setState({
      gatewayPosition: { coordinates, ...rest },
    });
  };

  /**
   * 处理添加/修改操作
   */
  handleUpdate = (action: string, fields: Partial<GatewayFormData>) => {
    // console.log('gatewayUpdate:', fields);
    const { dispatch, handleModalVisible } = this.props;
    const { gatewayPosition } = this.state;
    const { floorID, coordinates } = gatewayPosition;
    const { x, y, ...rest } = fields;
    const postObject = {
      location: { floorID, coordinates },
      ...rest,
    };
    let actionResult = '';
    if (action === 'add') {
      actionResult = 'Added successfully';
    } else if (action === 'update') {
      actionResult = 'Edited successfully';
    } else {
      message.error('Oops! Something went wrong.');
      return;
    }
    if (dispatch) {
      dispatch({
        type: `dvaNetworkGateway/${action}`,
        payload: postObject,
        callback: (res: any) => {
          if (res.error) {
            message.error(res.message);
          } else {
            message.success(actionResult);
          }
        },
      });
    }
    handleModalVisible(action, false);
    this.clearPosition();
  };

  okHandle = () => {
    const { form, handleModalVisible } = this.props;
    const { action } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleUpdate(action, fieldsValue);
      handleModalVisible(action);
      this.clearPosition();
    });
  };

  cancelHandle = () => {
    const { handleModalVisible } = this.props;
    const { action } = this.state;
    handleModalVisible(action, false);
    this.clearPosition();
  };

  render() {
    const { form, dvaNetworkGateway } = this.props;
    const { gatewayGroup = [], updateModalValues = {}, updateModalVisible } =
      dvaNetworkGateway || {};
    const { action, gatewayPosition } = this.state;
    const positionX = updateModalValues.coordinates ? updateModalValues.coordinates[0] : null;
    const positionY = updateModalValues.coordinates ? updateModalValues.coordinates[1] : null;

    return (
      <Modal
        title={
          action === 'add'
            ? formatMessage({ id: 'networkSetting.gateway.dialog.add-device' })
            : formatMessage({ id: 'networkSetting.gateway.dialog.edit-device' })
        }
        width="80%"
        className={styles.updateModal}
        style={{ minWidth: '976px', maxWidth: '1360px' }}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        okText={formatMessage({
          id: 'networkSetting.gateway.dialog.button-submit',
        })}
      >
        <Form>
          {form.getFieldDecorator('id', {
            initialValue: updateModalValues.id,
          })(<Input type="hidden" />)}
          <div className={styles.updateForm}>
            <div className={styles.updateMap}>
              <div style={{ height: `calc(100% - 91px)` }}>
                <AMSSetMapPosition
                  mapProps={gatewayPosition}
                  onPositionClick={this.onPositionClick}
                />
              </div>
              <Row style={{ marginTop: 8 }}>
                <Col span={24}>
                  <Text>
                    <FormattedMessage
                      id="networkSetting.gateway.label.pick-point"
                      defaultMessage="Pick point in map"
                    />
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Form.Item
                    label={fieldLabels.coordinate_x}
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 15 }}
                  >
                    {form.getFieldDecorator('x', {
                      rules: [
                        {
                          required: true,
                          message: `${formatMessage({
                            id: 'networkSetting.gateway.placeholder.coordinate-x',
                          })}`,
                        },
                      ],
                      initialValue: positionX,
                      validateTrigger: 'onBlur',
                    })(
                      <InputNumber
                        style={{ width: 128 }}
                        placeholder={formatMessage({
                          id: 'networkSetting.gateway.placeholder.coordinate-x',
                        })}
                        onChange={value => {
                          this.changeMarkerPos('X', value);
                        }}
                      />,
                    )}
                    <Text style={{ marginLeft: 8 }}>
                      <FormattedMessage
                        id="networkSetting.gateway.label.meter"
                        defaultMessage="meter"
                      />
                    </Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={fieldLabels.coordinate_y}
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 15 }}
                  >
                    {form.getFieldDecorator('y', {
                      rules: [
                        {
                          required: true,
                          message: `${formatMessage({
                            id: 'networkSetting.gateway.placeholder.coordinate-y',
                          })}`,
                        },
                      ],
                      initialValue: positionY,
                      validateTrigger: 'onBlur',
                    })(
                      <InputNumber
                        style={{ width: 128 }}
                        placeholder={formatMessage({
                          id: 'networkSetting.gateway.placeholder.coordinate-y',
                        })}
                        onChange={value => {
                          this.changeMarkerPos('Y', value);
                        }}
                      />,
                    )}
                    <Text style={{ marginLeft: 8 }}>
                      <FormattedMessage
                        id="networkSetting.gateway.label.meter"
                        defaultMessage="meter"
                      />
                    </Text>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className={styles.updateItem}>
              <Form.Item label={fieldLabels.gatewayID}>
                {form.getFieldDecorator('gatewayID', {
                  rules: [
                    {
                      required: true,
                      pattern: /^(([0-9a-fA-F]{2}){6})$/,
                      message: `${formatMessage({
                        id: 'networkSetting.gateway.rule.gatewayID',
                      })}`,
                    },
                  ],
                  initialValue: updateModalValues.gatewayID,
                  validateTrigger: 'onBlur',
                })(
                  <Input
                    placeholder={formatMessage({
                      id: 'networkSetting.gateway.placeholder.gatewayID',
                    })}
                  />,
                )}
              </Form.Item>
              <Form.Item label={fieldLabels.groupName}>
                {form.getFieldDecorator('groupID', {
                  rules: [
                    {
                      required: true,
                      message: `${formatMessage({
                        id: 'networkSetting.gateway.placeholder.groupName',
                      })}`,
                    },
                  ],
                  initialValue: updateModalValues.groupID,
                  validateTrigger: 'onBlur',
                })(
                  <Select
                    placeholder={formatMessage({
                      id: 'networkSetting.gateway.placeholder.groupName',
                    })}
                  >
                    {gatewayGroup.map((item: GroupListItem) => (
                      <Option key={item.id}>{item.name}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label={fieldLabels.name}>
                {form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: `${formatMessage({
                        id: 'networkSetting.gateway.placeholder.gatewayName',
                      })}`,
                    },
                  ],
                  initialValue: updateModalValues.name,
                  validateTrigger: 'onBlur',
                })(
                  <Input
                    placeholder={formatMessage({
                      id: 'networkSetting.gateway.placeholder.gatewayName',
                    })}
                  />,
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

/* 连接数据流dvaNetworkGateway */
export default Form.create<UpdateFormProps>({ name: 'gateway_overview_update' })(
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
  )(CPNNetworkGatewayModal),
);
