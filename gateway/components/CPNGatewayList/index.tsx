import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Link } from 'umi';
import { message, Form, Input, Button, Badge } from 'antd';
import moment from 'moment';
import { stringify } from 'querystring';
import { FormComponentProps } from 'antd/es/form';
import { TableRowSelection, SorterResult } from 'antd/es/table';
import AMSTable, { AMSTableColumnProps } from '@/components/AMSTable';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { IStateType } from '../../model';
import { GatewayListItem, GatewayListPagination, GatewayListParams } from '../../data.d';
import styles from './index.less';

const gatewayStatus = [
  { text: 'Online', value: 'Online', color: '#52B51D' },
  { text: 'Offline', value: 'Offline', color: '#FE585A' },
  { text: 'Reboot', value: 'Reboot', color: '#F1C147' },
];

// 输入字段类型定义
export interface GatewayTableProps extends FormComponentProps {
  loading?: boolean;
  dispatch?: Dispatch;
  dvaNetworkGateway?: IStateType;
  handleModalVisible: (modal: string, flag?: boolean, record?: Partial<GatewayListItem>) => void;
}

// 状态字段类型定义
interface GatewayTableState {
  selectedRowKeys: string[];
  tableParams: GatewayListParams;
}

/**
 * 转化成带参url
 * @param parameter 参数
 * @param id 参数
 * @return string
 */
const getLinkUrl = (parameter: string, id: string) => {
  const queryObj = {
    type: 'gateway',
    parameter,
    id: [id],
  };
  const urlParams = stringify(queryObj);
  const linkUrl = `/networkSetting/status?${urlParams}`;
  return linkUrl;
};

/**
 * 将对象转化成字符串
 * @param obj 对象
 * @return string
 */
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 封装CPNNetworkGatewayList组件
class CPNNetworkGatewayList extends Component<GatewayTableProps, GatewayTableState> {
  /**
   * table页签中表格列的设置项
   */
  gatewayColumns: AMSTableColumnProps<GatewayListItem>[] = [
    {
      title: <FormattedMessage id="networkSetting.gateway.table.id" defaultMessage="Gateway ID" />,
      dataIndex: 'gatewayID',
      width: 160,
      sorter: true,
      ellipsis: false,
      priority: 1,
      render: (text, record) => {
        const { handleModalVisible } = this.props;
        return <a onClick={() => handleModalVisible('update', true, record)}>{text}</a>;
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.name" defaultMessage="Name" />,
      dataIndex: 'name',
      width: 160,
      sorter: true,
      ellipsis: false,
      priority: 2,
      render: (text, record) => {
        const { handleModalVisible } = this.props;
        return <a onClick={() => handleModalVisible('update', true, record)}>{text}</a>;
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.group" defaultMessage="Group" />,
      dataIndex: 'groupName',
      width: 160,
      sorter: true,
      priority: 3,
      render(text, record) {
        return record.groupName ? text : '-';
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.status" defaultMessage="Status" />,
      dataIndex: 'status',
      width: 100,
      filterMultiple: false,
      filters: gatewayStatus,
      ellipsis: false,
      priority: 4,
      render(text, record) {
        for (let i = 0; i < gatewayStatus.length; i += 1) {
          if (record.status === gatewayStatus[i].value) {
            return <Badge color={gatewayStatus[i].color} text={gatewayStatus[i].text} />;
          }
        }
        return '-';
      },
    },
    {
      title: (
        <FormattedMessage id="networkSetting.gateway.table.version" defaultMessage="Version" />
      ),
      dataIndex: 'version',
      width: 120,
      align: 'right',
      sorter: true,
      ellipsis: false,
      priority: 5,
      render(text, record) {
        return record.version ? text : '-';
      },
    },
    {
      title: (
        <FormattedMessage id="networkSetting.gateway.table.location" defaultMessage="Location" />
      ),
      dataIndex: 'location',
      minWidth: 160,
      sorter: true,
      priority: 6,
      render(text, record) {
        return record.location ? text : '-';
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.cpu" defaultMessage="CPU" />,
      dataIndex: 'cpu',
      width: 100,
      align: 'right',
      sorter: true,
      priority: 7,
      render(text, record) {
        return record.cpu ? <Link to={getLinkUrl('CPU', record.id)}>{`${record.cpu}%`}</Link> : '-';
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.ram" defaultMessage="RAM" />,
      dataIndex: 'ram',
      width: 100,
      align: 'right',
      sorter: true,
      priority: 8,
      render(text, record) {
        return record.ram ? <Link to={getLinkUrl('RAM', record.id)}>{`${record.ram}%`}</Link> : '-';
      },
    },
    {
      title: <FormattedMessage id="networkSetting.gateway.table.prr" defaultMessage="PRR" />,
      dataIndex: 'prr',
      width: 100,
      align: 'right',
      sorter: true,
      priority: 9,
      render(text, record) {
        return record.prr ? <Link to={getLinkUrl('PRR', record.id)}>{`${record.prr}%`}</Link> : '-';
      },
    },
    {
      title: (
        <FormattedMessage id="networkSetting.gateway.table.date" defaultMessage="Last Seen On" />
      ),
      dataIndex: 'time',
      width: 200,
      sorter: true,
      priority: 10,
      render(text, record) {
        return record.time ? moment(record.time).fromNow() : '-';
      },
    },
  ];

  state = {
    selectedRowKeys: [],
    tableParams: {},
  };

  /** 生命周期，所有组件渲染后被触发 */
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/fetch',
      });
    }
  }

  /** 生命周期，在组件接受新的props之前触发 */
  componentWillReceiveProps(nextProps: GatewayTableProps) {
    const { dvaNetworkGateway: oldGateway } = this.props;
    const { selectedRows: oldValue = [] } = oldGateway || {};
    const { dvaNetworkGateway: newGateway } = nextProps;
    const { selectedRows: newValue = [] } = newGateway || {};
    if (oldValue !== newValue) {
      const selectedRowKeys = newValue.map(item => item.id);
      this.setState({
        selectedRowKeys,
      });
    }
  }

  /**
   * 生命周期，此方法在组件被卸载前调用
   */
  componentWillUnmount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/clear',
      });
    }
  }

  /**
   * 监听表格变化后重新请求API
   * @param pagination 分页参数
   * @param filtersArg 过滤筛选参数
   * @param sorter 排序参数
   */
  handleGatewayTableChange = (
    pagination: Partial<GatewayListPagination>,
    filtersArg: Partial<Record<keyof GatewayListItem, string[]>>,
    sorter: SorterResult<GatewayListItem>,
  ) => {
    const { dispatch, dvaNetworkGateway } = this.props;
    const { searchOpt = '' } = dvaNetworkGateway || {};
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<GatewayListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      search: searchOpt,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/fetch',
        payload: params,
        callback: () => {
          const { search, ...rest } = params;
          this.setState({ tableParams: rest });
        },
      });
    }
  };

  /**
   * 处理table选中变化时selectedRows值
   */
  handleRowSelectChange: TableRowSelection<GatewayListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: GatewayListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/save',
        payload: { selectedRows },
      });
    }
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  /**
   * 处理搜索操作
   */
  handleSearch = (value: string) => {
    const { dispatch } = this.props;
    const { tableParams } = this.state;
    const formValue: { [key: string]: string | number } = {};
    if (value) formValue.search = value;
    const values = {
      ...tableParams,
      ...formValue,
      currentPage: 1, // 搜索时重置页码
    };
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/fetch',
        payload: values,
        callback: () => {
          dispatch({
            type: 'dvaNetworkGateway/save',
            payload: { searchOpt: value, selectedRows: [] },
          });
        },
      });
    }
  };

  /**
   * 处理删除操作
   */
  handRemove = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaNetworkGateway/remove',
        payload: { id: [id] },
        callback: (res: any) => {
          if (res.error) {
            message.error(res.message);
          } else {
            message.success('successfully deleted');
          }
        },
      });
    }
  };

  /* 编辑按钮回调函数 */
  editButtonClick = (record: GatewayListItem) => {
    const { handleModalVisible } = this.props;
    handleModalVisible('update', true, record);
  };

  /* 删除按钮回调函数 */
  deleteButtonClick = (record: GatewayListItem) => {
    this.handRemove(record.id);
  };

  render() {
    const { dvaNetworkGateway, loading, handleModalVisible } = this.props;
    const { gatewayData } = dvaNetworkGateway || {};
    const { list = [], pagination } = gatewayData || {};
    const { selectedRowKeys = [] } = this.state;

    // 分页参数
    const paginationProps = {
      defaultCurrent: 1,
      defaultPageSize: 20,
      showLessItems: true,
      pageSizeOptions: ['20', '50', '100'],
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    // 选择列，行选择参数
    const rowSelection: TableRowSelection<GatewayListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div className={styles.standardTable}>
        <AMSTable<GatewayListItem>
          expandedBar={() => (
            <>
              <Button
                icon="plus"
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleModalVisible('add', true)}
              >
                <FormattedMessage id="networkSetting.gateway.table.add" defaultMessage="Add" />
              </Button>
              <Button
                type="default"
                style={{ marginRight: 8 }}
                disabled={!selectedRowKeys.length}
                onClick={() => handleModalVisible('reboot', true)}
              >
                <FormattedMessage
                  id="networkSetting.gateway.button.reboot"
                  defaultMessage="Reboot"
                />
              </Button>
              <Button
                type="default"
                style={{ marginRight: 8 }}
                onClick={() => handleModalVisible('upgrade', true)}
              >
                <FormattedMessage id="networkSetting.gateway.button.upgrade" defaultMessage="OTA" />
              </Button>
              <Input.Search
                allowClear
                className={styles.input}
                onSearch={this.handleSearch}
                placeholder={formatMessage({
                  id: 'networkSetting.gateway.placeholder.search',
                  defaultMessage: 'GW ID/Name/Location',
                })}
              />
            </>
          )}
          toolBarRender={() => []}
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          AMSTableColumnProps={this.gatewayColumns}
          editButtonOnClick={this.editButtonClick}
          deleteButtonOnClick={this.deleteButtonClick}
          onChange={this.handleGatewayTableChange}
        />
      </div>
    );
  }
}

/* 连接数据流dvaNetworkGateway */
export default Form.create<GatewayTableProps>({ name: 'gateway_table' })(
  connect(
    ({
      dvaNetworkGateway,
      loading,
    }: {
      dvaNetworkGateway: IStateType;
      loading: { effects: { [key: string]: boolean } };
    }) => ({
      dvaNetworkGateway,
      loading: loading.effects['dvaNetworkGateway/fetch'],
    }),
  )(CPNNetworkGatewayList),
);
