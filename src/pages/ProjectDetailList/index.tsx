import { message, Form, Tabs, Button,Upload } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import env from '../../../config/env';
import { TableListItem } from './data';
import { queryProjectFileList } from './service';
import styles from './index.less';
import { FileImageOutlined, FileOutlined, FileExcelOutlined, FileUnknownOutlined, FileZipOutlined, FileWordOutlined, FileTextOutlined, FilePptOutlined, FilePdfOutlined, FileMarkdownOutlined ,UploadOutlined} from '@ant-design/icons';
const { TabPane } = Tabs;




const ProjectFileList: React.FC<{}> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [deltetModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [imgNum, setImgNum] = useState<number>();
  const [record, setRecord] = useState<TableListItem>();
  const [imageRows, setImageRows] = useState<TableListItem[]>([]);
  const [fileRows, setFileRows] = useState<TableListItem[]>([]);
  const intl = useIntl();
  const [projectForm] = Form.useForm();

  //初始化请求
  useEffect(() => {
    getProjectFiles();
  }, [])


  /**
* 查询数据
* @param values TableListItem
*/
  const getProjectFiles = () => {
    var values = props.location.data;
    try {
      queryProjectFileList(values).then((result) => {
        if (result.httpError) {
          message.error(result.message);
        } else if (result) {
          let images = new Array<TableListItem>();
          let files = new Array<TableListItem>();
          for (var i = 0; i < result.length; i++) {
            if ('bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif'.indexOf(result[i].attachType) > -1) {
              images.push(result[i]);
            } else {
              files.push(result[i]);
            }
          }
          setImageRows(images);
          setFileRows(files);
        }
      });
    } catch (error) {
      message.error('修改失败请重试！');
      return false;
    }
  };

  /**
   * 下载文件
   */
  const downloadFile = (record: TableListItem) => {
    window.open(env.API_FILE_URL+record.id);
  };

  /**
 * 添加节点
 * @param fields
 */
  const handleAdd = async (fields: TableListItem) => {
    const hide = message.loading('正在添加');
    try {
      await addProject({ ...fields }).then((result) => {
        if (result.status == 1) {
          hide();
          message.success('添加成功');
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
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

  /**
 *  删除节点
 * @param record
 */
  const handleRemove = async (record: TableListItem) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      removeProject({ key: record.id }).then((result) => {
        if (result.status == 1) {
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
   * 返回到的项目列表
   */
  const turnBack = () => {
    props.history.push({pathname:'/projectTableList',data:{},});
  };

  /**
 * 更新状态
 */
  const handleUpdateStatus = (values: TableListItem) => {
    console.log(values);
    const hide = message.loading('正在更新');
    try {
      if (values.status == '1') {
        values.status = '0';
      } else {
        values.status = '1';
      }
      values.createDate = null;
      updateProject(values).then((result) => {
        if (result.status == '1') {
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
  const uploadProps ={
    showUploadList:false,
    onChange(info) {
      debugger;
      message.error(`${info.file.name} file upload failed.`);
    },
  }

  return (
    <PageContainer title="项目文件详情">
      <Button type="default" onClick={() => turnBack()}>返回</Button>
      <Upload  {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传</Button>
      </Upload>
      
      <Tabs tabPosition='left' type="card">
        <TabPane tab={
          <span>
            <FileImageOutlined />
         图片
        </span>
        } key="1">
          {imageRows?.length > 0 && imageRows.map((item, index) => {
            return <img className={styles.imgMain} src={env.IMG_URL + item.id}></img>
          })}
        </TabPane>
        <TabPane tab={
          <span>
            <FileOutlined />
         文件
        </span>
        } key="2">
          {fileRows?.length > 0 && fileRows.map((item, index) => {
            if (item.attachType == 'md') {
              return <span className={styles.fileMoudle}><FileMarkdownOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'pdf') {
              return <span className={styles.fileMoudle}><FilePdfOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'ppt') {
              return <span className={styles.fileMoudle}><FilePptOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'txt') {
              return <span className={styles.fileMoudle}><FileTextOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'doc') {
              return <span className={styles.fileMoudle}><FileWordOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'xls') {
              return <span className={styles.fileMoudle}><FileExcelOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else if (item.attachType == 'zip') {
              return <span className={styles.fileMoudle}><FileZipOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            } else {
              return <span className={styles.fileMoudle}><FileUnknownOutlined style={{ fontSize: '100px', color: '#08c' }} onClick={() => downloadFile(item)} /><span>{item.fileName}</span></span>
            }
          })}
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default ProjectFileList;
