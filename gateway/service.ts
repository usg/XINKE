import request from '@/utils/request';
import {
  GatewayListData,
  GatewayListParams,
  GatewayUpdateParams,
  GatewayUpgradeParams,
} from './data.d';
import {
  checkGroupRes,
  checkGatewayReq,
  checkGatewayRes,
  checkGatewayAddReq,
  checkGatewayUpdateReq,
  checkGatewayUpdateRes,
  checkGatewayDeleteReq,
  checkGatewayDeleteRes,
  checkGatewayUploadRes,
  checkGatewayUpgradeReq,
  checkGatewayUpgradeRes,
  checkGatewayRebootReq,
  checkGatewayRebootRes,
} from './apires';
import config from '@/../config/amsConfig';

const resMaxResult = 999999;

const urlPrefix = config.networkSetting.gateway.mock ? '/apiDevice/device' : '/device'; // API前缀

/* 查询网关分组列表API */
export async function queryGroupList() {
  let response = await request(`${urlPrefix}/group/list`, {
    method: 'GET',
    params: { maxResult: resMaxResult },
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGroupRes(response);
  }
  let result = [];
  // 数据转换
  if (response && Array.isArray(response.data)) {
    result = response.data;
  }
  return result;
}

/* 查询数据API */
export async function queryGatewayList(params: Partial<GatewayListParams> = {}) {
  const result: GatewayListData = {
    list: [],
    pagination: { total: 0, pageSize: 20, current: 1, sorter: 'desc' },
  };
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayReq(params);
    if (req === null) return result;
  }
  const paramsTemp = params;
  // 转换接收到的参数数据字段及结构
  if (!paramsTemp.currentPage) paramsTemp.currentPage = 1;
  if (!paramsTemp.pageSize) paramsTemp.pageSize = 20;
  paramsTemp.startIndex = (paramsTemp.currentPage - 1) * paramsTemp.pageSize;
  paramsTemp.maxResult = paramsTemp.pageSize;
  if (paramsTemp.sorter) {
    const lastIndex = paramsTemp.sorter.lastIndexOf('_');
    const newOrderBy = paramsTemp.sorter.substring(0, lastIndex);
    let newOrder = 'desc';
    if (paramsTemp.sorter.indexOf('asc') > 0) newOrder = 'asc';
    paramsTemp.order = newOrder;
    paramsTemp.orderBy = newOrderBy;
  }
  // 删除冗余的字段
  const { currentPage, pageSize, sorter, ...rest } = paramsTemp;
  // console.log('params:', rest);

  let response = await request(`${urlPrefix}/device/gwlist`, {
    method: 'GET',
    params: rest,
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayRes(response);
  }
  // 数据转换
  if (response && Array.isArray(response.data)) {
    if (sorter) result.pagination.sorter = sorter;
    result.pagination.current = currentPage;
    result.pagination.pageSize = pageSize;
    result.pagination.total = response.total;
    result.list = response.data;
  }
  // console.log('result:', result);
  return result;
}

/* 新增数据API */
export async function addGatewayList(params: GatewayUpdateParams) {
  let result = {};
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayAddReq(params);
    if (req === null) return result;
  }
  let response = await request(`${urlPrefix}/device/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayUpdateRes(response);
  }
  if (response && response.data) {
    result = response.data;
  } else if (response && response.err) {
    result = response.err;
  } else {
    result = { error: 100000, ...response };
  }
  return result;
}

/* 更新数据API */
export async function updateGatewayList(params: GatewayUpdateParams) {
  let result = {};
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayUpdateReq(params);
    if (req === null) return result;
  }
  let response = await request(`${urlPrefix}/device/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayUpdateRes(response);
  }
  if (response && response.data) {
    result = response.data;
  } else if (response && response.err) {
    result = response.err;
  } else {
    result = { error: 100000, ...response };
  }
  return result;
}

/* 删除数据API */
export async function removeGatewayList(params: { id: string[] }) {
  let result = {};
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayDeleteReq(params);
    if (req === null) return result;
  }
  let response = await request(`${urlPrefix}/device/delete`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayDeleteRes(response);
  }
  if (response && response.data) {
    result = response.data;
  } else if (response && response.err) {
    result = response.err;
  } else {
    result = { error: 100000, ...response };
  }
  return result;
}

/* 网关固件上传API */
export async function uploadGatewayFirmware(params: any) {
  let result = {};
  let response = await request(`${urlPrefix}/device/gwuploadfirmware`, {
    method: 'POST',
    data: params,
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayUploadRes(response);
  }
  if (response && response.err) {
    result = response.err;
  } else {
    result = response;
  }
  return result;
}

/* 网关升级操作API */
export async function upgradeGatewayList(params: GatewayUpgradeParams) {
  let result = {};
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayUpgradeReq(params);
    if (req === null) return result;
  }
  let response = await request(`${urlPrefix}/device/gwupgrade`, {
    method: 'POST',
    data: params,
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayUpgradeRes(response);
  }
  if (response && response.err) {
    result = response.err;
  } else {
    result = response;
  }
  return result;
}

/* 网关重启操作API */
export async function rebootGatewayList(params: { id: string[] }) {
  let result = {};
  if (config.networkSetting.gateway.apicheck) {
    // 校验API请求数据
    const req = checkGatewayRebootReq(params);
    if (req === null) return result;
  }
  let response = await request(`${urlPrefix}/device/gwreboot`, {
    method: 'POST',
    data: params,
  });
  if (config.networkSetting.gateway.apicheck) {
    // 校验API返回数据
    response = checkGatewayRebootRes(response);
  }
  if (response && response.data) {
    result = response.data;
  } else if (response && response.err) {
    result = response.err;
  }
  return result;
}
