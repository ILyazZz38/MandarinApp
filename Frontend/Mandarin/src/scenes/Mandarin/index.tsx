import { DataGrid, GridColDef, GridRowParams, GridToolbar, GridValueFormatterParams } from '@mui/x-data-grid';
import { mandarin } from '../../Type';
import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import DataProvider from '../../providers/dataProviders';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/Logo.jpg';

const Mandarins = () =>{
    const [mandarins, setMandarins] = useState<mandarin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const columns: GridColDef<mandarin>[] = [
        { field:"id", headerName: "ID", flex: 1},
        { field: "name", headerName: "Название", flex: 3},
        { field: "startPrice", headerName: "Начальная цена", flex: 3, valueFormatter: numberValueFormatter},
        { field: "dateAdd", headerName: "Дата добавления", flex: 3, valueFormatter: dateValueFormatter},
        
    ]
    const handleRowDoubleClick = (params: GridRowParams) => {
        const rowData: mandarin = params.row as mandarin;
        console.log('Selected Row Data:', rowData);;
        document.location = 'https://localhost/Mandarins/' + rowData.id;
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DataProvider.getList<mandarin>('Mandarins');
                setMandarins(data.data || []);
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
                    <DataGrid rows={mandarins} 
                        columns={columns} 
                        slots={{ toolbar: GridToolbar }} 
                        onRowDoubleClick={handleRowDoubleClick}/>
                </Box>
            )}
        </Box>
        </div>
    );

}

export function numberValueFormatter(params: GridValueFormatterParams<number>): string {
    if(params.value)
        return String(params.value);
    return '';
};

export function dateValueFormatter(params: GridValueFormatterParams<Date>): string {
    if(params.value)
        return String(params.value);
    return '';
};

function handleAddClick () {
    console.log('Add Row Data:');;
    document.location = 'http://127.0.0.1:5173/mandarins/add';
};

export default Mandarins;