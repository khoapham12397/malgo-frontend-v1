import { remark } from 'remark';
import strip from 'strip-markdown';

export const stripMarkdown = async (text: string) => {
  const result = await remark().use(strip).process(text);
  // console.log(String(result));
  return String(result);
};
