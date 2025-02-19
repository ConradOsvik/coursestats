import "server-only";

import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createQueryClient } from "./query-client";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter, createCaller } from "~/server/api/root";
import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const getQueryClient = cache(createQueryClient);

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const caller = createCaller(createContext);

export const api = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
