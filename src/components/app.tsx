import React from "react";
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const App: React.FC = () => (
  <Tabs defaultActiveKey="all">
    <TabPane tab="All" key="all">
    </TabPane>
    <TabPane tab="Listed" key="listed">
    </TabPane>
    <TabPane tab="Pending" key="pending">
    </TabPane>
    <TabPane tab="Completed" key="completed">
    </TabPane>
  </Tabs>
);

export default App;
