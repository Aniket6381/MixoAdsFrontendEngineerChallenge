"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MAX_RETRY_DELAY = 30000; // 30s

export default function useRealtimeCampaignMetrics(campaignID) {
    const [metrics, setMetrics] = useState([]);
    const [status, setStatus] = useState("connecting"); // connecting | connected | disconnected

    const eventSourceRef = useRef(null);
    const retryTimeoutRef = useRef(null);
    const retryDelayRef = useRef(1000); // start with 1s

    const alertedRef = useRef(false);

    useEffect(() => {
        if (!detectConversionDrop(metrics)) {
            alertedRef.current = false;
            return;
        }

        if (!alertedRef.current) {
            toast.error("⚠ Conversion rate dropped sharply");
            alertedRef.current = true;
        }
    }, [metrics]);

    useEffect(() => {
        if (!campaignID) return;

        let isUnmounted = false;

        const connect = () => {
            if (eventSourceRef.current || isUnmounted) return;

            setStatus("connecting");

            const source = new EventSource(
                `https://mixo-fe-backend-task.vercel.app/campaigns/${campaignID}/insights/stream?ts=${Date.now()}`
            );

            eventSourceRef.current = source;

            source.onopen = () => {
                toast.success("Live data connected");
                retryDelayRef.current = 1000; // reset delay
                setStatus("connected");
                console.log("SSE connected");
            };

            source.onmessage = (event) => {
                const payload = JSON.parse(event.data);

                const spend = payload.spend ?? payload.metrics?.spend ?? 0;
                const conversions = payload.conversions ?? payload.metrics?.conversions ?? 0;

                if (spend > 10000) {
                    toast("⚠ High spend detected", { icon: "⚠" });
                }

                setMetrics((prev) => [
                    ...prev.slice(-19),
                    {
                        time: new Date().toLocaleTimeString(),
                        spend,
                        conversions
                    }
                ]);
            };

            source.onerror = () => {
                console.warn("SSE disconnected");
                toast.error("Live connection lost. Reconnecting...");

                source.close();
                eventSourceRef.current = null;
                setStatus("disconnected");

                if (isUnmounted) return;

                retryTimeoutRef.current = setTimeout(() => {
                    retryDelayRef.current = Math.min(
                        retryDelayRef.current * 2,
                        MAX_RETRY_DELAY
                    );
                    connect();
                }, retryDelayRef.current);
            };
        };

        connect();

        return () => {
            isUnmounted = true;

            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }

            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            eventSourceRef.current = null;
        };
    }, [campaignID]);


    const DROP_THRESHOLD = 0.3; // 30%
    const WINDOW = 5;

    function detectConversionDrop(metrics) {
        if (metrics.length < WINDOW * 2) return false;

        const recent = metrics.slice(-WINDOW);
        const previous = metrics.slice(-(WINDOW * 2), -WINDOW);

        const avg = (arr) =>
            arr.reduce((sum, m) => sum + m.conversions, 0) / arr.length;

        const prevAvg = avg(previous);
        const recentAvg = avg(recent);

        if (prevAvg === 0) return false;

        return (prevAvg - recentAvg) / prevAvg >= DROP_THRESHOLD;
    }

    return { metrics, status };
}
