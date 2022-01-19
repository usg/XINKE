// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response }  from 'express'; 

// Tag 列表信息
function getTagList(req: Request, res: Response,) {
    const params = req.query;
    const search = params.search || null;
    let tagData = [];
    for (let i = 0; i < 32; i += 1) {
      tagData.push({
        id: `00000001${i}`,
        tagID: `00001${i}`,
        status: 'Offline',
        description: `desc${i}`,
        version: 'v1.0.1',
        battery: '80',
        txPower: '240',
        rssi:'60',
        prr: 90,              
        broadcastInterval: 30,
        otaInterval: 500,      
        time:1587456602073, 
        key:`abs${i}`
      });
    }
    if (search) tagData = tagData.filter(item => item.tagID.indexOf(search) > -1);
    const result = {
      total: tagData.length,
      data: tagData,
    };
    return res.json(result);
  }

// 获取组列表
const getGatewayGroup = (req: { query: any }, res: { json: (arg0: any) => void }) => {
  const gatewayGroupList={
    data:[
      {id:'34dac1a00001',name:'n1'},
      {id:'34dac1a00002',name:'n2'},
      {id:'34dac1a00003',name:'n3'},
    ],
    total:3
  }
  return res.json(gatewayGroupList);
};

// Tag 删除处理
const deleteTagByID = (req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.body;
  const search = params.id || null;
  return res.json({id:search});
};

// Tag 添加处理
const addTag = (req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.body;
  const result = {
    data: {
      id: Math.random()*100000,
      tagID: params.tagID, 
      description: params.description, 
    },
  };
  return res.json(result);
};

// Tag 编辑处理
const editTag = (req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.body;
  const result = {
    data: {
      id: params.id,
      tagID: params.tagID, 
      description: params.description, 
    },
  };
  return res.json(result);
};

// 配置tag
const configTag = (req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.body;
  const result = {
          groupID: params.groupID, 
          txPower: params.txPower,          
          broadcastInterval: params.broadcastInterval,
          otaInterval: params.otaInterval,    
          repeatBroadcast: params.repeatBroadcast,  
  };
  return res.json(result);
};

// 获取tag配置信息
const  getTagConfig =(req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.query;
  const result = {
    data: {
      groupID: params.groupID, 
      txPower: 6 + Math.round(Math.random()*10), 
      broadcastInterval: 15+ Math.round(Math.random()*10), 
      otaInterval: [5 + Math.round(Math.random()*10),6+ Math.round(Math.random()*10)],
      repeatBroadcast: 5 + Math.round(Math.random()*20), 
    },
  };
  return res.json(result);
};

// 更新ota
const  tagUpgrade =(req: { query: any }, res: { json: (arg0: any) => void }) => {
  const params = req.query;
  return res.json(params);
};

// 导入tag数据
const  tagAddList =(req: { body: any }, res: { json: (arg0: any) => void }) => {
  const params = req.body;
  return res.json(params);
};


export default {
  'GET  /apiTagList': getTagList,
  'GET  /apiMeshGroupList': getGatewayGroup,
  'GET  /apiTagConfigGet': getTagConfig,
  'POST /apiTagDelete': deleteTagByID,
  'POST /apiTagAdd': addTag,
  'POST /apiTagEdit': editTag,
  'POST /apiTagConfig': configTag,
  'POST /apiTagUpgrade': tagUpgrade,
  'POST /apiTagAddList': tagAddList,
};
