import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryOrg(params?: TableListParams) {
  return request('/service/org/pageList', {
    params,
  });
}

export async function queryOrgList() {
  return request('/service/org/list', {
  });
}

export async function removeOrg(params: { key: number}) {
  // console.log('pram========='+params.key);
  return request('/service/org/'+params.key, {
    method: 'DELETE',
  });
}

export async function addOrg(params: TableListItem) {
  return request('/service/org/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateOrg(params: TableListItem) {
  return request('/service/org', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
