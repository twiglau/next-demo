import Uppy, { Body } from "@uppy/core";
import React from "react";

// TODO: 不知道是，什么意思
const useUppyState = <T extends any, TMeta extends Body>(
  uppy: Uppy<TMeta>,
  selector: (state: ReturnType<Uppy<TMeta>["getState"]>) => T,
) => {
  const store = uppy.store;

  const getSnapshot = () => selector(store.getState());
  const subscribe = React.useMemo(() => store.subscribe.bind(store), [store]);

  return React.useSyncExternalStore(subscribe, getSnapshot);
};

export { useUppyState };
