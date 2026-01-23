import { createTRPCClient, httpBatchLink } from "@trpc/client";
export const apiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/open",
        }),
    ],
});
export const createApiClient = (options) => {
    const headers = {};
    if (options.apiKey) {
        headers["api-key"] = options.apiKey;
    }
    if (options.signedToken) {
        headers["signed-token"] = options.signedToken;
    }
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: "http://localhost:3000/api/open",
                headers,
            }),
        ],
    });
};
