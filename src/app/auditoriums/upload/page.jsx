"use client";
import AuditoriumUpload from "@/components/AuditoriumUpload";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";

export default function UploadPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuditoriumUpload />
        </QueryClientProvider>
    );
}
