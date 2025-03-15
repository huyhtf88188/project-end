import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar Bên Trái */}
      <Sider width={250} style={{ background: "#001529" }}>
        <div
          className="logo"
          style={{
            color: "white",
            fontSize: "20px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          Trang Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: "/admin",
              icon: <AppstoreOutlined />,
              label: "Quản lý Sản Phẩm",
            },
            {
              key: "/admin/products/add",
              icon: <PlusCircleOutlined />,
              label: "Thêm Sản Phẩm",
            },
            {
              key: "/admin/attributes",
              icon: <SettingOutlined />,
              label: "Quản lý Biến Thể",
            },
            {
              key: "/admin/oders",
              icon: <AppstoreOutlined />,
              label: "Quản lý Oder",
            },
          ]}
        />
      </Sider>

      {/* Nội dung hiển thị bên phải */}
      <Layout>
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
