"use client";
import React from "react";
import MapView from "@/components/mapView";
import MapViewBox from "@/components/mapViewBox";
import { Flex, Grid, Stack, GridItem, Box } from "@chakra-ui/react";

const MapRoutePage = () => {
    return (
        <div className="flex justify-center">
            <Grid
                templateAreas={`"main"
                        "footer"`}
                gridTemplateRows={'1fr 300px'} // Main area takes up remaining space, footer is fixed
                gridTemplateColumns={'1fr'} // Single column grid
                h='100vh' // Full viewport height
                w='100vw' // Full viewport width
                gap='1'
                color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem pl='2' bg='green.300' area={'main'}>
                    <Box width={'100%'} height={'100%'}>
                        <MapView />
                    </Box>
                </GridItem>
                <GridItem pl='2' bg='blue.300' area={'footer'}>
                    Footer
                </GridItem>
            </Grid>
        </div>
    );
}

export default MapRoutePage;