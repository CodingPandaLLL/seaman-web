export interface TableListItem {
  id: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  code: string;
  desp: string;
  defaultin: string;
  type: string;
  phone: number;
  status: number;
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
  status?: number;
  name?: string;
  code?: string;
  type?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
