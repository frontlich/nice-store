import { Button, Card, Divider, Space } from 'antd';
import { memo } from 'react';

import { store } from './store';

const addCount = () => store.setState((c) => c + 1);
const reduceCount = () => store.setState((c) => c - 1);

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
