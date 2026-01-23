import { type OpenRouter } from "./open-router-dts";
export declare const apiClient: import("@trpc/client").TRPCClient<import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    file: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                contentType: string;
                size: number;
                appId: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
            meta: object;
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                path: string;
                type: string;
                appId: string;
            };
            output: {
                id: string;
                name: string;
                deletedAt: Date | null;
                createdAt: Date | null;
                userId: string;
                type: string;
                path: string;
                url: string;
                contentType: string;
                appId: string | null;
            };
            meta: object;
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
            };
            output: {
                id: string;
                name: string;
                deletedAt: Date | null;
                createdAt: Date | null;
                userId: string;
                type: string;
                path: string;
                url: string;
                contentType: string;
                appId: string | null;
            }[];
            meta: object;
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                cursor?: {
                    id: string;
                    createdAt: string;
                } | undefined;
                limit?: number | undefined;
                orderBy?: {
                    field: "deletedAt" | "createdAt";
                    order: "asc" | "desc";
                } | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    createdAt: Date | null;
                    deletedAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string | null;
                }[];
                nextCursor: {
                    id: string;
                    createdAt: Date;
                } | null;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("postgres").RowList<never[]>;
            meta: object;
        }>;
    }>>;
}>>>;
export declare const createApiClient: (options: {
    apiKey: string;
}) => import("@trpc/client").TRPCClient<import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    file: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                contentType: string;
                size: number;
                appId: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
            meta: object;
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                path: string;
                type: string;
                appId: string;
            };
            output: {
                id: string;
                name: string;
                deletedAt: Date | null;
                createdAt: Date | null;
                userId: string;
                type: string;
                path: string;
                url: string;
                contentType: string;
                appId: string | null;
            };
            meta: object;
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
            };
            output: {
                id: string;
                name: string;
                deletedAt: Date | null;
                createdAt: Date | null;
                userId: string;
                type: string;
                path: string;
                url: string;
                contentType: string;
                appId: string | null;
            }[];
            meta: object;
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                cursor?: {
                    id: string;
                    createdAt: string;
                } | undefined;
                limit?: number | undefined;
                orderBy?: {
                    field: "deletedAt" | "createdAt";
                    order: "asc" | "desc";
                } | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    createdAt: Date | null;
                    deletedAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string | null;
                }[];
                nextCursor: {
                    id: string;
                    createdAt: Date;
                } | null;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("postgres").RowList<never[]>;
            meta: object;
        }>;
    }>>;
}>>>;
export type { OpenRouter };
