import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryGroup(params?: TableListParams) {
  return request('/service/appGroup/pageList', {
    params,
  });
}

export async function queryGroupMembers(params: { id: number}) {
  return request('/service/appGroup/groupMembers/'+params?.id, {
    method: 'GET',
  });
}

export async function removeGroup(params: { key: number}) {
  return request('/service/appGroup/'+params.key, {
    method: 'DELETE',
  });
}

export async function addGroup(params: TableListItem) {
  params.status = Number(params.status);
  params.defaultin = Number(params.defaultin);
  return request('/service/appGroup/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateGroup(params: TableListItem) {
  return request('/service/appGroup', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function updataGroupMembers(params: {userIds: string,groupId:number}) {
  return request('/service/appGroup/updateGroupMembers', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
