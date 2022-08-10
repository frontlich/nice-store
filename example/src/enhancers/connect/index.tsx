import { memo } from 'react';

import { store } from './store';

export default memo(() => {
  const v = store.useSelector();
  return <div>{v}</div>;
});
