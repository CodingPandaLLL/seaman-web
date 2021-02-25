import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Modal, Drawer, Form, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryUser, updateUser, addUser, removeUser } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields }).then((relust) => {
      if (relust.status == 1) {
        hide();
        message.success('添加成功');
        return true;
      } else {
        hide();
        message.error('添加失败请重试！');
        return false;
      }
    });
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};


const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [deltetModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [record, setRecord] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const intl = useIntl();
  const [userForm] = Form.useForm();


  /**
 *  删除节点
 * @param record
 */
  const handleRemove = async (record: TableListItem) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      removeUser({ key: record.id }).then((relust) => {
        if (relust.status == 1) {
          handleDeleteModalVisible(false)
          actionRef.current?.reloadAndRest?.();
          hide();
          message.success('删除成功，即将刷新');
          return true;
        } else {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
      });
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  /**
   * 给form填充数据
   */
  const onFill = (record: TableListItem) => {
    userForm.setFieldsValue({
      id: record?.id,
      account: record?.account,
      lastname: record?.lastname,
      email: record?.email,
      phone: record?.phone,
      organization: record?.organization,
    });
  };

  /**
   * form提交数据
   * @param values TableListItem
   */
  const onFinish = (values: TableListItem) => {
    const hide = message.loading('正在修改');
    try {
      updateUser(values).then((relust) => {
        if (relust.status == 1) {
          hide();
          message.success('修改成功');
          handleUpdateModalVisible(false)
          actionRef.current?.reloadAndRest?.();
          return true;
        } else {
          hide();
          message.error('修改失败请重试！');
          return false;
        }
      });
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
      return false;
    }
  };

    /**
   * 更新状态
   */
  const handleUpdateStatus = (values: TableListItem) => {
    console.log(values);
    const hide = message.loading('正在更新');
    try {
      if(values.status=='1'){
        values.status='0';
      }else{
        values.status='1';
      }
      updateUser(values).then((relust) => {
        if (relust.status == 1) {
          hide();
          message.success('更新成功');
          handleUpdateModalVisible(false)
          actionRef.current?.reloadAndRest?.();
          return true;
        } else {
          hide();
          message.error('更新失败请重试！');
          return false;
        }
      });
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.account"
          defaultMessage="账号"
        />
      ),
      dataIndex: 'account',
      tip: '账号是唯一',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="账号为必填项" />
            ),
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleLastname" defaultMessage="姓名" />,
      dataIndex: 'lastname',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titleLastname" defaultMessage="姓名为必填项" />
            ),
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleEmail" defaultMessage="邮箱" />,
      dataIndex: 'email',
      search: false,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titleEmail" defaultMessage="邮箱为必填项" />
            ),
          },
          {
            type: 'email',
            message: (
              <FormattedMessage id="pages.searchTable.titleEmail" defaultMessage="邮箱格式错误" />
            ),
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titlePhone" defaultMessage="手机" />,
      dataIndex: 'phone',
      search: false,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titlePhone" defaultMessage="手机为必填项" />
            ),
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOrganization" defaultMessage="部门" />,
      dataIndex: 'organization',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titleOrganization" defaultMessage="部门为必填项" />
            ),
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDefaultin" defaultMessage="内置" />,
      dataIndex: 'defaultin',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titleDefaultin" defaultMessage="内置为必填项" />
            ),
          },
        ],
      },
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.searchTable.titleDefaultin.default" defaultMessage="是" />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.titleDefaultin.running" defaultMessage="否" />
          ),
          status: 'Processing',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态" />,
      dataIndex: 'status',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态为必填项" />
            ),
          },
        ],
      },
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.searchTable.titleStatus.default" defaultMessage="停用" />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.titleStatus.running" defaultMessage="启用" />
          ),
          status: 'Processing',
        },
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.titleCreateDate" defaultMessage="创建时间" />
      ),
      dataIndex: 'create_date',
      hideInTable: true,
      hideInForm: true,
      search: false,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {

              onFill(record);
              handleUpdateModalVisible(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.update" defaultMessage="修改" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => {
            setRecord(record);
            handleDeleteModalVisible(true);
          }}>
            <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => {
            handleUpdateStatus(record);
          }}>
            <FormattedMessage id={record.status=='1'?"pages.searchTable.StopStatus":"pages.searchTable.StartStatus"}  defaultMessage={record.status=='1'?"停用":"启用"} />
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchUserTable.title',
          defaultMessage: '查询用户信息',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={(params, sorter, filter) => queryUser({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{ pageSize: 10 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="批量审批" />
          </Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
      <UpdateForm onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
        <Form form={userForm} onFinish={onFinish}>
          <Form.Item
            label=""
            name="id"
            style={{ display: "none" }}
          >
            <Input type="hidden" disabled />
          </Form.Item>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: '账号必填' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="lastname"
            rules={[{ required: true, message: '姓名必填' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '邮箱必填' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机"
            name="phone"
            rules={[{ required: true, message: '手机号必填' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="部门"
            name="organization"
            rules={[{ required: true, message: '部门必填' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button htmlType="button" onClick={() => handleUpdateModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </UpdateForm>
      <Modal visible={deltetModalVisible} onOk={() => handleRemove(record)} onCancel={() => handleDeleteModalVisible(false)}>
        <p>确定删除吗？</p>
      </Modal>
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.account && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.account}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
