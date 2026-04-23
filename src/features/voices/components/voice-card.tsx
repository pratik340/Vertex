"use client";

import Link from "next/link";
import { Mic, MoreHorizontal, Pause, Play, Trash2 } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-category";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { toast } from "sonner";
import { useMutation,useQueryClient } from "@tanstack/react-query";

import { useState } from "react";


/* ------------------------------ Types ------------------------------ */

 export type VoiceItem = {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  variant?: "CUSTOM" | "DEFAULT";
};

/* --------------------------- Helper Logic -------------------------- */

const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

function parseLanguage(locale: string) {
  const [, country] = locale.split("-");

  if (!country) {
    return {
      flag: "",
      region: locale,
    };
  }

  const flag = [...country.toUpperCase()]
    .map((char) =>
      String.fromCodePoint(
        0x1f1e6 + char.charCodeAt(0) - 65
      )
    )
    .join("");

  return {
    flag,
    region: regionNames.of(country) ?? country,
  };
}

/* --------------------------- Voice Card ---------------------------- */

export function VoiceCard({
  voice,
}: {
  voice: VoiceItem;
}) {
 
const { flag, region } = parseLanguage(
    voice.language
  );

  const audioSrc = `/api/voices/${encodeURIComponent(voice.id)}`;
  const {isPlaying,isLoading,togglePlay} = useAudioPlayback(audioSrc);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    trpc.voices.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Voice deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.voices.getAll.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to delete voice");
      },
    }),
  );

  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-xl border bg-background p-3">
      <div className="shrink-0">
        <VoiceAvatar
          seed={voice.id}
          name={voice.name}
          className="size-14 border"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="truncate">
            {voice.name}
          </span>

          <span className="size-1 rounded-full bg-muted-foreground/50" />

          <span className="text-[#327c88] text-xs">
            {
              VOICE_CATEGORY_LABELS[
                voice.category as keyof typeof VOICE_CATEGORY_LABELS
              ]
            }
          </span>
        </div>

        <p className="line-clamp-1 text-xs text-muted-foreground">
          {voice.description}
        </p>

        <p className="flex items-center gap-1 text-xs">
          <span>{flag}</span>
          <span>{region}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          onClick={togglePlay}
           disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/text-to-speech?voiceId=${voice.id}`}
              >
                <Mic className="size-4 mr-2" />
                Use this Voice
              </Link>
            </DropdownMenuItem>
            {voice.variant === "CUSTOM" && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 text-destructive" />
                <span className="font-medium">Delete voice</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

         {voice.variant === "CUSTOM" && (
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete voice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{voice.name}&quot;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteMutation.mutate(
                      { id: voice.id },
                      { onSuccess: () => setShowDeleteDialog(false) },
                    );
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

