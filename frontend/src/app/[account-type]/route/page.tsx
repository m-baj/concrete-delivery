"use client";
import React from "react";
import MapView from "@/components/mapView";
import MapViewBox from "@/components/mapViewBox";
import NextStop from "@/components/nextStop";
import {Flex, Grid, Stack, GridItem, Box, VStack, AspectRatio, Text} from "@chakra-ui/react";

const MapRoutePage = () => {
    return (
        <Flex flex="1" p={2} height="75vh">
            <Flex flex="1" direction="column">
                <MapViewBox />
                <NextStop />
            </Flex>
        </Flex>
    );
}

export default MapRoutePage;