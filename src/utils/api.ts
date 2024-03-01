// import type { NewsData } from './types';

/**
 * 从后端获取数据
 * @param url 后端请求地址
 * @returns json数组, 没找到返回空数组[]
 */
// export const fetchNewsDatabase = async (url: string): Promise<NewsData[]> => {
export async function fetchData<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    // const data: NewsData[] = await response.json();
    const data = await response.json();
    return data as T[];
  } catch (err) {
    return [];
  }
}

/**
 * 以固定格式返回当前日期
 * @returns yyyy-mm-dd
 */
export function getCurrentDate(): string {
  const now = Date.now();
  const date = new Date(now);
  const mth = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${mth}-${day}`;
}

// export const fetchNewsStatDatabase = async (url: string) => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       return [];
//     }

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     return [];
//   }
// };
