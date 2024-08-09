import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SessionContext } from './SessionContext';
import ProductTable from './Table';

const Home = () => {
    const { setProducts } = useContext(SessionContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch('https://cdn.drcode.ai/interview-materials/products.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data?.products);
                setLoading(false)
            })
            .catch((error) => {
                setError(error);
                setLoading(false)

            });
    }, []);

    if (error) return <Typography variant='h4' color="error" textAlign='center'>Error: {error.message}</Typography>;


    return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                {
                    loading === true ?
                        <Box textAlign="center" mt={10} width="100%">
                            <CircularProgress disableShrink />
                        </Box> :
                        <ProductTable />
                }
            </Grid>

        </Grid>
    )
}

export default Home
