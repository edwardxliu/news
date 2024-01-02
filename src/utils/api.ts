import type { NewsData } from './types';

/**
 * fetche news data from mysql database
 * @param url database url
 * @returns a {@link NewsData} object.
 */
export const fetchNewsDatabase = async (url: string): Promise<NewsData[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    const data: NewsData[] = await response.json();
    return data;
  } catch (err) {
    return [];
  }
};

export const fetchNewsStatDatabase = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (err) {
    return [];
  }
};
