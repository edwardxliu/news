import './index.css';

import { init } from '$utils/newsItemComponent';

const key: string = 'gzdt';

window.Webflow ||= [];
window.Webflow.push(async () => {
  init(key);
});
