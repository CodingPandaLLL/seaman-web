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

export async function removeProjectFile(params: { key: number}) {
  // console.log('pram========='+params.key);
  return request('/service/projectFile/'+params.key, {
    method: 'DELETE',
  });
}

export async function addProjectFile(params: TableListItem) {
  return request('/service/projectFile/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
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
