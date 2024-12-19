"use client";
import React, { useEffect, useState } from "react";
import { fetchMapData } from "@/api-calls/fetch_map_data";
import { Box, Spinner, Text } from "@chakra-ui/react";

const MapView = () => {
    const [mapData, setMapData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchMapData();
                setMapData(data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Text>Error loading map data: {error.message}</Text>;
    }

    return (
        <Box>
            {/* Render map data here */}
            <Text>Map Data: {JSON.stringify(mapData)}</Text>
        </Box>
    );
};

export default MapView;