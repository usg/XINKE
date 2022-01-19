import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Card, message } from 'antd';
import CPNNetworkGatewayList from './components/CPNGatewayList';
import CPNNetworkGatewayModal from './components/CPNGatewayModal';
import CPNNetworkGatewayOTA from './components/CPNGatewayOTA';
import CPNNetworkGatewayReboot from './components/CPNGatewayReboot';
import { GatewayListItem } from './data.d';
import { IStateType } from './model';

/** 定义Props接口数据类型 */
interface GatewayListProps {
  dvaNetworkGateway: IStateType;
  dispatch: Dispatch<any>;
}

/** 封装组件GatewayList */
class GatewayList extends Component<GatewayListProps> {
  /**
   * 处理模态框可见状态
   */
  handleModalVisible = (modal: string, flag?: boolean, record?: Partial<GatewayListItem>) => {
    const { dispatch } = this.props;
    let payload = {};
    if (modal === 'add') {
      payload = {
        updateModalVisible: !!flag,
        updateModalValues: {},
      };
    } else if (modal === 'update') {
      payload = {
        updateModalVisible: !!flag,
        updateModalValues: record || {},
      };
    } else if (modal === 'upgrade') {
      payload = {
        upgradeModalVisible: !!flag,
      };
    } else if (modal === 'reboot') {
      payload = {
        rebootModalVisible: !!flag,
      };
    } else {
      message.error('Oops! Something went wrong.');
      return;
    }
    dispatch({
      type: 'dvaNetworkGateway/modalVisible',
      payload,
    });
  };

  render() {
    const { dvaNetworkGateway } = this.props;

    const {
      updateModalVisible = false,
      upgradeModalVisible = false,
      rebootModalVisible = false,
    } = dvaNetworkGateway;

    return (
      <>
        <Card
          bordered={false}
          bodyStyle={{
            marginTop: 0,
            padding: '0 16px',
            minHeight:
              document.body.offsetHeight - 187 > 300 ? document.body.offsetHeight - 187 : 300,
          }}
        >
          <CPNNetworkGatewayList handleModalVisible={this.handleModalVisible} />
        </Card>
        {updateModalVisible && (
          <CPNNetworkGatewayModal handleModalVisible={this.handleModalVisible} />
        )}
        {upgradeModalVisible && (
          <CPNNetworkGatewayOTA handleModalVisible={this.handleModalVisible} />
        )}
        {rebootModalVisible && (
          <CPNNetworkGatewayReboot handleModalVisible={this.handleModalVisible} />
        )}
      </>
    );
  }
}

export default connect(({ dvaNetworkGateway }: { dvaNetworkGateway: IStateType }) => ({
  dvaNetworkGateway,
}))(GatewayList);
