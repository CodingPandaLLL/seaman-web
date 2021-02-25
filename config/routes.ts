export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/userTableList',
                name: 'userTableList',
                icon: 'table',
                component: './UserTableList',
              },
              {
                path: '/orgTreeList',
                name: 'orgTreeList',
                icon: 'cluster',
                component: './OrgTreeList',
              },
              {
                path: '/groupTableList',
                name: 'groupTableList',
                icon: 'team',
                component: './groupTableList',
              },
              {
                path: '/roleTableList',
                name: 'roleTableList',
                icon: 'team',
                component: './roleTableList',
              },
              {
                path: '/projectTableList',
                name: 'projectTableList',
                icon: 'project',
                component: './projectTableList',
              },
              {
                path: '/projectDetailList',
                //注释name，在菜单中不显示
                //name: 'projectDetailList',   
                icon: 'project',
                component: './projectDetailList',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './ListTableList',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
