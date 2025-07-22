import { ReactNode } from "react";
import Header from "@/components/Header";
import "./Layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__content">{children}</main>
    </div>
  );
};

export default Layout;
