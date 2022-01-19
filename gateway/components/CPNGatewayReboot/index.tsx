import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Typography, List, Modal, Checkbox, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { IStateType } from '../../model';
import { GatewayListItem } from '../../data';
import styles from './index.less';
import { getModalBodyHeight } from '@/utils/utils';

const { Text } = Typography;

// 输入字段类型定义
interface GatewayRebootProps {
  dispatch: Dispatch;
  dvaNetworkGateway?: IStateType;
  handleModalVisible: (modal: string, flag?: boolean, record?: Partial<GatewayListItem>) => void;
}

// 状态字段类型定义
interface GatewayRebootState {
  selectedRowIDs: string[];
}

// 封装CPNNetworkGatewayReboot组件
class CPNNetworkGatewayReboot extends Component<GatewayRebootProps, GatewayRebootState> {
  constructor(props: GatewayRebootProps) {
    super(props);
    const { dvaNetworkGateway } = props;
    const { selectedRows = [] } = dvaNetworkGateway || {};
    this.state = {
      selectedRowIDs: selectedRows.map(item => item.id),
    };
  }

  // 提交重启操作
  handleSubmit = () => {
    const { dispatch, handleModalVisible } = this.props;
    const { selectedRowIDs = [] } = this.state;
    dispatch({
      type: 'dvaNetworkGateway/reboot',
      payload: { id: selectedRowIDs },
      callback: (res: any) => {
        if (res.error) {
          message.error(res.message);
        } else {
          message.success('success reboot');
        }
        dispatch({
          type: 'dvaNetworkGateway/save',
          payload: { selectedRows: [] },
        });
        handleModalVisible('reboot', false);
      },
    });
  };

  // 关闭模态框清空选择操作
  handleCancel = () => {
    const { handleModalVisible, dispatch } = this.props;
    dispatch({
      type: 'dvaNetworkGateway/save',
      payload: { selectedRows: [] },
    });
    handleModalVisible('reboot', false);
  };

  onCheckboxChange = (checkedValues: any[]) => {
    this.setState({
      selectedRowIDs: checkedValues,
    });
  };

  render() {
    const { dvaNetworkGateway } = this.props;
    const { selectedRows = [], rebootModalVisible } = dvaNetworkGateway || {};
    const { selectedRowIDs = [] } = this.state;
    const okButtonDisabled = !selectedRowIDs.length;

    /**
     * @param conentHeight 模态框内容高度
     * @param hasModalFooter 是否含footer
     * @return number 模态框内容框可视高度
     */
    const maxHeight = getModalBodyHeight(286);

    return (
      <Modal
        title={formatMessage({
          id: 'networkSetting.gateway.dialog.reboot-device',
          defaultMessage: 'Gateway Reboot',
        })}
        width={416}
        className={styles.rebootModal}
        style={{ minWidth: '416px' }}
        bodyStyle={{ paddingTop: 16, paddingBottom: 16, maxHeight }}
        destroyOnClose
        visible={rebootModalVisible}
        okButtonProps={{ disabled: okButtonDisabled }}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText={formatMessage({
          id: 'networkSetting.gateway.dialog.button-submit',
          defaultMessage: 'Confirm',
        })}
      >
        <Text>
          <FormattedMessage
            id="networkSetting.gateway.label.select-gateway"
            defaultMessage="Select Gateway"
          />
        </Text>
        <Checkbox.Group
          style={{
            width: '100%',
            minHeight: '228px',
            padding: '24px',
            border: '1px solid #ddd',
          }}
          defaultValue={selectedRowIDs}
          onChange={this.onCheckboxChange}
        >
          <List
            grid={{ gutter: 16, xs: 2, sm: 2 }}
            dataSource={selectedRows}
            renderItem={item => (
              <List.Item>
                <Checkbox value={item.id}>{item.gatewayID}</Checkbox>
              </List.Item>
            )}
          />
        </Checkbox.Group>
      </Modal>
    );
  }
}

export default connect(({ dvaNetworkGateway }: { dvaNetworkGateway: IStateType }) => ({
  dvaNetworkGateway,
}))(CPNNetworkGatewayReboot);
