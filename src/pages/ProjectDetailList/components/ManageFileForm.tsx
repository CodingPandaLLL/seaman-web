import React from 'react';
import { Button,Modal } from 'antd';
import { useIntl } from 'umi';

import { TableListItem } from '../data';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  // @ts-ignore
  const { modalVisible, onCancel, deleteImage,downloadFile} = props;
  const intl = useIntl();
  let buttons = [];
  buttons = [
    <Button type="primary" onClick={() => onCancel()} key="test">
      取消
    </Button>,
    <Button type="primary" onClick={() => deleteImage()}>
      删除
    </Button>,
    <Button type="primary" onClick={() => downloadFile()}>
      下载
    </Button>
  ];
  return (
    <Modal
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.searchTable.updateForm.newRule',
        defaultMessage: '预览',
      })}
      visible={modalVisible}
      width={1600}
      onCancel={() => onCancel()}
      footer={buttons}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
