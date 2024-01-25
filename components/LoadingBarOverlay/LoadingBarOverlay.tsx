'use client';
import { LoadingOverlay } from "@mantine/core";

export function LoadingBarOverlay() {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 0, blur: 0 }} loaderProps={{ type: "bars" }} />;
}
