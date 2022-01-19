/* 资产列表数据类型 */
export interface GatewayListData {
  list: GatewayListItem[];
  pagination: Partial<GatewayListPagination>;
}

/* 网关对象数据类型 */
export interface GatewayListItem {
  id: string;
  gatewayID: string;
  name: string;
  groupID?: string;
  groupName?: string;
  status?: string;
  version: string;
  location?: string;
  coordinates?: [number, number];
  floorID: string;
  cpu?: number;
  ram?: number;
  prr?: number;
  time: number;
}

/* 网关分页数据类型 */
export interface GatewayListPagination {
  total: number;
  pageSize: number;
  current: number;
  sorter?: string;
}

/* 分组对象数据类型 */
export interface GroupListItem {
  id: string; // 组ID (object ID)
  name: string; // 组名称
  description: string; // 组描述
  ttl: number; // TTL值
  rssiThreshold: number; // RSSI阈值
}

/* 网关列表请求数据类型 */
export interface GatewayListParams {
  search?: string;
  status?: string;
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  startIndex?: number;
  maxResult?: number;
  order?: string;
  orderBy?: string;
}

/* 网关添加/修改对象数据类型 */
export interface GatewayUpdateParams {
  id?: string;
  gatewayID: string; // 设备ID(非objectID)
  name: string; // 设备名称
  location: {
    floorID: string; // 楼层ID
    coordinates: number[]; // 坐标，单位：米
  };
}

export interface GatewayPosition {
  id: string;
  floorID: string;
  coordinates: number[];
}

export interface GatewayUpgradeParams {
  version: string;
  id: string[];
}

/* 固件上传结果 */
export interface UploadResultData {
  devicesConfirm: boolean; // 设备类型校验结果
  checksumConfirm: boolean; // 和校验结果
  firmwareConfirm: boolean; // 固件校验结果
  version: string; // 固件版本号
}
