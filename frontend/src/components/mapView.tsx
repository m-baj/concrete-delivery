"use client";
import React, { useEffect, useState } from "react";
import { fetchMapData } from "@/api-calls/fetch_map_data";
import { Box, Spinner, Text, Flex, AspectRatio } from "@chakra-ui/react";

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
        <Flex flex="1" direction="column" height="100vh">
            <Box
                flex="1"
                backgroundColor={"gray"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                borderRadius="md"
                overflow="hidden"
                width="100%"
                height="100%"
            >
                <iframe
                    src="http://localhost:8000/map"
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "inherit" }}
                    title="Embedded Map"
                />
            </Box>
        </Flex>
    );
};

export default MapView;