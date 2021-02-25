import { Tree, Input, Form, Button, message,Modal} from 'antd';
import React, { useState, useEffect } from 'react';
import { IOrgData } from './data';
import { queryOrgList, updateOrg, addOrg,removeOrg } from './service';
import styles from './index.less';


const { Search } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const OrgTreeList = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>();
  const [setSearchValue] = useState<String>();
  const [autoExpandParent, setExpandParent] = useState<Boolean>();
  const [treeData, setTreeData] = useState<IOrgData[]>();
  const [selectedNode, setSelectedNode] = useState<IOrgData>();
  const [orgInfoform] = Form.useForm();
  const [deltetModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys)
    setExpandParent(false)
  };

  const onChange = (e: any) => {
    const { value } = e.target;
    setSearchValue(value);
    setExpandedKeys(expandedKeys);
    setExpandParent(true);
  };

  const onFinish = (values: any) => {
    setSelectedNode(values);
    console.log(values);
    const hide = message.loading('正在新增');
    try {
      if (values.pId != undefined && values.pId != '') {
        addOrg(values).then((relust) => {
          if (relust.status == 1) {
            hide();
            message.success('新增成功');
            getTreeData();
            return true;
          } else {
            hide();
            message.error('新增失败请重试！');
            return false;
          }
        });
      } else {
        updateOrg(values).then((relust) => {
          if (relust.status == 1) {
            hide();
            message.success('更新成功');
            getTreeData();
            return true;
          } else {
            hide();
            message.error('更新失败请重试！');
            return false;
          }
        });
      }
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }
  };

  const handleAddOrg = () => {
    console.log(selectedNode)
    if (!selectedNode || selectedNode.key == null || selectedNode == undefined) {
      message.warning("请选择关联父节点");
    } else {
      orgInfoform.resetFields();
      orgInfoform.setFieldsValue({ pId: selectedNode.id })
    }
  }

  const handleDeleteOrg = () => {
    removeOrg({ key: selectedNode.id }).then((relust) => {
      if (relust.status == 1) {
        message.success('删除成功');
        getTreeData();
        orgInfoform.resetFields();
        handleDeleteModalVisible(false);
        setSelectedNode(undefined);
        return true;
      } else {
        message.error('删除失败请重试！');
        return false;
      }
    });
  }

  const handleDeleteOrgModal = () => {
    if (!selectedNode || selectedNode.key == null || selectedNode == undefined) {
      message.warning("请选择节点");
      return false
    } else {
      if (selectedNode?.pId == null || selectedNode?.pId == 0) {
        message.error("根节点不可删除");
        return false
      }else{
        handleDeleteModalVisible(true);
      }
    }
  }

  //初始化请求
  useEffect(() => {
    getTreeData();
  }, [])

  const onSelect = (keys: React.Key[], info: any) => {
    setSelectedNode(info.node);
    orgInfoform.setFieldsValue({
      orgName: info.node.orgName,
      orgCode: info.node.orgCode,
      orgNote: info.node.orgNote,
      filed1: info.node.filed1,
      id: info.node.key,
    });
  };


  // 获取组织树
  const getTreeData = () => {
    queryOrgList().then((data) => {
      if (!data.httpError) {
        let target: IOrgData = {
          key: 0,
          children: [],
        };
        if (data) {
          for (let i = 0; i < data.length; i += 1) {
            data[i].title = data[i].orgName;
            data[i].key = data[i].id;
            if (!data[i].pId || data[i].pId == 0) {
              if (target.children) {
                target.children.push(data[i]);
              }
            }
          }
          if (target && target.children && target.children.length) {
            for (let i = 0; i < target.children.length; i += 1) {
              target.children[i].children = [];
              calculTreeData(target.children[i], data as IOrgData[]);
            }
          }
          setTreeData(target.children);
          return target.children;
        }
      } else {
        message.error(data.message);
      }
    });
  };

  const calculTreeData = (target: IOrgData, source: IOrgData[]) => {
    for (let i = 0; i < source.length; i += 1) {
      if (target.id === source[i].pId) {
        if (target.children) {
          source[i].children = [];
          target.children.push(source[i]);
        }
        calculTreeData(source[i], source);
      }
    }
  };

  return (
    <div>
      <div className={styles.treeContent}>
        <Search style={{ marginBottom: 8 }} placeholder="请输入" onChange={onChange} />
        <Tree className={styles.tree}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          onSelect={onSelect}
        />
      </div>
      <div className={styles.detailContent}>
        <Form className={styles.detailForm} {...layout} form={orgInfoform} name="control-hooks" onFinish={onFinish}>
          <Form.Item {...tailLayout}>
            <Button htmlType="button" type="primary" onClick={() => handleAddOrg()}>
              新增
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button htmlType="button" type="primary" onClick={() => handleDeleteOrgModal()}>
              删除
            </Button>
          </Form.Item>
          <Form.Item
            label=""
            name="id"
            style={{ display: "none" }}
          >
            <Input type="hidden" disabled />
          </Form.Item>
          <Form.Item
            label=""
            name="pId"
            style={{ display: "none" }}
          >
            <Input type="hidden" disabled />
          </Form.Item>
          <Form.Item name="orgName" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="orgCode" label="编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="orgNote" label="部门节点">
            <Input />
          </Form.Item>
          <Form.Item name="filed1" label="备注1">
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存
          </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal visible={deltetModalVisible} onOk={() => handleDeleteOrg()} onCancel={() => handleDeleteModalVisible(false)}>
        <p>确定删除吗？</p>
      </Modal>
    </div>
  );
}

export default OrgTreeList;
