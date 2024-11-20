"use client";

import { encode } from "@/lib/url";
import { debounce } from "throttle-debounce";

import * as React from "react";

function subscribe1(callback: () => void) {
  window.addEventListener("hashchange", callback);

  return () => {
    window.removeEventListener("hashchange", callback);
  };
}

const debouncedSetter = debounce(
  500,

  (newHash: object, pauseRef: React.MutableRefObject<boolean>) => {
    pauseRef.current = true;

    window.location.hash = encode(newHash);

    console.log("debouncedSetHash");
    setTimeout(() => {
      pauseRef.current = false;
    });
  },
);

export const useHash = () => {
  const pauseRef = React.useRef(false);

  const subscribe = React.useCallback((callback: () => void) => {
    function innerCallback() {
      if (pauseRef.current) {
        return;
      }

      callback();
    }

    window.addEventListener("hashchange", innerCallback);

    return () => {
      window.removeEventListener("hashchange", innerCallback);
    };
  }, []);

  const hash = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServersideHash,
  );

  function getSnapshot(): string {
    return window.location.hash;
  }

  function getServersideHash() {
    return null;
  }

  const debouncedSetHash = React.useCallback((newHash: object) => {
    debouncedSetter(newHash, pauseRef);
  }, []);

  return [hash, debouncedSetHash] as const;
};
