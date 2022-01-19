/* eslint-disable import/no-extraneous-dependencies */
import { Table, Icon, Form, Card, Modal, Upload, message, Input, Tabs, Button } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { FormComponentProps } from 'antd/es/form';
import * as XLSX from 'xlsx';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import guideTemplateConfig from './templateGuide';
import guideImportConfig from './importGuide';

import { TagListItem } from '../../data';
import { PSStateType } from '../../model'
import { getModalBodyHeight } from '@/utils/utils';
import styles from './index.less';
/* eslint-enable */
const FormItem = Form.Item;
const { TabPane } = Tabs;
const maxResult = 10000;

// 用到的props 
interface ImportFormProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  dvaTagManagementOverview?: PSStateType;
}

// 状态字段类型定义
interface ImportFormState {
  uploading: boolean;
  selectedRowKeys: string[];
  importDataList: any;
  okButtonDisabled: boolean;
  subStatus: boolean;
  editing: boolean;
  editingKey: string;
  isTourTemplateOpen: boolean;
  isTourImportOpen: boolean;
  tabCurrentKey: number;       // 根据切换的面板类型确定提示内容
}

// 导入的文档在线编辑功能
const { Provider, Consumer } = React.createContext();
class EditImportTableCell extends React.Component {

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      Inputs,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    return (
      <td {...restProps} className='my-cell-td'>
        {editing && (
          dataIndex === 'tagID'
            ? <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [{
                  required: true,
                  message: `${formatMessage({
                    id: 'networkSetting.tag.require.tag-id',
                  })}`,
                },
                {
                  len: 6,
                  message: `${formatMessage({
                    id: 'networkSetting.tag.require.tagid.len',
                  })}`,
                }],
                initialValue: record[dataIndex] === '-' ? '' : record[dataIndex].replace(/,/g, ''),
              })(
                <Input />
              )}
            </Form.Item>
            : <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  /* { 
                  required: true,
                  pattern: new RegExp(/^\d+\.?(\d{1,2})?$/),
                  message: `内容格式不符合!` 
                  } */
                ],
                initialValue: record[dataIndex],
              })(
                <Input />
              )}
            </Form.Item >
        )}
        {!editing && (children)}
      </td >
    );
  };

  render() {
    return <Consumer>{this.renderCell}</Consumer>;
  }
}


/* 连接dvaTagManagementOverview */
/*
@connect((
  { dvaTagManagementOverview }:
    { dvaTagManagementOverview: PSStateType }) => ({
      dvaTagManagementOverview,
    }))
*/
/**  封装ImportForm组件 */
class ImportForm extends Component<ImportFormProps, ImportFormState> {
  state: ImportFormState = {
    uploading: false,
    selectedRowKeys: [],
    importDataList: [],
    okButtonDisabled: true,
    subStatus: false,
    editingKey: '',
    isTourTemplateOpen: false,
    isTourImportOpen: false,
    tabCurrentKey: 1
  };

  tagImportColumns = [
    {
      title: <FormattedMessage id="networkSetting.tag.import-table.tagid" defaultMessage="tagID" />,
      dataIndex: 'tagID',
      editable: true,
      sorter: (a: Object, b: Object) => a.tagID.localeCompare(b.tagID),
      width: 120,
      render: (text: string, record: TagListItem) => <span>{record.tagID}</span>,
    },
    {
      title: <FormattedMessage id="networkSetting.tag.import-table.descripion" defaultMessage="description" />,
      dataIndex: 'description',

      editable: true,
      reder: (text: string, record: TagListItem) => <Fragment>{record.description}</Fragment>,
    },
    {
      title: (
        <FormattedMessage
          id="networkSetting.tag.table.tag-action"
          defaultMessage="Action"
        />
      ),
      key: 'operation',
      width: 120,
      render: (text: string, record: any) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return (<div>
          {
            this.editable(editable, editingKey, record)
          }
        </div>)
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaTagManagementOverview/fetchFullTags', // TagID有重复,则文档勾选按钮失效
        payload: maxResult,
      });
    }
  }

  isEditing = (record: { tagID: string }) => record.tagID === this.state.editingKey;

  editable = (editable?: boolean, editingKey?: string, record?: any) => {
    const ele = editable ? (
      <span style={{ display: 'block' }}>
        <Consumer>
          {
            (form: any) => (
              <a onClick={() => this.saveEditRow(form, record.tagID)} style={{ marginRight: 8 }}>
                <FormattedMessage id="networkSetting.tag.overview.import.action.save" defaultMessage="Save" />
              </a>
            )
          }
        </Consumer>
        <a onClick={this.cancelRowSave} ><FormattedMessage id="networkSetting.tag.overview.import.action.cancel" defaultMessage="Cancel" /> </a>
      </span>
    ) : (
        <>
          <a disabled={editingKey !== ''} onClick={() => this.editTableRow(record.tagID)}>
            <FormattedMessage id="networkSetting.tag.overview.import.action.edit" defaultMessage="Edit" />
          </a>
          <a onClick={() => this.deleteTableRow(record.tagID)} style={{ marginLeft: 6 }}>
            <FormattedMessage id="networkSetting.tag.overview.import.action.delete" defaultMessage="Delete" />
          </a>
        </>
      );
    return ele
  }

  // 文件上传后读取显示
  handleFileUploadShow = (file: File) => {
    this.setState({
      selectedRowKeys: [],
      okButtonDisabled: true
    })
    const self = this;
    const fileBin = file;
    const reader = new FileReader();
    reader.onload = function onload(e: any) {
      const datas = e.target.result;
      const workbook = XLSX.read(datas, {
        type: 'binary'
      });
      const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonArr = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });
      self.handleImpotedJson(jsonArr);

    };
    reader.readAsBinaryString(fileBin);
    return false;
  };

  // 上传数据整理及获取
  handleImpotedJson = (array: any) => {
    const { dvaTagManagementOverview } = this.props;
    const { fullTagList } = dvaTagManagementOverview;
    const { data } = fullTagList;
    const header = array[0];
    const newArray = [...array];
    const existTagKey: string[] = [];

    if (data.length > 0) {
      data.forEach((ele: any) => {
        existTagKey.push(ele.tagID);
      });
    }

    const tagPreg = /^[0-9a-fA-F]{6}$/i;
    newArray.splice(0, 1);

    const json = newArray.map((item: any, index: number) => {
      const newitem: any = {};
      newitem.key = index;
      item.forEach((ele: any, i: number) => {
        const newKey = header[i] || i;
        newitem[newKey] = ele;
      })

      newitem.red = false;

      if (existTagKey.includes(newitem.tagID) || tagPreg.test(newitem.tagID) === false) { // 无法勾选的条件
        newitem.red = true;
      }
      return newitem;
    });

    this.setState({
      importDataList: json,
    });
    return json;
  }

  // 提交导入操作
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch } = this.props
    const { selectedRowKeys, importDataList } = this.state;
    if (selectedRowKeys.length > 0 && importDataList.length > 0) {    // 有条目选中
      const importData = importDataList.filter(
        (it: any) => selectedRowKeys.includes(it.tagID)
      )
      if (importData.length > 0 && dispatch) {
        dispatch({
          type: 'dvaTagManagementOverview/tagAddList',
          payload: {
            total: importData.length,
            data: importData
          },
          callback: (res: any) => {
            /* 提交后关闭窗口改为刷新导入的列表数据
            dispatch({
              type: 'dvaTagManagementOverview/modalVisible',
              payload: {
                importModalVisible:false,
              },
            });
            */

            if (!res.err) {    // 无异常则刷新重置
              this.setState({
                selectedRowKeys: [],
                subStatus: false
              })
              message.success('Success');
              dispatch({
                type: 'dvaTagManagementOverview/fetch',
                payload: {},
              });
            }
          }
        });
      }
    }
  };

  // 取消关闭窗口
  handleCancel = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload: {
          importModalVisible: false,
        }
      });
    }
  };

  // 提交按钮状态控制
  onSelectChange = (selectedRowKeys?: any) => {
    const btnStatus = selectedRowKeys.length > 0;
    this.setState({
      subStatus: btnStatus,
      selectedRowKeys
    });
  };

  // 点击下载按钮,实现下载
  downLoadExcel = () => {
    window.open("/ams/imports/tagsImport.xls");
  }
  /*
  // 样式控制
  setNewClass = (record:any)=>{
      return record.red?styles.rowRed:'';
  }
 */

  // 编辑某行
  editTableRow = (key: string) => {
    this.setState({
      editingKey: key
    })
  }

  // 保存控制
  saveEditRow = (form: any, key: string) => {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return
      }
      this.setState(prev => {
        const newData = prev.importDataList;
        const index = newData.findIndex(item => item.tagID === key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
            red: false
          });
        }
        return { editingKey: '', "importDataList": newData };
      })
    })
  }

  // 不保存控制
  cancelRowSave = () => {
    this.setState({
      editingKey: ''
    })
  }

  // 删除table中导入的某行
  deleteTableRow = (key: any) => {
    this.setState(prev => ({
      importDataList: prev.importDataList.filter((ele: any) => ele.tagID !== key)
    })
    )
  }

  // 引导层控制
  closeTemplateTour = () => {
    this.setState({ isTourTemplateOpen: false });
  };

  openTemplateTour = () => {
    this.setState({ isTourTemplateOpen: true });
  };

  closeImportTour = () => {
    this.setState({ isTourImportOpen: false });
  };

  openImportTour = () => {
    this.setState({ isTourImportOpen: true });
  };

  disableBody = (target: any) => disableBodyScroll(target);

  enableBody = (target: any) => enableBodyScroll(target);

  render() {
    const { dvaTagManagementOverview } = this.props;
    const { importModalVisible } = dvaTagManagementOverview;
    const { uploading,
      selectedRowKeys,
      importDataList,
      okButtonDisabled,
      subStatus,
      isTourTemplateOpen,
      isTourImportOpen,
      tabCurrentKey
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record: any) => {
        if (record.red) {
          return { disabled: true }
        }
        return { disabled: false }
      }
    };

    const components = {
      body: {
        cell: EditImportTableCell,
      },
    };

    const columns = this.tagImportColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          Inputs: Input,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const maxHeight = getModalBodyHeight(676, false);
    const cardBodyStyle = {
      marginTop: -16,
      minHeight: 476,
      marginBottom: 8
    }
    return (
      <Modal
        title={<FormattedMessage id="networkSetting.tag.overview.form.import" defaultMessage="tagID" />}
        width={976}
        destroyOnClose
        visible={importModalVisible}
        okButtonProps={{ disabled: okButtonDisabled }}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        bodyStyle={{
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          padding: "16px  24px",
          maxHeight
        }}
        className={styles.modalImport}
        footer={null}
      >
        <Tour
          onRequestClose={this.closeTemplateTour}
          steps={guideTemplateConfig}
          isOpen={isTourTemplateOpen}
          className="helper"
          rounded={5}
          showNavigationScreenReaders={false}
          showNumber={false}
          showNavigation={false}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
        <Tour
          onRequestClose={this.closeImportTour}
          steps={guideImportConfig}
          isOpen={isTourImportOpen}
          className="helper"
          rounded={5}
          showNumber={false}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
        <p style={{ float: "right" }} onClick={tabCurrentKey === 1 ? this.openTemplateTour : this.openImportTour}>
          <Button type="primary" shape="round" icon="question-circle">
            Help
          </Button>
        </p>
        <Tabs onChange={(key: any) => {
          this.setState({
            tabCurrentKey: key
          })
        }}>
          <TabPane tab={<FormattedMessage id="networkSetting.tag.overview.import.template.tab-first" defaultMessage="Template" />} key="1">
            <Card bordered={false} bodyStyle={cardBodyStyle}>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{formatMessage({ id: "networkSetting.tag.overview.import.template.title" })}</p>
              <p style={{ fontSize: 14 }}><span className={styles.dotCircle} />{formatMessage({ id: "networkSetting.tag.overview.import.template.content" })}</p>
              <p style={{ fontSize: 14 }} ><Button type=" primary" guide-id="tag-export-template" style={{ marginLeft: '32px', marginTop: '4px' }} onClick={this.downLoadExcel}><FormattedMessage id="networkSetting.tag.overview.import.template.download" defaultMessage="Download" /></Button></p>
            </Card>
          </TabPane>

          <TabPane tab={<FormattedMessage id="networkSetting.tag.overview.import.template.tab-second" defaultMessage="Upload" />} key="2">
            <Card bordered={false} bodyStyle={cardBodyStyle}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem >
                  <div className={styles.textRow}>
                    <span style={{ fontWeight: 700 }}><FormattedMessage id="networkSetting.tag.overview.import.template.select.toupload" defaultMessage="Importing files" /></span>
                    <Upload
                      guide-id="tag-upload-button"
                      className={styles.uploadExcelBtn}
                      disabled={uploading}
                      beforeUpload={this.handleFileUploadShow}
                      accept=".xls,.xlsx,.csv"
                    >
                      <Icon guide-id="tag-upload-button" type={uploading ? 'loading' : 'upload'} />
                    </Upload>
                  </div>
                  <div className={styles.textRow}><span className={styles.dotCircle} /><FormattedMessage id="networkSetting.tag.overview.import.template.select.types" /></div>
                  <div className={styles.textRow}><span className={styles.dotCircle} /><FormattedMessage id="networkSetting.tag.overview.import.template.select.num" /></div>
                  <div className={styles.textRow}><span className={styles.dotCircle} /><FormattedMessage id="networkSetting.tag.overview.import.template.select.edit" /></div>
                </FormItem>

                <FormItem>

                  <Provider value={this.props.form}>
                    <Table
                      components={components}
                      loading={uploading}
                      rowKey={record => record.tagID}
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={importDataList}
                      pagination={false}
                      scroll={{ y: 300 }}
                      // rowClassName={this.setNewClass}
                      bordered
                    />
                  </Provider>
                </FormItem>
                <FormItem>
                  <div className={styles.footerAction}>
                    <Button guide-id="tag-cancel-button" htmlType="button" onClick={this.handleCancel}>
                      <FormattedMessage id="networkSetting.tag.overview.import.excel.btn.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button guide-id="tag-import-sub-button" type="primary" htmlType="submit" style={{ marginLeft: 8 }} disabled={!subStatus}>
                      <FormattedMessage id="networkSetting.tag.overview.dialog.button.upload" defaultMessage="Upload" />
                    </Button>
                  </div>
                </FormItem>
              </Form>
            </Card>
          </TabPane>
        </Tabs >
      </Modal >
    );
  }
}

export default Form.create<ImportFormProps>({ name: 'tag_import' })(connect((
  { dvaTagManagementOverview }:
    { dvaTagManagementOverview: PSStateType }) => ({
      dvaTagManagementOverview,
    }))(ImportForm));



