import { Button, Card, Space } from 'antd';
import { memo } from 'react';

import { ActionType, store } from './store';

export default memo(() => {
  const count = store.useSelector();

  return (
    <Card title="reducer">
      <div>{count}</div>
      <Space>
        <Button
          type="primary"
          onClick={() => store.dispatch({ type: ActionType.ADD })}
        >
          add
        </Button>
        <Button
          type="primary"
          onClick={() => store.dispatch({ type: ActionType.REDUCE })}
        >
          reduce
        </Button>
      </Space>
    </Card>
  );
});
