import {createSearchParamsCache,parseAsString} from "nuqs/server";

export const voiceSearchParams = {
    query : parseAsString.withDefault(""),
};

export const voiceSearchParamsCache = 
    createSearchParamsCache(voiceSearchParams);
