import React from "react";
import "@pages/panel/Panel.css";
import browser from "webextension-polyfill";

const Panel: React.FC = () => {
  // browser.devtools.inspectedWindow();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      if (window) {
        const dom = document.querySelector(".grid-event");
        // browser.devtools.inspectedWindow.reload();
        browser.devtools.inspectedWindow.eval(
          'const dom = document.querySelector(".grid-event");console.log(222,dom);'
        );
      }
    }, 30000);
  }, []);

  return (
    <div className="container">
      <h1 className="text-lime-400">Dev Tools Panel{count}</h1>
    </div>
  );
};

export default Panel;
