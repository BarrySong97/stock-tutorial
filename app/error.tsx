/**
 * @purpose App Router 错误边界:渲染兜底错误 UI 并提供重试。
 * @role    客户端错误边界组件,路由段出错时由 Next 挂载。
 * @deps    react
 * @gotcha  "use client";纯兜底 UI。
 */
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
