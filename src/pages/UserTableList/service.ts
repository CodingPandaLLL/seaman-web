import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryUser(params?: TableListParams) {
  return request('/service/user/pageList', {
    params,
  });
}

export async function queryUserList(params?: TableListParams) {
  return request('/service/user/list', {
    params,
  });
}

export async function removeUser(params: { key: number}) {
  // console.log('pram========='+params.key);
  return request('/service/user/'+params.key, {
    method: 'DELETE',
  });
}

export async function addUser(params: TableListItem) {
  return request('/service/user/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params: TableListItem) {
  return request('/service/user', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
