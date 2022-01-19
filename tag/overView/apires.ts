import { message } from 'antd';
import config from '@/../config/amsConfig';
import { TagListItem, GroupListItem, TagConfigType, TagListParams, TagUpdateType } from './data.d';
/* eslint-disable no-console */
interface ResponseTagDataType {
  total?: number;
  data?: TagListItem[];
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

interface ResponseGroupDataType {
  total?: number;
  data?: GroupListItem[];
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

// 定义Tag新增/修改后返回数据格式
interface ResponseTagUpdateType {
  data?: TagListItem;
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

// 定义Tag配置查询后返回数据格式
interface ResponseTagConfigType {
  data?: TagConfigType;
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

// 定义Tag OTA返回数据格式
interface ResponseTagOTAType {
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

// 定义Tag导入返回数据格式
interface ResponseTagImportType {
  total: Number,
  data: TagListItem[],
  check?: TagListItem[],
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

// 定义Tag删除操作返回数据格式
interface ResponseTagDeleteType {
  data: { id: string[] },
  err?: {
    error: number;
    message: string;
  };
  status?: number;
  statusText?: string;
}

const errSession = {
  err: {
    error: 201310,              // 错误码
    message: 'Session timeout', // 错误消息
  },
};

/** 校验信标列表 */
export function checkTagListRes(res: ResponseTagDataType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    total: 0, // 总数
    data: [],
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }
    message.error(
      `Fail to Get Tag List. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );
    return res;
  }

  // 正常时返回res.total res.data
  if (typeof res.total !== 'number' || !Array.isArray(res.data)) {
    // res.total or res.data 类型不符合
    return dataEmpty;
  }

  // res.data 遍历
  if (res.data && Array.isArray(res.data)) {
    for (let i = 0; i < res.data.length; i += 1) {
      const item = res.data[i];

      if (typeof item !== 'object') {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (item.id !== 'undefined' && typeof item.id !== 'string') {
        delete item.id;
      }
      if (item.tagID !== 'undefined' && typeof item.tagID !== 'string') {
        delete item.tagID;
      }
      if (item.status !== 'undefined' && typeof item.status !== 'string') {
        item.status = '';
      }
      if (item.version !== 'undefined' && typeof item.version !== 'string') { // 1.0.1 并非数字
        item.version = '';
      }
      if (item.description !== 'undefined' && typeof item.description !== 'string') {
        item.description = '';
      }
      if (typeof item.battery !== 'number') {
        item.battery = NaN;
      }
      if (typeof item.txPower !== 'number') {
        item.txPower = NaN;
      }
      if (typeof item.rssi !== 'number') {
        item.rssi = NaN;
      }
      if (typeof item.prr !== 'number') {
        item.prr = NaN;
      }
      if (typeof item.broadcastInterval !== 'number') {
        item.broadcastInterval = NaN;
      }
      if (typeof item.otaInterval !== 'number') {
        item.otaInterval = NaN;
      }
      if (typeof item.time !== 'number') {
        item.time = NaN;
      }
    }

    return res;
  }
  return dataEmpty;

}

/** 校验Group列表 */
export function checkGroupListRes(res: ResponseGroupDataType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    total: 0, // 总数
    data: [],
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }

    message.error(
      `Fail to Get Group List. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );

    return res;
  }

  // 正常时返回res.total res.data
  if (typeof res.total !== 'number' || !Array.isArray(res.data)) {
    // res.total or res.data 类型不符合
    return dataEmpty;
  }

  // res.data 遍历
  if (res.data && Array.isArray(res.data)) {
    for (let i = 0; i < res.data.length; i += 1) {
      const item = res.data[i];
      if (typeof item !== 'object') {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (item.id !== 'undefined' && typeof item.id !== 'string') {
        delete item.id;
      }
      if (item.name !== 'undefined' && typeof item.name !== 'string') {
        delete item.name;
      }
      if (item.description !== 'undefined' && typeof item.description !== 'string') {
        item.description = '';
      }
    }
    return res;
  }
  return dataEmpty;
}

/** 校验Tagconfig 返回 */
export function checkTagConfigureRes(res: ResponseTagConfigType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    data: {},
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }

    return res;
  }

  // 正常时返回res.data对象
  if (typeof res.data !== 'object') {
    return dataEmpty;
  }
  if (res.data) {
    const item = res.data;
    if (item.groupID !== 'undefined' && typeof item.groupID !== 'string') {
      delete item.groupID;
    }
    if (typeof item.txPower !== 'number') {
      delete item.txPower;
    }
    if (typeof item.broadcastInterval !== 'number') {
      delete (item.broadcastInterval);
    }
    if (typeof item.otaInterval !== 'object') {
      delete (item.otaInterval);
    }
    return item;
  }
  return res;
}

/** 校验Tagconfig 返回 */
export function checkTagConfigureGetRes(res: ResponseTagConfigType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    data: {},
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }
    message.error(
      `Fail to Get Tag Config. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );
    return res;
  }

  // 正常时返回res.data
  if (typeof res.data !== 'object') {
    return dataEmpty;
  }

  if (res && res.data) {
    if (res.data.groupID !== 'undefined' && typeof res.data.groupID !== 'string') {
      res.data.groupID = '';
    }
    if (typeof res.data.txPower !== 'number') {
      res.data.txPower = 0;
    }
    if (typeof res.data.broadcastInterval !== 'number') {
      res.data.broadcastInterval = 0;
    }
    if (typeof res.data.repeatBroadcast !== 'number') {
      res.data.repeatBroadcast = 0;
    }
    return res;
  }

  return res;
}

/** 校验Tag add/update返回数据 */
export function checkTagUpdateRes(res: ResponseTagUpdateType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    total: 0, // 总数
    data: {},
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }
    message.error(
      `Fail to update Tag. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );
    return res;
  }

  // 正常时返回res.data
  if (typeof res.data !== 'object') {
    // res.data 类型不符合
    return dataEmpty;
  }

  if (res && res.data) {
    if (res.data.id !== 'undefined' && typeof res.data.id !== 'string') {
      delete (res.data.id);
    }
    if (typeof res.data.tagID !== 'string') {
      delete (res.data.tagID);
    }
    if (typeof res.data.description !== 'string') {
      res.data.description = '';
    }
  }
  return res;
}


/** 校验Tag ota返回数据 */
export function checkTagOTARes(res: ResponseTagOTAType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }


    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }

    if (res.err.error === 100000) {
      message.success(
        `${res.err.message}`,
        config.errMsgShowPeriod,
      );
    } else {
      message.error(
        `Fail to update Tag  OTA. (Error: ${res.err.message})`,
        config.errMsgShowPeriod,
      );
    }
  }

  return res;
}


/** 校验Tag 导入后返回数据 */
export function checkTagImportRes(res: ResponseTagImportType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    total: 0, // 总数
    data: [],
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }

    message.error(
      `Fail to  Import Tag. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );

    return res;
  }

  // 正常时返回res.total res.data
  if (typeof res.total !== 'number' || !Array.isArray(res.data)) {
    // res.total or res.data 类型不符合
    return dataEmpty;
  }

  for (let i = 0; i < res.data.length; i += 1) {
    const item = res.data[i];
    if (typeof item !== 'object') {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (item.id !== 'undefined' && typeof item.id !== 'string') {
      delete (item.id);
    }
    if (item.tagID !== 'undefined' && typeof item.tagID !== 'string') {
      delete (item.tagID);
    }
    if (item.description !== 'undefined' && typeof item.description !== 'string') {
      item.description = '';
    }
  }
  return res;
}


/** 校验Tag 删除返回数据 */
export function checkTagDeleteRes(res: ResponseTagDeleteType) {
  if (typeof res.status === 'number' && typeof res.statusText === 'string' && res.status === 401) {
    return errSession;
  }
  // 预定义空结果
  const resEmpty = {
    err: {
      error: 800007, // 错误码
      message: 'result is empty', // 错误信息
    },
  };
  // 预定义空错误
  const errEmpty = {
    err: {
      error: 800008,
      message: 'err is empty',
    },
  };
  // 预定义空结果
  const dataEmpty = {
    data: { id: [] },
  };

  // 返回数据对象
  if (typeof res !== 'object') {
    // res 对象不存在
    return resEmpty;
  }

  // 有错误时返回res.err
  if (res.err) {
    // res.err 为对象
    if (typeof res.err !== 'object') {
      // res.err 对象不存在
      return errEmpty;
    }
    // 检查返回的err对象数据类型
    if (!(typeof res.err.error === 'number' && typeof res.err.message === 'string')) {
      // res.err.error message 类型不符合
      return errEmpty;
    }
    message.error(
      `Fail to  delete Tag. (Error: ${res.err.message})`,
      config.errMsgShowPeriod,
    );
    return res;
  }

  // 正常时返回res.data
  if (typeof res.data !== 'object') {
    // res.data 类型不符合
    return dataEmpty;
  }

  if (res && res.data) {
    if (typeof res.data.id !== 'object') {
      res.data.id = [];
    }
  }
  return res;
}

/** 检查是否为数字 */
function isNumber(num: any) {
  return typeof num === 'number' && !Number.isNaN(num);
}

/** 请求信标列表参数检查 */
export function checkTagListReq(req: TagListParams) {
  const reqObj: any = {};
  if (typeof req !== 'object') {
    return reqObj;
  }
  if (isNumber(req.startIndex)) {
    reqObj.startIndex = req.startIndex;
  }
  if (isNumber(req.maxResult)) {
    reqObj.maxResult = req.maxResult;
  }
  if (typeof req.order === 'string' && req.order) {
    reqObj.order = req.order;
  }
  if (typeof req.orderBy === 'string' && req.orderBy) {
    reqObj.orderBy = req.orderBy;
  }
  if (typeof req.search === 'string' && req.search) {
    reqObj.search = req.search;
  }
  if (typeof req.status === 'string' && req.status) {
    reqObj.status = req.status;
  }
  return reqObj;
}

/** Tag添加请求参数检查 */
export function checkTagAddReq(req: TagUpdateType) {
  const reqObj: any = {};
  if (typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.tagID === 'string' && req.tagID) {
    reqObj.tagID = req.tagID;
  } else {
    return null;
  }
  if (typeof req.description === 'string' && req.description) {
    reqObj.description = req.description;
  }

  return reqObj;
}

/** Tag修改请求参数检查 */
export function checkTagUpdateReq(req: TagUpdateType) {
  const reqObj: any = {};
  if (typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.id === 'string' && req.id) {
    reqObj.id = req.id;
  } else {
    return null;
  }
  if (typeof req.tagID === 'string' && req.tagID) {
    reqObj.tagID = req.tagID;
  } else {
    return null;
  }
  if (typeof req.description === 'string') {
    reqObj.description = req.description;
  }

  return reqObj;
}

/** Tag删除请求参数检查 */
export function checkTagDeleteReq(id: any) {
  let reqObj: any = {};

  if (typeof id === 'object') {
    reqObj = id;
  } else {
    return null;
  }
  return reqObj;
}


/** Tag配置请求参数检查 */
export function checkTagConfigReq(req: TagConfigType) {
  const reqObj: any = {};
  if (typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.groupID === 'string' && req.groupID) {
    reqObj.groupID = req.groupID;
  } else {
    return null;
  }
  if (isNumber(req.txPower)) {
    reqObj.txPower = req.txPower;
  } else {
    return null;
  }
  if (isNumber(req.broadcastInterval)) {
    reqObj.broadcastInterval = req.broadcastInterval;
  } else {
    return null;
  }
  if (Array.isArray(req.otaInterval)) {
    reqObj.otaInterval = req.otaInterval;
  } else {
    return null;
  }
  if (isNumber(req.repeatBroadcast)) {
    reqObj.repeatBroadcast = req.repeatBroadcast;
  } else {
    return null;
  }
  return reqObj;
}

/** 根据Tag groupID请求对应的配置参数检查 */
export function checkTagConfigIdReq(req: TagConfigType) {
  const reqObj: any = {};
  if (typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.groupID === 'string' && req.groupID) {
    reqObj.groupID = req.groupID;
  } else {
    return null;
  }
  return reqObj;
}


/** Tag批量导入数据请求检查 */
export function checkTagListAddReq(req: {
  total: number,
  data: TagUpdateType[]
}) {
  let reqObj: any = {};
  const trueImportArr: any[] = [];
  if (typeof req.total !== 'number' || !Array.isArray(req.data)) {
    return null;
  }
  if (req.data.length > 0) {
    req.data.forEach(ele => {
      const tempEle = ele;
      if (typeof ele.tagID === 'string' && ele.tagID.length === 6) {
        tempEle.tagID = ele.tagID;
        if (ele.description !== 'undefined' && typeof ele.description !== 'string') { // 不符合则删除
          delete tempEle.description;
        }
        trueImportArr.push(tempEle);
      }
    });

    if (trueImportArr.length > 0) {
      reqObj = {
        total: trueImportArr.length,
        data: trueImportArr,
      }
    } else {
      return null;
    }

  } else {
    return null;
  }

  return reqObj;
}