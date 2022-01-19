import React, { Component } from 'react';
import { Button, Input, Form, message, Dropdown, Menu, Icon, Badge, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import { TableProps, SorterResult, PaginationConfig } from 'antd/es/table';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import { GlobalModelState } from '@/models/global';
import AMSTable from '@/components/AMSTable';
import config from '@/../config/amsConfig';

import { stringify } from 'querystring';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { TagListParams, TagListItem, TagListPagination } from '../../data';
import { PSStateType } from '../../model';
import Guideconfig from './listGuide';
import styles from './index.less';

const { Search } = Input;

let { red, green } = config.statusColor || {};
if (!red || !green) {
  [red, green] = ["#FE585A", "#52B51D"];
}

// 输入字段类型定义
export interface PSListProps extends FormComponentProps {
  dvaTagManagementOverview: PSStateType;
  global: GlobalModelState;
  dispatch: Dispatch<any>;
  loading: boolean;
}

// 状态字段类型定义
interface PSListState {
  modalValues?: TagListItem;
  selectedRowKeys: string[];
  search: string;
  tableChangeparams: Object;
}

// 定义导出tag条目最大的数量
const maxExport = 10000;

/**
* 将对象转化成字符串
* @param obj 对象
* @return string
*/
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 配置对齐方式
const tableTextAlign = {
  align: 'right'
};

// 配置列宽度
const tableColumnsWidth = {
  min: 100,
  middle: 120,
  long: 160,
  max: 200
};

/** 封装CPNTagManagementList组件 */
class CPNTagManagementList extends Component<PSListProps, PSListState, FormComponentProps> {
  state: PSListState = {
    tableChangeparams: {},
    selectedRowKeys: [],
    search: '',
  };

  /** table页签中表格列的设置项 */
  tagColumns = [
    {
      title: <FormattedMessage id="networkSetting.tag.table.tag-id" defaultMessage="Tag ID" />,
      dataIndex: 'tagID',
      key: 'id',
      sorter: true,
      fixed: false,
      ellipsis: false,
      priority: 1,
      render(val: number) {
        return val;
      },
      minWidth: tableColumnsWidth.long,
      // ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: <FormattedMessage id="networkSetting.tag.table.tag-status" defaultMessage="Name" />,
      dataIndex: 'status',
      sorter: false,
      ellipsis: false,
      filterMultiple: false,
      priority: 3,
      filters: [
        {
          text: 'Online',
          value: 'Online',
        },
        {
          text: 'Offline',
          value: 'Offline',
        },
      ],
      render: (text?: string, record: TagListItem) => {
        const tagStatusColor = record.status === 'Online' ? green : red;
        return (<>
          <Badge color={tagStatusColor} />{record.status}
        </>)
      },
      width: tableColumnsWidth.middle,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: <FormattedMessage id="networkSetting.tag.table.tag-version" defaultMessage="Version" />,
      dataIndex: 'version',
      filterMultiple: false,
      sorter: true,
      ellipsis: false,
      priority: 4,
      render(val: number) {
        return val || '-';
      },
      width: tableColumnsWidth.middle,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: <FormattedMessage id="networkSetting.tag.table.tag-battery" defaultMessage="Battery" />,
      dataIndex: 'battery',
      sorter: true,
      filterMultiple: false,
      priority: 5,
      render(text: string, record: TagListItem) {
        return record.battery ? `${record.battery}V` : '-';
      },
      width: tableColumnsWidth.middle,
      ...tableTextAlign,
      className: styles.columnsCtr
    },

    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-tx" defaultMessage="Tx power" />
      ),
      dataIndex: 'txPower',
      sorter: true,
      priority: 2,
      render(val: string, record: TagListItem) {
        return record.txPower ? `${Math.round(record.txPower)}dBm` : '-';
      },
      width: tableColumnsWidth.middle,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-rssi" defaultMessage="RSSI" />
      ),
      dataIndex: 'rssi',
      priority: 6,
      sorter: true,
      render(text: number, record: TagListItem) {
        return record.rssi ? `${Math.round(record.rssi)}dBm` : '-';
      },
      width: tableColumnsWidth.min,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-prr" defaultMessage="PRR" />
      ),
      dataIndex: 'prr',
      priority: 7,
      sorter: true,
      render(val: string, record: TagListItem) {
        return record.prr ? `${Math.round(record.prr)}%` : '-';
      },
      width: tableColumnsWidth.min,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-broadcast" defaultMessage="Broadcast intval" />
      ),
      dataIndex: 'broadcastInterval',
      priority: 10,
      sorter: true,
      render(val: string, record: TagListItem) {
        return record.broadcastInterval ? `${Math.round(record.broadcastInterval)}s` : '-';
      },
      width: tableColumnsWidth.max,
      ...tableTextAlign,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-ota" defaultMessage="OTA intval" />
      ),
      dataIndex: 'otaInterval',
      sorter: true,
      priority: 9,
      render(val: string, record: TagListItem) {
        return record.otaInterval ? `${Math.round(record.otaInterval)} mins` : '-';
      },
      ...tableTextAlign,
      width: tableColumnsWidth.long,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-uptime" defaultMessage="Update time" />
      ),
      priority: 8,
      dataIndex: 'time',
      sorter: true,
      render(text?: number, record?: TagListItem) {
        return record && record.time > 0 ? <span>{moment(Number(record.time)).fromNow()}</span> : '-';
      },
      ...tableTextAlign,
      width: tableColumnsWidth.max,
      className: styles.columnsCtr
    },
    {
      title: (
        <FormattedMessage id="networkSetting.tag.table.tag-desc" defaultMessage="Description" />
      ),
      dataIndex: 'description',
      priority: 11,
      // ellipsis: false,
      sorter: true,
      render(text?: string) {
        return text || '-';
      },

      ...tableTextAlign,
      width: tableColumnsWidth.long,
      className: styles.columnsCtr
    },
  ];

  // 获取所有组列表
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dvaTagManagementOverview/fetchGatewayGroup',
    });
  }

  /**
   * 监听表格变化后重新请求API
   * @param pagination 分页参数
   * @param filtersArg 过滤筛选参数
   * @param sorter 排序参数
   */
  handleStandardTableChange = (
    pagination: Partial<TagListPagination>,
    filtersArg: Record<keyof TagListItem, string[]>,
    sorter: SorterResult<TagListItem>,
  ) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TagListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      search,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.setState({
      tableChangeparams: {
        sorter: params.sorter,
        nfilter: filters,
      }
    })
    dispatch({
      type: 'dvaTagManagementOverview/fetch',
      payload: params,
    });
  };

  /**
   * 监听表格变化后重新请求API
   * @param pagination 分页参数
   * @param filtersArg 过滤筛选参数
   * @param sorter 排序参数
   * @param rest 其余参数
   */
  handleTableChange: TableProps<TagListItem>['onChange'] = (
    pagination,
    filters,
    sorter,
  ) => {
    this.handleStandardTableChange(pagination, filters, sorter);
  };

  reflushButtonClick = (pagination: PaginationConfig, filters: Partial<Record<keyof TagListItem, string[]>>, sorter: SorterResult<TableListItem>) => {
    this.handleStandardTableChange(pagination, filters, sorter);
  }

  // 点击搜索交互控制
  SearchOnChange = (e: any) => {
    const { dispatch, form } = this.props;
    const { tableChangeparams } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFieldsValue = fieldsValue;
      if (e === '') {  // 清空搜索框时触发
        newFieldsValue.search = '';
      }

      this.setState({
        search: newFieldsValue.search
      })

      newFieldsValue.sorter = tableChangeparams.sorter || '';
      // newFieldsValue.status = tableChangeparams.nfilter ? tableChangeparams.nfilter.status : ''; // 没有必要赋值到state,filter已经包含
      if (tableChangeparams.nfilter) {
        const fKey = Object.keys(tableChangeparams.nfilter);
        newFieldsValue[fKey[0]] = tableChangeparams.nfilter[fKey[0]];
      }

      dispatch({
        type: 'dvaTagManagementOverview/fetch',
        payload: newFieldsValue,
        callback: (res: any) => {
          if (res.err) {
            message.error(formatMessage({ id: 'networkSetting.tag.table.search.fail' }), 5);
          } else {
            // message.success(formatMessage({ id: 'networkSetting.tag.table.search.success' }));
          }
        },
      });

      dispatch({
        type: 'dvaTagManagementOverview/save',
        payload: {
          tableChangeparams,
          ...newFieldsValue
        },
      });
    });
  }

  // 键盘点击enter按键进行搜索
  SearchOnEnter = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dvaTagManagementOverview/fetch',
        payload: fieldsValue,
        callback: (res: any) => {
          if (res.err) {
            message.error(formatMessage({ id: 'networkSetting.tag.table.search.fail' }), 5);
          } else {
            // message.success(formatMessage({ id: 'networkSetting.tag.table.search.success' }));
          }
        },
      });
    });
  }

  // 显示输入框
  handleConfigModalVisible = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        configModalVisible: !!flag,
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  };

  // 显示添加tag表单
  handleAddtagModalVisible = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        updateModalVisible: flag,
        modalValues: {}
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  };

  // 显示Tag编辑表单
  editButtonClick = (record: TagListItem) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        updateModalVisible: true,
        modalValues: record || {},
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  };

  // OTA模态框控制
  handleOTAModalVisible = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        OTAModalVisible: !!flag,
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  };

  // 删除Tag
  deleteButtonClick = (record: TagListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dvaTagManagementOverview/tagDelete',
      payload: {
        id: record.id
      },
      callback: (res: any) => {
        if (res.err) {
          message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
        } else {
          message.success(formatMessage({ id: 'networkSetting.tag.form.action.success' }));
          dispatch({
            type: 'dvaTagManagementOverview/fetch',
            payload: {},
          });
        }

      },
    });
    // message.info(`item ${record.tagID} button delete was clicked!`);
  };

  // 导入数据模态框
  handleImportModalVisible = (falg?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload: {
          importModalVisible: !!falg,
        }
      });
    }
  }

  //  批量删除tags
  handleDeleteTagsByChecked = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0 && dispatch) {
      dispatch({
        type: 'dvaTagManagementOverview/tagDelete',
        payload: {
          id: selectedRowKeys
        },
        callback: (res: any) => {
          if (res.err) {
            message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
          } else {
            message.success(formatMessage({ id: 'networkSetting.tag.form.action.success' }));
            this.startResetChecked();
            dispatch({
              type: 'dvaTagManagementOverview/fetch',
              payload: {},
            });
          }
        },
      });
    } else {
      message.warning(formatMessage({ id: 'networkSetting.tag.form.action.delete-empty-checked' }));
    }
  }

  // 下拉菜单事件监听
  handleDropDownAction = e => {
    const actionType = e.key;
    if (actionType === 'export') {
      this.getExportTagDoc();
    } else if (actionType === 'import') {
      this.handleImportModalVisible(true);
    } else if (actionType === 'configure') {
      this.handleConfigModalVisible(true);
    } else if (actionType === 'ota') {
      this.handleOTAModalVisible(true);
    } else if (actionType === 'del') {
      // this.handleDeleteTagsByChecked(); // 删除已经选择的tag
    }
  }

  // 下载该条件下的tag数据记录
  getExportTagDoc = () => {
    const { tableChangeparams: { nfilter, sorter }, search } = this.state;
    const sorterStr = { orderBy: '', order: '' }; // 有排序字段传入
    if (sorter) {
      const [orderBy, order] = sorter.split('_');
      sorterStr.orderBy = orderBy;
      sorterStr.order = order.replace('end', ''); // 取到order原本为descend与ascend,需转换成desc和asc来请求
    }
    const queryObj = {
      search,
      ...nfilter,
      ...sorterStr
    }
    const queryStr = stringify(queryObj);
    window.location.href = `/device/tag/export?${queryStr}`;
  };

  // 选择的tag写入state
  handleRowSelectChange = (selectedRowKeys: string[]) => {
    this.setState({
      selectedRowKeys
    })
  }

  // 复选框重置
  startResetChecked = () => {
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
      });
    }, 500);
  };

  // 引导层控制
  closeTour = () => {
    // this.setState({ isTourOpen: false });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/saveGuideStatus',
        payload: {
          guideStatus: false,
        },
      });
    }
  };

  // 控制弹出引导层与系统本身页面滚动保持对应关系
  disableBody = (target: any) => disableBodyScroll(target);

  enableBody = (target: any) => enableBodyScroll(target);

  render() {
    const {
      // loading,
      dvaTagManagementOverview,
      global,
      form,
    } = this.props;


    const { selectedRowKeys } = this.state;
    const { tagList } = dvaTagManagementOverview;
    const { list = [], pagination = {} } = tagList || {};


    const { guideStatus = false } = global;
    const routePath = this.props.route.path || '';

    // 分页设置
    const paginationConfig = {
      showTotal: (total: number) => `Total ${total} items`,
      defaultCurrent: 1,
      defaultPageSize: 20,
      showLessItems: true,
      pageSizeOptions: ['20', '50', '100'],
      showSizeChanger: true,
      showQuickJumper: false,
      ...pagination,
    };

    const { total } = pagination;
    // 选择行选择参数
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    // 自适应叠加操作按钮
    const ActionSubMenu = (
      <Menu onClick={this.handleDropDownAction} >
        {(total < maxExport) && <Menu.Item key="export" >
          <FormattedMessage
            id="networkSetting.tag.overview.action.export"
            defaultMessage="Export"
          />
        </Menu.Item>}
        <Menu.Item key="import" >
          <FormattedMessage
            id="networkSetting.tag.overview.action.import"
            defaultMessage="Import"
          />
        </Menu.Item>
        <Menu.Item key="configure">
          <FormattedMessage
            id="networkSetting.tag.overview.action.config"
            defaultMessage="Configure"
          />
        </Menu.Item>
        <Menu.Item key="ota">
          <FormattedMessage
            id="networkSetting.tag.overview.action.ota"
            defaultMessage="OTA"
          />
        </Menu.Item>
        <Menu.Item key="del" disabled={selectedRowKeys.length < 1}>
          {
            selectedRowKeys.length > 0 ? (<Popconfirm
              placement="left"
              okType="danger"
              arrowPointAtCenter
              title={<FormattedMessage
                id="networkSetting.tag.checked.del"
                defaultMessage="Sure to delete?"
              />}
              onConfirm={this.handleDeleteTagsByChecked}
            >
              <a>
                <FormattedMessage
                  id="networkSetting.tag.overview.action.delete"
                  defaultMessage="Delete"
                />
              </a>
            </Popconfirm>) : (<FormattedMessage
              id="networkSetting.tag.overview.action.delete"
              defaultMessage="Delete"
            />)
          }
        </Menu.Item>
      </Menu >
    );

    // 容器高度
    // const divCardHeight = document.body.offsetHeight - 240;
    return (
      <>
        {routePath === '/networkSetting/tag/overview' && <Tour
          onRequestClose={this.closeTour}
          steps={Guideconfig}
          isOpen={guideStatus}
          className="helper"
          rounded={5}
          showNumber={false}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
          id={1}
          startAt={0}
        />}
        <div id="networksetting-tag-overview-list" className={styles.standardTable}>
          <AMSTable<TagListItem>
            rowKey={(record: any) => record.id}
            // rowSelection={rowSelection}
            {...this.props}
            toolBarRender={() => [
              <Button className={styles.actionButton} data-id="tag-add-button" icon="plus-circle" type="primary" onClick={() => this.handleAddtagModalVisible(true)}>
                <FormattedMessage id="networkSetting.tag.overview.action.add" defaultMessage="Add" />
              </Button>,
              <Dropdown
                overlay={ActionSubMenu}
              >
                <Button data-id="tag-select-button">
                  <FormattedMessage id="networkSetting.tag.overview.action" defaultMessage="Action" />
                  <Icon type="down" />
                </Button>
              </Dropdown>
            ]}
            expandedBar={() => (
              <div className={styles.tagInputSearch} data-id="tag-search-button">
                <Form layout="inline" onSubmit={this.SearchOnEnter}>
                  <Form.Item>
                    {form.getFieldDecorator('search', {
                      rules: [
                        {
                          required: false,
                          message: formatMessage({ id: 'networkSetting.tag.require.table-list-search' }),
                        },
                      ],
                    })(
                      <Search
                        allowClear
                        placeholder={formatMessage({ id: 'networkSetting.tag.placeholder.table-list-search' })}
                        style={{ width: 292 }}
                        onSearch={this.SearchOnChange}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                </Form>
              </div>
            )}

            dataSource={list}
            pagination={paginationConfig}
            AMSTableColumnProps={this.tagColumns}
            reflushButtonOnclick={this.reflushButtonClick}
            onChange={this.handleTableChange}
            actionColumnHidden={false}
            editButtonOnClick={this.editButtonClick}
            deleteButtonOnClick={this.deleteButtonClick}
            rowSelection={rowSelection}
          // tableParentWidth={800}
          />
        </div>
      </>
    );
  }
}

/* 连接数据流 */
export default Form.create<PSListProps>({ name: 'tag-manegment-list' })(
  connect(
    ({
      dvaTagManagementOverview,
      global,
      loading,
    }: {
      dvaTagManagementOverview: PSStateType;
      global: GlobalModelState;
      loading: { effects: { [key: string]: boolean } };
    }) => ({
      dvaTagManagementOverview,
      global,
      loading: loading.effects['dvaTagManagementOverview/fetch'],
    }),
  )(CPNTagManagementList)
);
