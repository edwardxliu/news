import './index.css';

import { init } from '$utils/newsItemComponent';

const key: string = 'fgw';

window.Webflow ||= [];
window.Webflow.push(async () => {
  init(key);
});
