import { Suspense } from "react";
import ErrorClient from "./ErrorClient";

export default function ErrorPage() {
    return (
        <Suspense fallback={<ErrorFallback />}>
            <ErrorClient />
        </Suspense>
    );
}

function ErrorFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading error details...</p>
        </div>
    );
}