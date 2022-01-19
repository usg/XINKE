
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { PSStateType } from './model';
import CPNTagManagementList from './components/CPNTagManagementList';
import CPNTagManagementConfigModal from './components/CPNTagManagementConfigModal';
import CPNTagManagementUpdateModal from './components/CPNTagManagementUpdateModal';
import CPNTagManagementOTAModal from './components/CPNTagManagementOTAModal';
import CPNTagImportModal from './components/CPNTagImportModal';

/** 定义Props接口数据类型 */
interface TableListProps extends FormComponentProps {
  dvaTagManagementOverview: PSStateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

/** 定义State接口数据类型 */
interface TableListState {
  placeholder: string;
}

/** 封装组件TableList */
class tagOverviewList extends Component<TableListProps, TableListState> {

  // 加载过程中获取tag列表数据
  componentDidMount() {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'dvaTagManagementOverview/fetch',
      payload: {},
    });
  }

  // 页面显示
  render() {
    const { dvaTagManagementOverview } = this.props;
    const {
      configModalVisible,
      updateModalVisible,
      OTAModalVisible,
      importModalVisible
    } = dvaTagManagementOverview;

    return (
      <>
        <Card bordered={false}
          bodyStyle={{
            marginTop: 0,
            padding: '0 16px',
            minHeight:
              document.body.offsetHeight - 187 > 300 ? document.body.offsetHeight - 187 : 300,
          }}
        >
          <CPNTagManagementList
            {...this.props}
          />
        </Card>
        {configModalVisible && <CPNTagManagementConfigModal />}
        {updateModalVisible && <CPNTagManagementUpdateModal />}
        {OTAModalVisible && <CPNTagManagementOTAModal />}
        {importModalVisible && <CPNTagImportModal />}
      </>
    );
  }
}

/** 引用dav */
export default connect(
  ({
    dvaTagManagementOverview,
    loading,
  }: {
    dvaTagManagementOverview: PSStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    dvaTagManagementOverview,
    loading: loading.effects['dvaTagManagementOverview/fetch'],
  }),
)(tagOverviewList);
