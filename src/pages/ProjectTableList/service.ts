import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryProject(params?: TableListParams) {
  return request('/service/project/pageList', {
    params,
  });
}

export async function queryProjectList(params?: TableListParams) {
  return request('/service/project/list', {
    params,
  });
}

export async function removeProject(params: { key: number}) {
  // console.log('pram========='+params.key);
  return request('/service/project/'+params.key, {
    method: 'DELETE',
  });
}

export async function addProject(params: TableListItem) {
  return request('/service/project/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateProject(params: TableListItem) {
  return request('/service/project', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
