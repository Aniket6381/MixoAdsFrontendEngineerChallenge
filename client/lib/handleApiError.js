import { redirect } from "next/navigation";

export default function handleApiError(error) {
    const status = error.status || 500;
    redirect(`/error?status=${status}`);
}
