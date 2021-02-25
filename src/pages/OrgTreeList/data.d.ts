export interface OrgListItem {
  createDate: Date;
  filed1: string;
  filed2: string;
  filed3: number;
  id: number;
  orgCode: number;
  orgName: string;
  pId: string;
}

export interface OrgTreeItem {
  children: OrgTreeItem[];
  key:number;
  title:string;
  createDate: Date;
  filed1: string;
  filed2: string;
  filed3: number;
  id: number;
  orgCode: number;
  orgName: string;
  pId: string;
}

export interface IOrgData {
  /**
   * 标识
   */

  id?: number;
  key?: number;

  /**
   * 机构名称
   */
  title?: string;
  orgName?: string;

  /**
   * 机构编码
   */
  orgCode?: string;

  /**
   * 备注
   */
  orgNote?: string;

  /**
   * 机构简称
   */
  filed1?: string;
  filed2?: string;
  filed3?: number;

  /**
   * 父级机构id
   */
  pId?: number;

  /**
   * 子节点
   */
  children?: IOrgData[];
}
