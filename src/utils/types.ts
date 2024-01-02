export interface NewsData {
  pk: string;
  type: Type;
  title: string;
  url: string;
  content: string;
  org: string;
  p_date: string;
  preview: string;
}

export enum Type {
  发展改革工作 = '发展改革工作',
  委属单位话发改 = '委属单位话发改',
  政务公开 = '政务公开',
  新闻动态 = '新闻动态',
}

export interface NewsDataStat {
  tot_items: number;
  tot_pages: number;
}
