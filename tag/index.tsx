import React, { Component } from 'react';
import { Typography } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import styles from './style.less';

const { Title } = Typography;

interface TagProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

class Tag extends Component<TagProps> {
  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'status':
        router.push(`${url}/status`);
        break;
      case 'overview':
        router.push(`${url}/overview`);
        break;

      default:
        break;
    }
  };

  getTabKey = () => {
    const { match, location } = this.props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'overview';
  };

  render() {
    const tabList = [
      {
        key: 'overview',
        tab: formatMessage({ id: 'networkSetting.tag.tab.overview' }),
      },
      {
        key: 'status',
        tab: formatMessage({ id: 'networkSetting.tag.tab.status' }),
      },
    ];

    const { children } = this.props;

    return (
      <div>
        <Title level={4} style={{ marginBottom: 2, marginTop: 2 }}>
          {formatMessage({ id: 'networkSetting.tag.tab.title' })}
        </Title>
        <div className={styles.bodyWrapper}>
          <PageHeaderWrapper
            title={false}
            tabList={tabList}
            tabActiveKey={this.getTabKey()}
            onTabChange={this.handleTabChange}
          >

            {children}
          </PageHeaderWrapper>

        </div>
      </div>
    );
  }
}

export default Tag;
