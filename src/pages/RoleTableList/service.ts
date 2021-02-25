import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryRole(params?: TableListParams) {
  return request('/service/appRole/pageList', {
    params,
  });
}

export async function removeRole(params: { key: number}) {
  return request('/service/appRole/'+params.key, {
    method: 'DELETE',
  });
}

export async function addRole(params: TableListItem) {
  return request('/service/appRole/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRole(params: TableListItem) {
  return request('/service/appRole', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
