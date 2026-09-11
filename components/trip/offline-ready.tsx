"use client";

import * as React from "react";

/**
 * 注册 service worker。出发前在埃及打开一次，页面就把自己存下来，
 * 到广州之后不管有没有网都打得开 —— 客人真正要用这一页的时候，
 * 往往正是在车上、在地库、在漫游信号很差的地方。
 *
 * 注册失败不影响任何功能，所以只吞掉错误，不打扰用户。
 */
export function OfflineReady() {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // 本地 http 与线上 https 都允许注册；其余情况（例如 file://）直接跳过。
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return;
    }
    const register = () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* 缓存只是加分项，注册不上就照常联网用 */
      });
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
