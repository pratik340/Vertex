import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { prefetch, trpc, HydrateClient } from "@/trpc/server";

import { VoiceView } from "@/features/voices/views/voices-view";
import { voiceSearchParamsCache } from "@/features/voices/lib/params";

export const metadata: Metadata = { title: "Voices" };

export default async function VoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query } = await voiceSearchParamsCache.parse(searchParams);

  prefetch(trpc.voices.getAll.queryOptions({ query }));

  return (
    <HydrateClient>
      <VoiceView />
    </HydrateClient>
  );
};