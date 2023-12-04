import { DataGrid, GridColDef, GridRowParams, GridToolbar, GridValueFormatterParams } from '@mui/x-data-grid';
import { lot, bet } from '../../Type';
import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import DataProvider from '../../providers/dataProviders';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/Logo.jpg';

const Bets = () =>{
    const [bets, setBets] = useState<bet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const columns: GridColDef<bet>[] = [
        { field:"id", headerName: "ID", flex: 1},
        { field: "lot", headerName: "Лот", flex: 3, valueFormatter: lotValueFormatter},
        
    ]
    const handleRowDoubleClick = (params: GridRowParams) => {
        const rowData: bet = params.row as bet;
        console.log('Selected Row Data:', rowData);;
        document.location = 'https://localhost/Bets/' + rowData.id;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DataProvider.getList<bet>('Bets');
                setBets(data.data || []);
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
                    <DataGrid rows={bets} 
                        columns={columns} 
                        slots={{ toolbar: GridToolbar }} 
                        onRowDoubleClick={handleRowDoubleClick}/>
                </Box>
            )}
        </Box>
        </div>
    );

}

export function lotValueFormatter(params: GridValueFormatterParams<lot>): string {
    if(params.value)
        return `Лот №${params.value.id}`;
    return '';
};

function handleAddClick () {
    console.log('Add Row Data:');;
    document.location = 'http://127.0.0.1:5173/bets/add';
};

export default Bets;