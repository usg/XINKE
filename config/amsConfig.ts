// Global configuration in project

export default {
  system: 'asset', // 项目定义 asset/wafer
  otaPloy: 'group', // 标签/轻网关升级策略定义 group/list
  assetDashboard: {
    apicheck: true,
    mock: false,
  },
  assetManagement: {
    overview: {
      apicheck: true,
      mock: false,
    },
    transfer: {
      apicheck: true,
      mock: false,
    },
    services: {
      apicheck: true,
      mock: false,
    },
  },
  assetTracking: {
    apicheck: true,
    mock: false,
  },
  customField: {
    asset: {
      apicheck: true,
      mock: false,
    },
    user: {
      apicheck: true,
      mock: false,
    },
  },
  networkSetting: {
    gateway: {
      apicheck: true,
      mock: false,
    },
    litegateway: {
      apicheck: true,
      mock: false,
    },
    tag: {
      apicheck: true,
      mock: false,
    },
    group: {
      apicheck: true,
      mock: false,
    },
  },
  locationSetting: {
    mapSetting: {
      apicheck: true,
      mock: false,
    },
    calibration: {
      apicheck: true,
      mock: false,
    },
  },
  userSetting: {
    userList: {
      apicheck: true,
      mock: false,
    },
    roleList: {
      apicheck: true,
      mock: false,
    },
  },
  errMsgShowPeriod: 5,
  AMSShowMap: {
    showMarkersNums: 5760,
  },
  AMSShowMapCanvas: {
    showMarkersNums: 200000,
  },
  LocationCalibration: {
    /** 时间范围限制, 毫秒 */
    timeLimitMs: 28800000, // 8 * 60 * 60 * 1000
    apicheck: true,
    mock: false,
  },
  AMSColor: [
    '#5990F7',
    '#BCD2FE',
    '#5CD8A7',
    '#BDEEDA',
    '#5E7092',
    '#C3C8D5',
    '#F1C147',
    '#FCE4A2',
    '#E8694A',
    '#F7C3B7',
    '#6DC9EC',
    '#B6E2F8',
    '#9270CA',
    '#D3C7EA',
    '#FF9D4A',
    '#FFD8B5',
    '#289A99',
    '#AAD8D8',
    '#FF98C3',
    '#FED6E6',
  ],
  assetStatusColor: {
    InUse: '#5990F7',
    InIdle: '#5CD8A7',
    Scrapped: '#E8694A',
    InRepair: '#F1C147',
    InTransfer: '#289A99',
    InCheckIn: '#6DC9EC',
    InCheckOut: '#6DC9EC',
    InScrap: '#FF9D4A',
    Alarm: '#E8694A',
  },
  iconScriptUrl: `/ams/icons/iconfont.js?v=20201217`,
};
