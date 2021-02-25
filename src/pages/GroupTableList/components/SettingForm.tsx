import React, { useState, useEffect } from 'react';
import { Modal, Transfer,message } from 'antd';
import { useIntl } from 'umi';
import { TableListItem, UserListItem, TransferListItem } from '../data';
import { queryGroupMembers,updataGroupMembers } from '../service';
interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  record: TableListItem;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, record } = props;
  const [mockData, setMockData] = useState<TransferListItem[]>();
  const [targetKeys, setTargetKeys] = useState<string[]>();
  const intl = useIntl();

  //初始化请求
  useEffect(() => {
    getInitData();
  }, [record])


  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  const handleChange = (targetKeys: string[]) => {
    setTargetKeys(targetKeys);
  };

  const getInitData = () => {
    queryGroupMembers({ id: record?.id }).then((result) => {
      var data = new Array<TransferListItem>();
      var chosenKeys = new Array<string>();
      if (result) {
        for (let i = 0; i < result.length; i += 1) {
          var child: TransferListItem = {
            key: '',
            title: '',
            description: '',
          };
          child.key = result[i].id;
          child.title = result[i].lastname;
          child.description = result[i].account;
          if (result[i].backUp == 'chosen') {
            child.chosen = 1;
            chosenKeys.push(result[i].id);
          } else {
            child.chosen = 0;
          }
          data.push(child);
        }
        setMockData(data);
        setTargetKeys(chosenKeys);
        return true;
      }
    });
  };

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  const handleOk = () => {
    var userId = "";
    if (targetKeys) {
      for (let i = 0; i < targetKeys.length; i++) {
        if (i == targetKeys.length - 1) {
          userId = userId + targetKeys[i]
        } else {
          userId = userId + targetKeys[i] + ",";
        }
      }
    }
    console.log(userId)
    updataGroupMembers({ userIds: userId,groupId:record?.id }).then((result) => {
      if (result.status == 1) {
        message.success('添加成功');
        onCancel();
        return true;
      } else {
        message.error('添加失败请重试！');
        return false;
      }
    });
  };

  return (
    <Modal
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.searchTable.GroupSetting',
        defaultMessage: '配置',
      })}
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={handleOk}
    >
      <Transfer
        dataSource={mockData}
        showSearch
        filterOption={filterOption}
        listStyle={{
          width: 250,
          height: 500,
        }}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={item => item.title}
      />
      {props.children}
    </Modal>
  );
};

export default CreateForm;
