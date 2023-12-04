import { DataGrid, GridColDef, GridRowParams, GridToolbar, GridValueFormatterParams } from '@mui/x-data-grid';
import { lot, mandarin } from '../../Type';
import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import DataProvider from '../../providers/dataProviders';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/Logo.jpg';

const Lots = () =>{
    const [lots, setLots] = useState<lot[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const columns: GridColDef<lot>[] = [
        { field:"id", headerName: "ID", flex: 1},
        { field: "mandarin", headerName: "Мандарин", flex: 3, valueFormatter: mandarinValueFormatter},
        
    ]
    const handleRowDoubleClick = (params: GridRowParams) => {
        const rowData: lot = params.row as lot;
        console.log('Selected Row Data:', rowData);;
        document.location = 'https://localhost/Lots/' + rowData.id;
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DataProvider.getList<lot>('Lots');
                setLots(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div>
            <img src={logo} className='photo'></img>
            <Box m={"20px"}>
            <Box display="flex" flex={1}>
                <IconButton onClick={handleAddClick}>
                    <AddIcon />
                </IconButton>
            </Box>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <Box
                    m={"0 0 0 0"}
                    height="90vh"
                    width="100vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        }
                    }}
                >
                    <DataGrid rows={lots} 
                        columns={columns} 
                        slots={{ toolbar: GridToolbar }} />
                </Box>
            )}
        </Box>
        </div>
    );

}

export function mandarinValueFormatter(params: GridValueFormatterParams<mandarin>): string {
    if(params.value)
        return `Мандарин "${params.value.name}" по начальной цене в  ${params.value.startPrice}`;
    return '';
};

function handleAddClick () {
    console.log('Add Row Data:');;
    document.location = 'http://localhost:5173/lots/add';
};

export default Lots;