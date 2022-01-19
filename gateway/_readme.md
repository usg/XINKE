# Gateway

## 使用

### 页面部署

```
将目录overview拷贝至src/pages/networkSetting/gateway目录下即可
```

### 路由配置

在项目根目录下的 config/config.js 文件中添加:

```
{
    name: 'networkSetting',
    icon: 'ClusterOutlined',
    path: '/networkSetting',
    authority: ['Deployment', 'Administrator', 'SuperAdmin'],
    routes: [
        {
          path: '/networkSetting',
          redirect: '/networkSetting/gateway',
        },
        {
          name: 'gateway',
          path: '/networkSetting/gateway',
          component: './networkSetting/gateway',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/networkSetting/gateway',
              redirect: '/networkSetting/gateway/overview',
            },
            {
              path: '/networkSetting/gateway/overview',
              component: './networkSetting/gateway/overview',
            },
          ],
        },
    ],
}
```

### 菜单语言

如配置英文, 在 src/locales/en-US/menu.js 中添加如下：

```
'menu.networkSetting.gateway': 'Gateway',
```

如配置中文, 在 src/locales/zh-US/menu.js 中添加如下：

```
'menu.networkSetting.gateway': '网关',
```
