export interface TableListItem {
  id: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  account: string;
  lastname: string;
  organization: string;
  defaultin: string;
  email: string;
  phone: number;
  status: string;
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