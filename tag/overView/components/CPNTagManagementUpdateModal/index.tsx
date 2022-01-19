
import React, { Component } from 'react';
import { Input, Form, message, Modal, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Guideconfig from './updateGuide';
import { PSStateType } from '../../model';
import styles from './index.less';

const { TextArea } = Input;

// 表单标签的字段及全球化
const fieldLabels = {
  gatewayGroup: formatMessage({ id: 'networkSetting.tag.form.tag-group' }),
  deviceid: formatMessage({ id: 'networkSetting.tag.form.tag-id' }),
  status: formatMessage({ id: 'networkSetting.tag.form.tag-status' }),
  desc: formatMessage({ id: 'networkSetting.tag.form.tag-desc' }),
  name: formatMessage({ id: 'networkSetting.tag.table.tag-name' }),
  product: formatMessage({ id: 'networkSetting.tag.table.tag-product' }),
  description: formatMessage({ id: 'networkSetting.tag.table.tag-description' }),
};

// 输入字段类型定义
interface ConfigFormProps extends FormComponentProps {
  dvaTagManagementOverview?: PSStateType;
  dispatch?: Dispatch<any>;
}

interface updateState {
  isTourOpen: boolean
}

/** 封装UpdateForm组件 */
class ConfigForm extends Component<ConfigFormProps, updateState> {
  state = {
    isTourOpen: false
  }

  // 关闭Tag操作框
  handleClosedTagModalVisible = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      const payload = {
        updateModalVisible: !flag,
      };
      dispatch({
        type: 'dvaTagManagementOverview/modalVisible',
        payload,
      });
    }
  }

  // 添加或编辑tag操作控制
  addTagHandle = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {

      if (err) return;
      if (dispatch) {
        if (fieldsValue.id) {
          dispatch({
            type: 'dvaTagManagementOverview/tagUpdate',
            payload: fieldsValue,
            callback: (res: any) => {
              if (res.err) {
                // message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
              } else {
                message.success(formatMessage({ id: 'networkSetting.tag.form.action.success' }));
              }
            },
          });
        } else {
          dispatch({
            type: 'dvaTagManagementOverview/tagAdd',
            payload: fieldsValue,
            callback: (res: any) => {

              if (res.err) {
                // message.error(formatMessage({ id: 'networkSetting.tag.form.action.fail' }), 5);
              } else {
                message.success(formatMessage({ id: 'networkSetting.tag.form.action.success' }));

                dispatch({
                  type: 'dvaTagManagementOverview/fetch',
                });

              }
            },
          });
        }
        dispatch({
          type: 'dvaTagManagementOverview/modalVisible',
          payload: {
            updateModalVisible: false,
          }
        });
      }
    });
  };

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
    const { updateModalVisible, modalValues } = dvaTagManagementOverview;
    const { isTourOpen } = this.state;

    return (
      <Modal
        destroyOnClose
        title={<>{modalValues.tagID ? formatMessage({ id: 'networkSetting.tag.dialog.tag-update' }) : formatMessage({ id: 'networkSetting.tag.dialog.tag-add' })}
          <span style={{ float: 'right', marginRight: '24px', marginTop: '-4px' }}>
            <Button onClick={this.openTour} type="primary" shape="round" icon="question-circle">
              Help
          </Button>
          </span></>}
        style={{ height: '80%', maxWidth: '800px' }}
        bodyStyle={{
          minHeight: 200,
          overflow: 'auto',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        }}
        width={416}
        visible={updateModalVisible}
        // okText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
        // cancelText={formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
        // onOk={this.addTagHandle}
        onCancel={this.handleClosedTagModalVisible}
        className={styles.updateModal}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleClosedTagModalVisible}
            guide-id="tag-update-cancel"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-cancle' })}
          </Button>,
          <Button
            type="primary"
            key="ok"
            onClick={this.addTagHandle}
            guide-id="tag-update-submit"
          >
            {formatMessage({ id: 'networkSetting.tag.dialog.tag-add-confirm' })}
          </Button>
        ]}
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
        <Form >
          <Form.Item label={fieldLabels.deviceid}>
            {form.getFieldDecorator('tagID', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'networkSetting.tag.require.tag-id',
                  })}`,
                },
                {
                  pattern: /^[0-9a-fA-F]{6}$/,
                  message: `${formatMessage({
                    id: 'networkSetting.tag.require.tagid.len',
                  })}`,
                }
              ],
              initialValue: modalValues.tagID
            })(
              <Input
                placeholder={formatMessage({
                  id: 'networkSetting.tag.overview.placeholder.tag-id',
                })}
              />,
            )}
          </Form.Item>

          <Form.Item label={fieldLabels.desc}>
            {form.getFieldDecorator('description', {
              rules: [
                {
                  required: false,
                  message: `${formatMessage({
                    id: 'networkSetting.tag.require.tag-description',
                  })}`,
                },
              ],
              initialValue: modalValues.description,
            })(
              <TextArea placeholder={formatMessage({
                id: 'networkSetting.tag.placeholder.tag-description',
              })} />
            )}
          </Form.Item>
          <Form.Item style={{ height: 0, marginBottom: 0 }} >
            {form.getFieldDecorator('id', {
              initialValue: modalValues.id,
            })(<Input type='hidden' />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

// export default Form.create<ConfigFormProps>({ name: 'tag-add' })(ConfigForm);

/* 连接数据流 */
export default Form.create<ConfigFormProps>({ name: 'tag-add' })(
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
      positionLoading: loading.effects['dvaTagManagementOverview/fetchInformation'],
    }),
  )(ConfigForm),
);
