import { Button, Card, Divider, Space } from 'antd';
import { memo } from 'react';

import { ActionType, store } from './store';

const addCount = () => store.dispatch({ type: ActionType.ADD });
const reduceCount = () => store.dispatch({ type: ActionType.REDUCE });

export default memo(() => {
  const count = store.useSelector();

  return (
    <Card title="counter">
      <div>count: {count}</div>
      <Divider />
      <Space>
        <Button type="primary" onClick={addCount}>
          add
        </Button>
        <Button type="primary" onClick={() => store.send(10)}>
          async set
        </Button>
        <Button type="primary" onClick={reduceCount}>
          reduce
        </Button>
        <Button type="primary" onClick={store.resetState}>
          reset
        </Button>
      </Space>
    </Card>
  );
});
