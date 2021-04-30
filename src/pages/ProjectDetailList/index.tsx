import {Button, Image, message, Tabs, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  FileExcelOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined,
  UploadOutlined
} from '@ant-design/icons';
import env from '../../../config/env';
import {TableListItem} from './data';
import {addProjectFile, queryProjectFileList, removeProjectFile} from './service';
import ManageFileForm from './components/ManageFileForm';
import styles from './index.less';

const {TabPane} = Tabs;


const ProjectFileList: React.FC<{}> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [imgNum, setImgNum] = useState<number>();
  const [file, setFile] = useState<TableListItem>();
  const [imageRows, setImageRows] = useState<TableListItem[]>([]);
  const [fileRows, setFileRows] = useState<TableListItem[]>([]);
  const [projectId, setProjectId] = useState<number>();

  // 初始化请求
  useEffect(() => {
    getProjectFiles();
  }, [])


  /**
   * 查询数据
   * @param values TableListItem
   */
  const getProjectFiles = () => {
    const values = props.location.data;
    if (props.location.data && props.location.data.id) {
      setProjectId(props.location.data.id)
      try {
        queryProjectFileList(values).then((result) => {
          if (result.httpError) {
            message.error(result.message);
          } else if (result) {
            const images = new Array<TableListItem>();
            const files = new Array<TableListItem>();
            for (let i = 0; i < result.length; i++) {
              if ('bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif,jpeg'.indexOf(result[i].attachType) > -1) {
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
    } else {
      message.error('未找到项目编号~');
      props.history.push({pathname: '/projectTableList', data: {},});
    }

  };

  /**
   * 下载文件
   */
  const downloadFile = () => {
    window.open(env.API_FILE_URL + file?.id);
    handleUpdateModalVisible(false);
  };

  /**
   * 删除图片
   */
  const deleteImage = () => {
    try {
      removeProjectFile({
        projectId: projectId !== undefined ? projectId : -1,
        id: (imgNum !== undefined && imgNum !== -1) ? imgNum : file?.id
      }).then((result) => {
        if (result.status === 1) {
          handleUpdateModalVisible(false);
          getProjectFiles();
          message.success('删除成功，即将刷新');
          return true;
        }
        message.error('删除失败，请重试');
        return false;

      });
    } catch (error) {
      message.error('删除失败，请重试');
      return false;
    }

  }

  /**
   * 返回到的项目列表
   */
  const turnBack = () => {
    props.history.push({pathname: '/projectTableList', data: {},});
  };


  /**
   * 上传文件
   */
  const uploadProps = {
    name: 'file',
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status == 'done') {
        const values = {key: props.location.data.id, file: info.file.originFileObj};
        addProjectFile(values).then((result) => {
          if (result.status == '1') {
            message.success('新增成功');
            getProjectFiles();
            return true;
          }
          message.error('新增失败请重试！');
          return false;

        });
      }
    },
  }
  /**
   * 显示图片的弹窗
   * @param id
   */
  const manageImage = (id: any) => {
    setImgNum(id);
    setFile(null)
    handleUpdateModalVisible(true);
  }

  /**
   * 显示文件弹出
   * @param record
   */
  const manageFile = (record: TableListItem) => {
    setImgNum(-1);
    setFile(record)
    handleUpdateModalVisible(true);
  };
  const downloadAll = (record: TableListItem) => {
    message.info('功能开发中~');
  }

  return <PageContainer title="项目文件详情">
    <Button type="default" onClick={() => turnBack()}>返回</Button>
    <Upload  {...uploadProps}>
      <Button icon={<UploadOutlined/>}>上传</Button>
    </Upload>
    <Button type="default" onClick={() => downloadAll()}>打包下载</Button>
    <Tabs tabPosition='left' type="card">
      <TabPane tab={
        <span>
          <FileImageOutlined/>
       图片
      </span>
      } key="1">
        {imageRows?.length > 0 && imageRows.map((item, index) => {
          return <Image onClick={() => manageImage(item.id)} preview={false} className={styles.imgMain}
                        src={env.IMG_URL + item.id}/>
        })}
      </TabPane>
      <TabPane tab={
        <span>
          <FileOutlined/>
       文件
      </span>
      } key="2">
        {fileRows?.length > 0 && fileRows.map((item, index) => {
          if (item.attachType == 'md') {
            return <span className={styles.fileMoudle}><FileMarkdownOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                             onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'pdf') {
            return <span className={styles.fileMoudle}><FilePdfOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                        onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'ppt') {
            return <span className={styles.fileMoudle}><FilePptOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                        onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'txt') {
            return <span className={styles.fileMoudle}><FileTextOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                         onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'doc') {
            return <span className={styles.fileMoudle}><FileWordOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                         onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'xls') {
            return <span className={styles.fileMoudle}><FileExcelOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                          onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          if (item.attachType == 'zip') {
            return <span className={styles.fileMoudle}><FileZipOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                        onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>
          }
          return <span className={styles.fileMoudle}><FileUnknownOutlined style={{fontSize: '100px', color: '#08c'}}
                                                                          onClick={() => manageFile(item)}/><span>{item.fileName}</span></span>

        })}
      </TabPane>
    </Tabs>
    <ManageFileForm onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}
                    deleteImage={() => deleteImage()} downloadFile={() => downloadFile()}>
      {imgNum !== -1 ? <Image preview={false} src={env.IMG_URL + imgNum}/> :
        <span className={styles.fileMoudle}><FileUnknownOutlined
          style={{fontSize: '100px', color: '#08c'}}/><span>{file?.fileName}</span></span>}
    </ManageFileForm>
  </PageContainer>;
};

export default ProjectFileList;
