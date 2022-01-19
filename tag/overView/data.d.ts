/* 列表数据类型 */
export interface TagListData {
  list: TagListItem[];
  pagination: Partial<TagListPagination>;
}

/* tag数据类型 */
export interface TagListItem {
  id?: string,
  tagID: string,
  status?: string,
  description?: string,
  version: string,
  battery: number,
  txPower: number,
  rssi: number,
  prr: number,
  broadcastInterval: number,
  otaInterval?: number,
  time: number,
}

/* 资产查询表单数据类型 */
export interface TagListParams {
  search?: string;
  online?: boolean;
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  startIndex?: number;
  maxResult?: number;
  order?: string;
  orderBy?: string;
  status?: string;
}

/* tag分页数据类型 */
export interface TagListPagination {
  total: number;
  pageSize: number;
  current: number;
  sorter?: string;
}


/* 下拉筛选框数据类型 */
export interface SelectListData {
  id?: string;
  key?: string;
  code?: string;
  name?: string;
  text: string;
  value?: string;
  realname?: string;
  username?: string;
  department_id?: string;
  department?: ExpandData[];
}

/* 网关组别选择列表  */
export interface GroupListType {
  groupID: string,
  name: string,
}

/* 网关全部信息  */
export interface GroupListItem {
  id: string,
  name: string,
  description?: string,
  ttl?: number,
  rssiThreshold?: number
}

/* 选择group带出对应的配置值 */
export interface TagConfigType {
  groupID?: objectID,
  txPower?: number,
  broadcastInterval?: number,
  otaInterval?: number[],
  otaInterval2?: number,
  repeatBroadcast?: number,
}

/** 新增tag 更新参数定义 */
export interface TagUpdateType {
  id?: string,
  tagID: string,
  description: string,
}

/** 配置OTA 参数定义 */
export interface TagOTAType {
  version: String,
  id: objectID[],
}


/** 批量导入Tag参数定义 */
export interface ImportTagsType {
  total: number,
  data: {
    key?: number,
    tagID: string,
    description: string;
  }[]
}
