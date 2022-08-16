import {
  Button,
  Card,
  Divider,
  Form,
  InputNumber,
  Popconfirm,
  Space,
  Spin,
} from 'antd';
import { memo, useCallback } from 'react';

import { ActionType, store } from './store';

const addCount = () => store.dispatch({ type: ActionType.ADD });
const reduceCount = () => store.dispatch({ type: ActionType.REDUCE });

export default memo(() => {
  const count = store.useSelector();
  const loading = store.useLoading();
  const [form] = Form.useForm();

  const handleConfirm = useCallback(() => {
    store.runAsync(form.getFieldValue('count'));
  }, [form]);

  return (
    <Card title="counter">
      <div>count:</div>
      {loading ? <Spin spinning /> : <div>{count}</div>}
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
        <Popconfirm
          icon={null}
          title={
            <Form form={form}>
              <Form.Item name="count" label="请输入数字">
                <InputNumber />
              </Form.Item>
            </Form>
          }
          onConfirm={handleConfirm}
        >
          <Button type="primary">async set</Button>
        </Popconfirm>
      </Space>
    </Card>
  );
});
