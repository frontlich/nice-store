import { Button, Card, Divider, Space } from 'antd';
import { memo } from 'react';

import { ActionType, store } from './store';

export default memo(() => {
  const count = store.useSelector();

  return (
    <Card title="counter">
      <div>count: {count}</div>
      <Divider />
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
        <Button
          type="primary"
          onClick={() => store.dispatch({ type: ActionType.ADD, payload: 2 })}
        >
          add 2
        </Button>
      </Space>
    </Card>
  );
});
