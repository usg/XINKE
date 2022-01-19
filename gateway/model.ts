import { Reducer, AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  queryGatewayList,
  addGatewayList,
  updateGatewayList,
  removeGatewayList,
  uploadGatewayFirmware,
  upgradeGatewayList,
  rebootGatewayList,
  queryGroupList,
} from './service';
import { GatewayListData, GatewayListItem, GroupListItem } from './data.d';

// 返回数据及默认值
export interface IStateType {
  searchOpt: string; // 搜索关键字
  selectedRows: GatewayListItem[]; // 选中网关
  gatewayData: GatewayListData; // 网关overview列表
  gatewayGroup: GroupListItem[]; // 网关分组
  updateModalValues: Partial<GatewayListItem>; // 编辑模态框赋值
  updateModalVisible: boolean; // 新增/编辑网关模态框可见状态
  rebootModalVisible: boolean; // 网关重启模态框可见状态
  upgradeModalVisible: boolean; // 网关OTA模态框可见状态
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IStateType) => T) => T },
) => void;

// 定义model中各参数数据类型
export interface ModelType {
  namespace: string;
  state: IStateType;
  effects: {
    fetch: Effect;
    fetchGroup: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
    upload: Effect;
    upgrade: Effect;
    reboot: Effect;
  };
  reducers: {
    save: Reducer<IStateType>;
    addGateway: Reducer<IStateType>;
    editGateway: Reducer<IStateType>;
    delGateway: Reducer<IStateType>;
    modalVisible: Reducer<IStateType>;
    clear: Reducer<IStateType>;
  };
}

const defaultState: IStateType = {
  searchOpt: '', // 搜索关键字
  selectedRows: [], // 选中网关对象数组
  gatewayData: {
    // 网关overview列表
    list: [], // gateway list数据
    pagination: {}, // 分页参数
  },
  gatewayGroup: [], // 网关分组
  updateModalValues: {}, // 编辑模态框赋值
  updateModalVisible: false, // 新增/编辑网关模态框可见状态
  rebootModalVisible: false, // 网关重启模态框可见状态
  upgradeModalVisible: false, // 网关OTA模态框可见状态
};

const Model: ModelType = {
  namespace: 'dvaNetworkGateway',

  state: defaultState,

  effects: {
    /**
     * 请求网关列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryGatewayList, payload);
      yield put({
        type: 'save',
        payload: {
          gatewayData: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 请求网关分组列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *fetchGroup({ payload, callback }, { call, put }) {
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'save',
        payload: {
          gatewayGroup: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 提交网关添加
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addGatewayList, payload);
      yield put({
        type: 'addGateway',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 提交网关编辑
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateGatewayList, payload);
      yield put({
        type: 'editGateway',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 提交网关删除
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeGatewayList, payload);
      yield put({
        type: 'delGateway',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 上传网关固件
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *upload({ payload, callback }, { call }) {
      const response = yield call(uploadGatewayFirmware, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 升级网关列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *upgrade({ payload, callback }, { call }) {
      const response = yield call(upgradeGatewayList, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    /**
     * 重启网关操作
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *reboot({ payload, callback }, { call }) {
      const response = yield call(rebootGatewayList, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    // 同步网关数据
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 同步添加网关数据
    addGateway(state, { payload }) {
      // console.log('add', payload);
      if (typeof state === 'undefined') return defaultState;
      const stateTemp = state;
      if (state && !payload.error) {
        const { total = 0 } = stateTemp.gatewayData.pagination;
        let { list = [] } = stateTemp.gatewayData;
        stateTemp.gatewayData.pagination.total = total + 1;
        list = [payload, ...list];
        stateTemp.gatewayData.list = list;
      }
      return {
        ...stateTemp,
        // ...payload,
      };
    },
    // 同步编辑网关数据
    editGateway(state, { payload }) {
      if (typeof state === 'undefined') return defaultState;
      const stateTemp = state;
      if (state && !payload.error) {
        const { list = [] } = stateTemp.gatewayData;
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].id === payload.id) {
            list.splice(i, 1, payload);
            stateTemp.gatewayData.list = list;
            break;
          }
        }
      }
      return {
        ...stateTemp,
        // ...payload,
      };
    },
    // 同步删除网关数据
    delGateway(state, { payload }) {
      if (typeof state === 'undefined') return defaultState;
      const stateTemp = state;
      if (state && !payload.error) {
        const { total = 0 } = stateTemp.gatewayData.pagination;
        const { list = [] } = stateTemp.gatewayData;
        stateTemp.gatewayData.pagination.total = total - 1;
        stateTemp.gatewayData.list = list.filter(item => !payload.id.includes(item.id));
      }
      return {
        ...stateTemp,
        // ...payload,
      };
    },
    // 同步模态框可见性
    modalVisible(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return defaultState;
    },
  },
};

export default Model;
