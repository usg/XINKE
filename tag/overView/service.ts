import request from '@/utils/request';
import { TagListParams, TagListData, ImportTagsType, TagOTAType, TagUpdateType, TagConfigType } from './data.d';
import {
  checkTagListRes,
  checkGroupListRes,
  checkTagConfigureGetRes,
  checkTagConfigureRes,
  checkTagImportRes,
  checkTagOTARes,
  checkTagUpdateRes,
  checkTagDeleteRes,
  checkTagAddReq,
  checkTagConfigReq,
  checkTagDeleteReq,
  checkTagListReq,
  checkTagConfigIdReq,
  checkTagUpdateReq,
  checkTagListAddReq,
} from './apires';

/**
 * 查询信标列表数据
 * @param params :TagListParams...
 */
const urlPrefix = '/device'; // 默认/device
export async function apiTagList(params: Partial<TagListParams> = {}) {
  const paramsTemp = params;
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

  const checkedRest = checkTagListReq(rest);

  let response = await request(`${urlPrefix}/tag/list`, {
    // const response = await request('/apiTagList', {
    method: 'GET',
    params: checkedRest,
  });

  const result: TagListData = {
    list: [],
    pagination: { total: 0, pageSize: 20, current: 1, sorter: 'desc' },
  };

  response = checkTagListRes(response);

  if (response && Array.isArray(response.data)) {
    if (sorter) result.pagination.sorter = sorter;
    result.pagination.current = currentPage;
    result.pagination.pageSize = pageSize;
    result.pagination.total = response.total;
    result.list = response.data;
  }

  return result;
}

/**
 * 查询组别列表数据
 * @param params :any
 */
export async function apiGatewayGroupList(params?: any) {
  const response = await request(`${urlPrefix}/group/list`, {
    // const  response = await request('/apiMeshGroupList', {
    method: 'GET',
    params,
  });
  checkGroupListRes(response);
  return response;
}

/**
 * 更新配置数据
 * @param : otaInterval:number, txPower:number ....
 */
export async function apiTagConfigureUpdate(params: TagConfigType) {
  const queryParams = params;
  queryParams.otaInterval = [params.otaInterval, params.otaInterval2]; // 转换格式为数组
  const checkedQueryParams = checkTagConfigReq(queryParams);
  if (checkedQueryParams === null) {  // 必须参数缺失，返回空对象
    return {};
  }
  const response = await request(`${urlPrefix}/tag/configure`, {
    // const response = await request('/apiTagConfig', {  
    method: 'POST',
    data: {
      ...checkedQueryParams
    }
  });
  checkTagConfigureRes(response);
  return response;
}

/**
 * 获取配置数据
 * @param : groupID:[] 
 */
export async function apiTagConfigureGet(params: TagConfigType) {
  const checkedParams = checkTagConfigIdReq(params);
  if (checkedParams === null) {  // 必须参数缺失，返回空对象
    return {};
  }
  let response = await request(`${urlPrefix}/tag/configure`, {
    // const response = await request('/apiTagConfigGet', { 
    method: 'GET',
    params: checkedParams,
  });
  response = checkTagConfigureGetRes(response);
  return response;
}

/**
 * 添加信标数据
 * @param : TagID:String, description:String
 */
export async function apiTagAdd(params: TagUpdateType) {
  const checkedParams = checkTagAddReq(params);
  if (checkedParams === null) {  // 必须参数缺失，直接返回空对象
    return {};
  }
  let response = await request(`${urlPrefix}/tag/add`, {
    //  const response = await request('/apiTagAdd', {
    method: 'POST',
    data: {
      ...checkedParams,
    },
  });
  response = checkTagUpdateRes(response);
  return response;
}

/**
 * 编辑信标数据
 * @param : TagID:String, description:String
 */
export async function apiTagUpdate(params: TagUpdateType) {
  const checkedParams = checkTagUpdateReq(params);
  if (checkedParams === null) {  // 必须参数缺失，直接返回空对象
    return {};
  }
  let response = await request(`${urlPrefix}/tag/update`, {
    // const response = await request('/apiTagEdit', {  
    method: 'POST',
    data: {
      ...checkedParams,
    },
  });
  response = checkTagUpdateRes(response);
  return response;
}

/**
 * 删除信标数据
 * @param : TagID:String[]
 */
export async function apiTagDelete(params: { id: string | [] }) {
  /* mock test */
  /*
   const response = await request('/apiTagDelete', {
     method: 'POST',
     data: {
       ...params,
     },
   });
   */
  let thisIds = [];
  if (typeof params.id === 'string') { // 删除单个记录
    thisIds = [params.id];
  } else {                             // 删除批量记录
    thisIds = params.id;
  }

  const checkedThisIds = checkTagDeleteReq(thisIds);
  if (checkedThisIds === null) {  // 必须参数缺失，直接返回空对象
    return {};
  }
  let response = await request(`${urlPrefix}/tag/delete`, {
    method: 'POST',
    data: {
      id: checkedThisIds,
    },
  });
  response = checkTagDeleteRes(response);
  return response;
}


/**
 * 升级更新OTA数据
 * @param : id:String,file:file
 */
export async function apiTagUpgrade(params: TagOTAType) {
  let response = await request(`${urlPrefix}/tag/upgrade`, {
    //   const response = await request('/apiTagUpgrade', {
    method: 'POST',
    data: params,
  });
  response = checkTagOTARes(response);
  return response;
}

/**
 * 上传OTA软件
 * @param : file:file
 */
export async function apiUploadfirmware(params: any) {
  const response = await request(`${urlPrefix}/tag/uploadfirmware`, {
    method: 'GET',
    params,
  });
  return response;
}

/**
 * 批量导入tag数据
 * @param : object
 */
export async function apiTagAddList(params: ImportTagsType) {
  const checkedParams = checkTagListAddReq(params);
  if (checkedParams === null) {  // 必须参数检验不通过，直接返回空对象
    return {};
  }

  let response = await request(`${urlPrefix}/tag/import`, {
    // const response = await request('/apiTagAddList', {
    method: 'POST',
    data: params,
  });
  response = checkTagImportRes(response);
  return response;
}

/**
 * 一次性获取所有tag数据
 * @param : Array
 */
export async function apiFullTagList(params?: any) {
  let response = await request(`${urlPrefix}/tag/list`, {
    // const response = await request('/apiTagList', {
    method: 'GET',
    params,
  });
  response = checkTagListRes(response);
  return response;
}

