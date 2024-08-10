import { Box, Card, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import ProductTable from './Table'
import { SessionContext } from './SessionContext';

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
            setLoading(false);
        })
        .catch((error) => {
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                setError(new Error('CORS error occurred. Please enable CORS by installing this Chrome extension: <a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf" target="_blank" rel="noopener noreferrer">Allow CORS</a>'));
            } else {
                setError(error);
            }
            setLoading(false);
        });
}, []);

    

    if (error) return <Typography variant='h6' color="error" textAlign='center'>Error:  <div dangerouslySetInnerHTML={{ __html: error.message }} /></Typography>;


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
