import { Request, Response } from 'express';
import moment from 'moment';

function getGatewayGroupList(req: Request, res: Response) {
  const groupData: {}[] = [];
  for (let i = 0; i < 9; i += 1) {
    groupData.push({
      id: `00000001${i}`,
      name: `name${i}`,
      description: `description${i}`,
      ttl: i,
      rssiThreshold: i * 2,
    });
  }
  const result = {
    total: 10,
    data: groupData,
  };
  return res.json(result);
}

function getFakeGatewayList(req: Request, res: Response) {
  const params = req.query;
  const search = params.search || null;
  let gatewayData = [];
  for (let i = 0; i < 12; i += 1) {
    gatewayData.push({
      id: `00000001${i}`,
      gatewayID: `00001111${i}`,
      name: `name${i}`,
      groupName: `groupName${i}`,
      status: 'online',
      version: 'v1.0.1',
      location: 'Main-3F-Woom',
      floorID: '54646465',
      coordinates: [1, 2],
      cpu: 20,
      ram: 30,
      time: moment().valueOf(),
    });
  }
  if (search) gatewayData = gatewayData.filter(item => item.gatewayID.indexOf(search) > -1);
  const result = {
    total: 100,
    data: gatewayData,
  };
  return res.json(result);
}

function postFakeGatewayAdd(req: Request, res: Response) {
  const params = req.body;
  const gatewayData = {
    id: (Math.random() * 10000000).toFixed(), // object ID(gateway ID)
    gatewayID: params.gatewayID, // 设备ID
    name: params.name, // 设备名称
    groupName: params.gatewayID, // 所属group名称
    status: 'Online', // 状态（Online，Offline，Reboot等）
    version: 'v1.0.0', // 版本号
    location: 'building/floor/room', // 位置信息（building_name/floor_name/room_name）
    coordinates: params.location.coordinates, // 录入的实际坐标(x,y), 单位米
    floorID: params.location.floorID, // 录入的楼层ID
    cpu: 60, // cpu占用率%
    ram: 60, // 内存占用率%
    time: moment().valueOf(), // 最后更新时间(时间戳)
  };
  const liteGatewayData = {
    id: (Math.random() * 10000000).toFixed(), // object ID(liteGateway ID)
    liteGatewayID: params.liteGatewayID, // 设备ID
    name: params.name, // 设备名称
    groupName: params.liteGatewayID, // 所属group名称
    coordinates: params.location.coordinates, // 录入的实际坐标(x,y), 单位米
    floorID: params.location.floorID, // 录入的楼层ID
  };
  const errData = {
    error: 100016, // 错误码
    message: 'Miss required parameter', // 错误信息
  };
  const result: any = {};
  if (params.gatewayID) {
    result.data = gatewayData;
  } else if (params.liteGatewayID) {
    result.data = liteGatewayData;
  } else {
    result.err = errData;
  }
  return res.json(result);
}

function postFakeGatewayUpdate(req: Request, res: Response) {
  const params = req.body;
  const gatewayData = {
    id: params.id, // object ID(gateway ID)
    gatewayID: params.gatewayID, // 设备ID
    name: params.name, // 设备名称
    groupName: params.gatewayID, // 所属group名称
    status: 'Online', // 状态（Online，Offline，Reboot等）
    version: 'v1.0.0', // 版本号
    location: 'building/floor/room', // 位置信息（building_name/floor_name/room_name）
    coordinates: params.location.coordinates, // 录入的实际坐标(x,y), 单位米
    floorID: params.location.floorID, // 录入的楼层ID
    cpu: 60, // cpu占用率%
    ram: 60, // 内存占用率%
    time: moment().valueOf(), // 最后更新时间(时间戳)
  };
  const liteGatewayData = {
    id: params.id, // object ID(liteGateway ID)
    liteGatewayID: params.liteGatewayID, // 设备ID
    name: params.name, // 设备名称
    groupName: params.liteGatewayID, // 所属group名称
    coordinates: params.location.coordinates, // 录入的实际坐标(x,y), 单位米
    floorID: params.location.floorID, // 录入的楼层ID
  };
  const errData = {
    error: 100016, // 错误码
    message: 'Miss required parameter', // 错误信息
  };
  const result: any = {};
  if (params.gatewayID) {
    result.data = gatewayData;
  } else if (params.liteGatewayID) {
    result.data = liteGatewayData;
  } else {
    result.err = errData;
  }
  return res.json(result);
}

function postFakeGatewayDelete(req: Request, res: Response) {
  const params = req.body;
  const result = {
    data: {
      id: params.id, // object ID(gateway ID)
    },
  };
  return res.json(result);
}

function postGatewayFirmwareUpload(req: Request, res: Response) {
  // const params = req.body;
  const result = {
    data: {
      devicesConfirm: true, // 设备类型校验结果
      checksumConfirm: true, // 和校验结果
      firmwareConfirm: true, // 固件校验结果
      version: 'v1.0.0', // 固件版本号
    },
  };
  return res.json(result);
}

function postFakeGatewayUpgrade(req: Request, res: Response) {
  const params = req.body;
  const result = {
    data: {
      id: params.id, // object ID(gateway ID)
    },
  };
  return res.json(result);
}

function postFakeGatewayReboot(req: Request, res: Response) {
  const params = req.body;
  const result = {
    data: {
      version: params.version,
      group: params.group,
    },
  };
  return res.json(result);
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET  /apiDevice/device/group/list': getGatewayGroupList,
  'GET  /apiDevice/device/device/gwlist': getFakeGatewayList,
  'POST  /apiDevice/device/device/add': postFakeGatewayAdd,
  'POST  /apiDevice/device/device/update': postFakeGatewayUpdate,
  'POST  /apiDevice/device/device/delete': postFakeGatewayDelete,
  'POST  /apiDevice/device/device/gwuploadfirmware': postGatewayFirmwareUpload,
  'POST  /apiDevice/device/device/gwupgrade': postFakeGatewayUpgrade,
  'POST  /apiDevice/device/device/gwreboot': postFakeGatewayReboot,
};
