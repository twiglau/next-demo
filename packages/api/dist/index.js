import { createTRPCClient, httpBatchLink } from "@trpc/client";
export const apiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/open",
        }),
    ],
});
export const createApiClient = (options) => {
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: "http://localhost:3000/api/open",
                headers: {
                    "api-key": options.apiKey,
                    "signed-token": options.signedToken,
                },
            }),
        ],
    });
};
