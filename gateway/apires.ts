/* eslint-disable no-continue */
/* eslint-disable no-console */
import config from '@/../config/amsConfig';
import {
  GroupListItem,
  GatewayListParams,
  GatewayListItem,
  GatewayUpdateParams,
  GatewayUpgradeParams,
} from './data.d';

interface ResGroupDataType {
  total?: number;
  data?: GroupListItem[];
  err?: {
    error: number; // 错误码
    message: string; // 错误信息
  };
}

interface ResGatewayDataType {
  total?: number;
  data?: GatewayListItem[];
  err?: {
    error: number; // 错误码
    message: string; // 错误信息
  };
}

interface ResponseUpdateDataType {
  data?: GatewayListItem;
  err?: {
    error: Number; // 错误码
    message: String; // 错误信息
  };
}

interface ResponseDeleteDataType {
  data?: {
    id: string[]; // object ID
  };
  err?: {
    error: Number; // 错误码
    message: String; // 错误信息
  };
}

interface ResponseUploadDataType {
  devicesConfirm: boolean; // 设备类型校验结果
  checksumConfirm: boolean; // 和校验结果
  firmwareConfirm: boolean; // 固件校验结果
  version: String; // 固件版本号
  err?: {
    error: number; // 错误码
    message: string; // 错误信息
  };
}

interface ResponseUpgradeDataType {
  err?: {
    error: number; // 错误码
    message: string; // 错误信息
  };
}

interface ResponseRebootDataType {
  data?: {
    id: string[]; // object ID(gateway)
  };
  err?: {
    error: number; // 错误码
    message: string; // 错误信息
  };
}

/** 校验是否有效number */
function isNumber(num: any) {
  return typeof num === 'number' && !Number.isNaN(num);
}

function checkCoordinates(coordinates: number[] | undefined) {
  if (!Array.isArray(coordinates)) return false;
  if (coordinates.length !== 2 || !isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    return false;
  }
  return true;
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
    error: 800008, // 错误码
    message: 'err is empty', // 错误信息
  },
};
// 预定义空数据
const dataEmpty = {
  total: 0, // 查询结果总数
  data: [],
};

/** 校验分组列表结果 */
export function checkGroupRes(res: ResGroupDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to get group list!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // res.total res.data 必选项类型不符,返回空数据
  if (typeof res.total !== 'number' || !Array.isArray(res.data)) {
    return dataEmpty;
  }

  // res.data 遍历
  for (let i = 0; i < res.data.length; i += 1) {
    const item = res.data[i];
    // 检查单条记录必为对象，否则跳过
    if (typeof item !== 'object' || res === null) {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
    }
    // 以下检查单条记录中字段数据类型
    if (!item.id || typeof item.id !== 'string') {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
      // res.data.item.id 类型不符
    }
    if (item.name && typeof item.name !== 'string') {
      res.data[i].name = '';
      // res.data.item.name 类型不符
    }
    if (item.description && typeof item.description !== 'string') {
      res.data[i].description = '';
      // res.data.item.description 类型不符
    }
    if (item.ttl && typeof item.ttl !== 'number') {
      res.data[i].ttl = NaN;
      // res.data.item.ttl 类型不符
    }
    if (item.rssiThreshold && typeof item.rssiThreshold !== 'number') {
      res.data[i].rssiThreshold = NaN;
      // res.data.item.rssiThreshold 类型不符
    }
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验网关列表请求参数 */
export function checkGatewayReq(req: GatewayListParams) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
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

/** 校验网关列表返回结果 */
export function checkGatewayRes(res: ResGatewayDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to get gateway list!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // res.total res.data 必选项类型不符,返回空数据
  if (typeof res.total !== 'number' || !Array.isArray(res.data)) {
    return dataEmpty;
  }

  // res.data 遍历
  for (let i = 0; i < res.data.length; i += 1) {
    const item = res.data[i];
    // 检查单条记录必为对象，否则跳过
    if (typeof item !== 'object' || item === null) {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
    }
    // 以下检查单条记录中字段数据类型
    if (!item.id || typeof item.id !== 'string') {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
      // res.data.item.id 类型不符
    }
    if (item.gatewayID && typeof item.gatewayID !== 'string') {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
      // res.data.item.gatewayID 类型不符
    }
    if (item.name && typeof item.name !== 'string') {
      res.data[i].name = '';
      // res.data.item.name 类型不符
    }
    if (item.groupID && typeof item.groupID !== 'string') {
      res.data[i].groupID = '';
      // res.data.item.groupID 类型不符
    }
    if (item.groupName && typeof item.groupName !== 'string') {
      res.data[i].groupName = '';
      // res.data.item.groupName 类型不符
    }
    if (item.status && typeof item.status !== 'string') {
      res.data[i].status = '';
      // res.data.item.status 类型不符
    }
    if (item.version && typeof item.version !== 'string') {
      res.data[i].version = '';
      // res.data.item.version 类型不符
    }
    if (item.location && typeof item.location !== 'string') {
      res.data[i].location = '';
      // res.data.item.location 类型不符
    }
    if (item.coordinates && !checkCoordinates(item.coordinates)) {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
      // res.data.item.coordinates 类型不符
    }
    if (item.floorID && typeof item.floorID !== 'string') {
      res.data.splice(i, 1); // 删除元素，改变了数组长度
      i -= 1; // 循环下标减1
      continue;
      // res.data.item.floorID 类型不符
    }
    if (item.cpu && typeof item.cpu !== 'number') {
      res.data[i].cpu = NaN;
      // res.data.item.cpu 类型不符
    }
    if (item.ram && typeof item.ram !== 'number') {
      res.data[i].ram = NaN;
      // res.data.item.ram 类型不符
    }
    if (item.time && typeof item.time !== 'number') {
      res.data[i].time = NaN;
      // res.data.item.time 类型不符
    }
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验Gateway添加请求参数 */
export function checkGatewayAddReq(req: GatewayUpdateParams) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.gatewayID === 'string' && req.gatewayID) {
    reqObj.gatewayID = req.gatewayID;
  }
  if (typeof req.name === 'string' && req.name) {
    reqObj.name = req.name;
  }
  if (typeof req.location === 'object' && req.location) {
    reqObj.location = req.location;
    if (typeof req.location.floorID === 'string' && req.location.floorID) {
      reqObj.location.floorID = req.location.floorID;
    }
    if (checkCoordinates(req.location.coordinates)) {
      reqObj.location.coordinates = req.location.coordinates;
    }
  }
  return reqObj;
}

/** 校验Gateway修改请求参数 */
export function checkGatewayUpdateReq(req: GatewayUpdateParams) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.id === 'string' && req.id) {
    reqObj.id = req.id;
  } else {
    return null;
  }
  if (typeof req.gatewayID === 'string' && req.gatewayID) {
    reqObj.gatewayID = req.gatewayID;
  }
  if (typeof req.name === 'string' && req.name) {
    reqObj.name = req.name;
  }
  if (typeof req.location === 'object' && req.location) {
    reqObj.location = req.location;
    if (typeof req.location.floorID === 'string' && req.location.floorID) {
      reqObj.location.floorID = req.location.floorID;
    }
    if (checkCoordinates(req.location.coordinates)) {
      reqObj.location.coordinates = req.location.coordinates;
    }
  }
  return reqObj;
}

/** 校验Gateway添加/修改返回结果 */
export function checkGatewayUpdateRes(res: ResponseUpdateDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Failed to update Gateway!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // res.data 必选项类型不符,返回空数据
  if (typeof res.data !== 'object' || res.data === null) {
    return resEmpty;
  }

  // res.data 校验
  const item = res.data;
  // 以下检查记录中字段数据类型
  if (!item.id || typeof item.id !== 'string') {
    console.error(`id field value ${item.id} is not a string`);
    return resEmpty;
  }
  if (item.gatewayID && typeof item.gatewayID !== 'string') {
    console.error(`gatewayID field value ${item.gatewayID} is not a string`);
    return resEmpty;
  }
  if (item.name && typeof item.name !== 'string') {
    res.data.name = '';
    console.error(`name field value ${item.name} is not a string`);
  }
  if (item.groupName && typeof item.groupName !== 'string') {
    res.data.groupName = '';
    console.error(`groupName field value ${item.groupName} is not a string`);
  }
  if (item.status && typeof item.status !== 'string') {
    res.data.status = '';
    console.error(`status field value ${item.status} is not a string`);
  }
  if (item.version && typeof item.version !== 'string') {
    res.data.version = '';
    console.error(`version field value ${item.version} is not a string`);
  }
  if (item.location && typeof item.location !== 'string') {
    res.data.location = '';
    console.error(`location field value ${item.location} is not a string`);
  }
  if (item.coordinates && !checkCoordinates(item.coordinates)) {
    console.error(`coordinates field value ${item.coordinates} is incorrect`);
    return resEmpty;
  }
  if (item.floorID && typeof item.floorID !== 'string') {
    console.error(`floorID field value ${item.floorID} is not a string`);
    return resEmpty;
  }
  if (item.cpu && typeof item.cpu !== 'number') {
    res.data.cpu = NaN;
    console.error(`cpu field value ${item.cpu} is not a number`);
  }
  if (item.ram && typeof item.ram !== 'number') {
    res.data.ram = NaN;
    console.error(`ram field value ${item.ram} is not a number`);
  }
  if (item.time && typeof item.time !== 'number') {
    res.data.time = NaN;
    console.error(`time field value ${item.time} is not a number`);
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验Gateway删除请求参数 */
export function checkGatewayDeleteReq(req: { id: string[] }) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
    return reqObj;
  }
  if (Array.isArray(req.id)) {
    reqObj.id = req.id;
  } else {
    return null;
  }
  return reqObj;
}

/** 校验Gateway删除返回结果 */
export function checkGatewayDeleteRes(res: ResponseDeleteDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to delete Gateway!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // res.data 必选项类型不符,返回空数据
  if (typeof res.data !== 'object' || res.data === null) {
    return resEmpty;
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验Gateway上传固件返回结果 */
export function checkGatewayUploadRes(res: ResponseUploadDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to upload Gateway Firmware!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // 以下检查记录中字段数据类型
  if (res.devicesConfirm && typeof res.devicesConfirm !== 'boolean') {
    console.error(`deviceConfirm type does not match`);
    // res.devicesConfirm 类型不符
  }
  if (res.checksumConfirm && typeof res.checksumConfirm !== 'boolean') {
    console.error(`checksumConfirm type does not match`);
    // res.checksumConfirm 类型不符
  }
  if (res.firmwareConfirm && typeof res.firmwareConfirm !== 'boolean') {
    console.error(`firmwareConfirm type does not match`);
    // res.firmwareConfirm 类型不符
  }
  if (res.version && typeof res.version !== 'string') {
    res.version = '';
    // res.version 类型不符
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验Gateway升级固件请求参数 */
export function checkGatewayUpgradeReq(req: GatewayUpgradeParams) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
    return reqObj;
  }
  if (typeof req.version === 'string' && req.version) {
    reqObj.version = req.version;
  } else {
    return null;
  }
  if (Array.isArray(req.id)) {
    reqObj.id = req.id;
  } else {
    return null;
  }
  return reqObj;
}

/** 校验Gateway升级固件返回结果 */
export function checkGatewayUpgradeRes(res: ResponseUpgradeDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to upload Gateway Upgrade!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // 所有校验完成后返回数据
  return res;
}

/** 校验Gateway重启请求参数 */
export function checkGatewayRebootReq(req: { id: string[] }) {
  const reqObj: any = {};
  if (req === null || typeof req !== 'object') {
    return reqObj;
  }
  if (Array.isArray(req.id)) {
    reqObj.id = req.id;
  } else {
    return null;
  }
  return reqObj;
}

/** 校验Gateway重启返回结果 */
export function checkGatewayRebootRes(res: ResponseRebootDataType) {
  // res为非对象时，返回空结果
  if (typeof res !== 'object' || res === null) {
    console.error(`Fail to reboot Gateway!`, config.errMsgShowPeriod);
    return resEmpty;
  }

  // res.err 为可选项
  if (res.err) {
    // res.err为非对象时，返回空错误
    if (typeof res.err !== 'object') {
      return errEmpty;
    }
    // 必选项类型不符,返回空错误
    if (typeof res.err.error !== 'number' || typeof res.err.message !== 'string') {
      return errEmpty;
    }
    // 返回正常错误(前端内部处理逻辑 必须先判断res.err,在判断其它数据)
    return res;
  }

  // res.data 必选项类型不符,返回空数据
  if (typeof res.data !== 'object' || res.data === null) {
    return resEmpty;
  }

  // 所有校验完成后返回数据
  return res;
}
