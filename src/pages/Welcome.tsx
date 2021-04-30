import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {Image} from 'antd';
import welcome from '../assets/welcome.gif';

export default (): React.ReactNode => {
  return (
    <PageContainer>
        <Image width={1340} src={welcome}/>
    </PageContainer>
  );
};
