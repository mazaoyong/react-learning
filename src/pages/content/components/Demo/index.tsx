import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { App as AntdApp } from "antd";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";

document.body.append(root);

const rootIntoShadow = document.createElement("div");
rootIntoShadow.id = "shadow-root";

const shadowRoot = root.attachShadow({ mode: "open" });
shadowRoot.appendChild(rootIntoShadow);

attachTwindStyle(rootIntoShadow, shadowRoot);

createRoot(rootIntoShadow).render(
  <StyleProvider container={shadowRoot} cache={createCache()}>
    <AntdApp>
      <App />
    </AntdApp>
  </StyleProvider>
);
