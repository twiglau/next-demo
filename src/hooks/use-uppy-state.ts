import Uppy, { Body } from "@uppy/core";
import React from "react";

/**
 * 核心目的是将 Uppy 内部的状态管理（外部存储）桥接到 React 的渲染循环中。
 * 1. useSyncExternalStore 是 React 18 引入的 API，专门用于订阅外部数据源
 * 2. 外部数据源：是 Uppy 实例自带的 store，它是一个简单的发布-订阅系统。Uppy 作为
 *    一个独立的JS库，它的状态（那些文件在上传，进度多少）是存在 它自己内部的，并不在React
 *    的 useState 里。
 * 3. 订阅：告诉React如何监听这些变化。
 * 4. 快照（getSnapshot): 告诉React如何获取当前时刻的数据。
 */

// <T extends any>: 代表你想从状态里“选出”的数据类型（比如 files 对象）。
// <TMeta extends Body>: 这是 Uppy 内部定义的元数据类型，保持类型安全。
const useUppyState = <T extends any, TMeta extends Body>(
  uppy: Uppy<TMeta>,
  selector: (state: ReturnType<Uppy<TMeta>["getState"]>) => T,
) => {
  const store = uppy.store;

  // 2. 定义如何获取“当前状态”
  // selector 是一个函数，让你只取你需要的那部分数据（比如只取 files）
  const getSnapshot = () => selector(store.getState());
  // 3. 定义如何订阅变化
  // store.subscribe 接受一个回调函数，当状态变化时，它会调用这个回调。
  // React 会在这个回调里重新运行 getSnapshot 来获取新值。
  const subscribe = React.useMemo(() => store.subscribe.bind(store), [store]);

  // 4. 核心桥接
  // React 会在内部：
  // - 订阅你的 subscribe 回调。
  // - 在渲染时调用 getSnapshot 获取数据。
  // - 如果 getSnapshot 返回的值变了，它就会重新渲染你的组件。
  return React.useSyncExternalStore(subscribe, getSnapshot);
};

export { useUppyState };
