"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const errorConfig = {
    400: {
        title: "Bad Request",
        description: "The request could not be processed."
    },
    404: {
        title: "Not Found",
        description: "The requested resource does not exist."
    },
    429: {
        title: "Too Many Requests",
        description: "You are sending requests too quickly."
    },
    500: {
        title: "Server Error",
        description: "Something went wrong on our end."
    }
};

export default function ErrorClient() {
    const params = useSearchParams();
    const router = useRouter();

    const status = Number(params.get("status")) || 500;
    const error = errorConfig[status];

    useEffect(() => {
        if (!error) {
            router.replace("/");
        }
    }, [error, router]);

    if (!error) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded shadow max-w-md text-center">
                <h1 className="text-2xl text-red-500 font-bold">{error.title}</h1>
                <p className="text-gray-500 mt-2">{error.description}</p>

                <button
                    className="mt-4 px-4 py-2 bg-black text-white rounded"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
