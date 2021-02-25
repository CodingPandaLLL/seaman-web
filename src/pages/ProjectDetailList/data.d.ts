export interface TableListItem {
  id: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  projectName: string;
  projectCode: string;
  projectDesc: string;
  createUserName: string;
  createUserId: string;
  createDate: Date;
  status: string;
  filePath: string;
  fileName: string;
  fileSize: string;
  fileUid: string;
  attachType: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
