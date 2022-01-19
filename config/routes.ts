import config from './amsConfig';

// 设置路由
const { system } = config;

let menuRoutes: any[] = [];

if (system === 'asset') {
  menuRoutes = [
    {
      path: '/',
      redirect: '/assetDashboard',
    },
    {
      name: 'dashboard',
      icon: 'FundProjectionScreenOutlined',
      path: '/assetDashboard',
      // component: './assetDashboard',
    },
    {
      name: 'assetManagement',
      icon: 'TagsOutlined',
      path: '/assetManagement',
      authority: ['Deployment', 'Administrator', 'SuperAdmin'],
      routes: [
        {
          path: '/assetManagement',
          redirect: '/assetManagement/overview',
        },
        {
          name: 'assetOverview',
          path: '/assetManagement/overview',
          // component: './assetManagement/overview',
        },
        {
          name: 'assetTransfer',
          path: '/assetManagement/transfer',
          // component: './assetManagement/transfer',
        },
        {
          name: 'assetServices',
          path: '/assetManagement/services',
          // component: './assetManagement/services',
        },
      ],
    },
    {
      name: 'assetTracking',
      icon: 'EnvironmentOutlined',
      path: '/assetTracking',
      // component: './assetTracking',
    },
    {
      name: 'systemSetting',
      icon: 'SettingOutlined',
      authority: ['Deployment', 'Administrator', 'SuperAdmin'],
      routes: [
        {
          path: '/systemSetting',
          redirect: '/systemSetting/customField',
        },
        {
          name: 'customField',
          path: '/customField',
          component: './customField',
          authority: ['Deployment', 'Administrator', 'SuperAdmin'],
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/customField',
              redirect: '/customField/asset',
            },
            {
              path: '/customField/asset',
              // component: './customField/asset',
            },
            {
              path: '/customField/user',
              // component: './customField/user',
            },
          ],
        },
        {
          name: 'networkSetting',
          path: '/networkSetting',
          component: './networkSetting',
          authority: ['Deployment', 'Administrator', 'SuperAdmin'],
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/networkSetting',
              redirect: '/networkSetting/tag',
            },
        
            {
              path: '/networkSetting/overview',
              // component: './networkSetting/overview',
            },
        
            {
              path: '/networkSetting/gateway',
              component: './networkSetting/gateway',
            },
            {
              path: '/networkSetting/liteGateway',
              component: './networkSetting/liteGateway',
            },
          
           {
            name: 'tag',
            path: '/networkSetting/tag',
            component: './networkSetting/tag',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/networkSetting/tag',
                redirect: '/networkSetting/tag/overview',
              },
              {
                path: '/networkSetting/tag/overview',
                component: './networkSetting/tag/overView',
              },
              {
                path: '/networkSetting/tag/status',
                component: './networkSetting/tag/status',
              },
            ],
          },
            {
              path: '/networkSetting/group',
              component: './networkSetting/group',
            },
            {
              path: '/networkSetting/status',
              // component: './networkSetting/status',
            },
          ],
        },
        {
          name: 'locationSetting',
          path: '/locationSetting',
          component: './locationSetting',
          authority: ['Deployment', 'Administrator', 'SuperAdmin'],
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/locationSetting',
              redirect: '/locationSetting/mapSetting',
            },
            {
              path: '/locationSetting/mapSetting',
              // component: './locationSetting/mapSetting',
            },
            {
              path: '/locationSetting/calibration',
              // component: './locationSetting/calibration',
            },
          ],
        },
        {
          name: 'userSetting',
          path: '/userSetting',
          component: './userSetting',
          authority: ['Administrator', 'SuperAdmin'],
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/userSetting',
              redirect: '/userSetting/userList',
            },
            {
              path: '/userSetting/userList',
               component: './userSetting/userList',
            },
            {
              path: '/userSetting/departmentList',
               component: './userSetting/departmentList',
            },
          ],
        },
        {
          name: 'systemConfig',
          path: '/systemConfig',
          // component: './systemConfig',
        },
      ],
    },
    {
      component: '404',
    },
  ];
}

const customRoutes: any[] = [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          {
            name: 'reset',
            path: '/user/reset',
            component: './user/reset',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: menuRoutes,
      },
    ],
  },
];

export default customRoutes;
