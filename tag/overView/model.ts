/* eslint-disable import/no-extraneous-dependencies */
import { Reducer, AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  apiTagList,
  apiTagConfigureUpdate,
  apiTagConfigureGet,
  apiTagAdd,
  apiTagUpdate,
  apiTagUpgrade,
  apiTagDelete,
  apiGatewayGroupList,
  apiTagAddList,
  apiFullTagList
} from './service';
import {
  TagListData,
  GroupListType,
  TagConfigType,
  TagListItem
} from './data.d';
/* eslint-enable */
// 用到的全局状态数据
export interface PSStateType {
  tagList: TagListData;
  groupList: GroupListType[];
  updateModalVisible: boolean;
  configModalVisible: boolean;
  OTAModalVisible: boolean;
  importModalVisible: boolean;
  modalValues: object;
  tagConfigInfo: TagConfigType | undefined;
  search?: string;
  fullTagList: TagListItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: PSStateType) => T) => T },
) => void;

// 定义model中各参数数据类型
export interface ModelType {
  namespace: string;
  state: PSStateType;
  effects: {
    fetch: Effect;
    configUpdate: Effect;
    configGet: Effect;
    tagAdd: Effect;
    tagAddList: Effect;
    tagDelete: Effect;
    tagUpdate: Effect;
    otaUpgrade: Effect;
    fetchGatewayGroup: Effect;
    fetchFullTags: Effect;
  };
  reducers: {
    save: Reducer<PSStateType>;
    addTag: Reducer<PSStateType>;
    deleteTag: Reducer<PSStateType>;
    editTag: Reducer<PSStateType>;
    modalVisible: Reducer<PSStateType>;
  };
}

// 状态的默认赋值
const defaultState: PSStateType = {
  tagList: {
    list: [],       // 列表数据
    pagination: {}, // 分页参数
  },
  groupList: [],
  updateModalVisible: false,
  configModalVisible: false,
  OTAModalVisible: false,
  importModalVisible: false,
  modalValues: {},
  search: '',
  tagConfigInfo: {},
  fullTagList: [],
}

const Model: ModelType = {
  namespace: 'dvaTagManagementOverview',
  state: defaultState,

  effects: {
    /**
     * 请求tag列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(apiTagList, payload);
      yield put({
        type: 'save',
        payload: {
          tagList: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求tag新增
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *tagAdd({ payload, callback }, { call, put }) {
      const response = yield call(apiTagAdd, payload);
      yield put({
        type: 'addTag',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
    * 请求tag新增多条记录
    * @param payload 输入参数
    * @param callback 回调函数
    */
    *tagAddList({ payload, callback }, { call, put }) {
      const response = yield call(apiTagAddList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求tag删除
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *tagDelete({ payload, callback }, { call, put }) {
      const response = yield call(apiTagDelete, payload);
      yield put({
        type: 'deleteTag',
        payload: response
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求tag更新
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *tagUpdate({ payload, callback }, { call, put }) {
      const response = yield call(apiTagUpdate, payload);
      yield put({
        type: 'editTag',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求tag配置
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *configUpdate({ payload, callback }, { call, put }) {
      const response = yield call(apiTagConfigureUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          tagConfigUpdate: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求OTA升级配置
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *otaUpgrade({ payload, callback }, { call, put }) {
      const response = yield call(apiTagUpgrade, payload);
      yield put({
        type: 'save',
        payload: {
          tagConfigUpdate: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求获取配置
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *configGet({ payload, callback }, { call, put }) {
      const response = yield call(apiTagConfigureGet, payload);
      yield put({
        type: 'save',
        payload: {
          tagConfigInfo: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求网关group列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *fetchGatewayGroup({ payload, callback }, { call, put }) {
      const response = yield call(apiGatewayGroupList, payload);
      yield put({
        type: 'save',
        payload: {
          groupList: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    /**
     * 请求tag列表
     * @param payload 输入参数
     * @param callback 回调函数
     */
    *fetchFullTags({ payload, callback }, { call, put }) {
      const response = yield call(apiFullTagList, payload);
      yield put({
        type: 'save',
        payload: {
          fullTagList: response,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
  },

  reducers: {
    // 同步数据处理
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // 添加信标后数据处理
    addTag(state, { payload }) {
      if (state && !payload.err) {
        const { total = 0 } = state.tagList.pagination;
        const { list = [] } = state.tagList;
        const stateTemp = state;
        stateTemp.tagList.pagination.total = total + 1;
        list.splice(0, 0, payload.data);
        stateTemp.tagList.list = list;
      }
      return {
        ...state,
        ...payload,
      };
    },

    // 删除信标后数据处理
    deleteTag(state, { payload }) {
      if (state && !payload.err) {
        const { total = 0 } = state.tagList.pagination;
        const { list = [] } = state.tagList;
        const stateTemp = state;
        const tagsDelIds = payload.data.id;

        stateTemp.tagList.pagination.total = total - tagsDelIds.length;
        const newList = [];
        for (let i = 0; i < list.length; i += 1) {
          if ((payload.data && !tagsDelIds.includes(list[i].id))) {
            newList.push(list[i]);
          }
        }
        stateTemp.tagList.list = newList;
      }
      return {
        ...state,
        ...payload,
      };
    },

    // 编辑信标后数据处理
    editTag(state, { payload }) {
      if (state && !payload.err) {
        const { list = [] } = state.tagList;
        const stateTemp = state;
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].id === payload.data.id) {
            list.splice(i, 1, payload.data);
            stateTemp.tagList.list = list;
            break;
          }
        }
      }
      return {
        ...state,
        ...payload,
      };
    },

    // 模态框可见性控制
    modalVisible(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
