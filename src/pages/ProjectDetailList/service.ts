import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryProjectFile(params?: TableListParams) {
  return request('/service/projectFile/pageList', {
    params,
  });
}

export async function queryProjectFileList(params?: TableListParams) {
  return request('/service/projectFile/list', {
    params,
  });
}

export async function removeProjectFile(params: {projectId:number, id: number}) {
  // console.log('pram========='+params.key);
  return request('/service/projectFile/'+params.projectId+'/'+params.id, {
    method: 'DELETE',
  });
}

//上传文件
export async function addProjectFile(params: { key: number,file:File}) {
  const formData = new FormData();
  formData.append('file', params.file);
  return request('/service/projectFile/'+params.key, {
    method: 'POST',
    body: formData,
  });
}

export async function updateProjectFile(params: TableListItem) {
  return request('/service/projectFile', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
