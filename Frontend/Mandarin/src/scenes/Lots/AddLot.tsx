import { Box, Button } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { lot, mandarin, option } from "../../Type";
import { useEffect, useState } from "react";
import DataProvider from '../../providers/dataProviders';
import SelectField from 'react-select';

const AddLot = () => {
    const initialValues = {
        mandarin: { value: {}, label: 'Выберите мандарин'} as option<mandarin>
    }
    const [mandarinOption, setMandarinOption] = useState<option<mandarin>[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSchema = yup.object().shape({
        mandarin: yup.object().required(),
    });
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleForSumbit = (values: any) => {
        console.log(values)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DataProvider.getList<mandarin>('mandarins')
                if (data.data) {
                    setMandarinOption(data.data.map(ConvertMandarinToMandarinOption))
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);


    return <Box m={"20px"}>
        <Formik
            onSubmit={handleForSumbit}
            initialValues={initialValues}
            validationSchema={userSchema}
        >
            {({
                values,
                handleBlur,
                handleSubmit,
                setFieldValue
            }) => (
                <Form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },

                        }}
                    >
                        {
                            isLoading ? (
                                <div>Loading...</div>
                            ) : (

                                <Box>
                                    <SelectField
                                        id={"mandarin"}
                                        value={values.mandarin}
                                        onChange={option => setFieldValue("mandarin", option)}
                                        options={mandarinOption}
                                        onBlur={handleBlur}
                                    />
                                </Box>
                            )}
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" onClick={() => {
                            let newLot:lot={
                                mandarinId:values.mandarin.value.id||'0',
                                lotEndDate:new Date,
                                isOpen:true,
                            }
                            DataProvider.create<lot>('Lots', newLot)
                                .then(() => {
                                    alert('сохранение успешно')
                                    document.location = 'http://localhost:5173/lots';
                                })
                                .catch(() => {
                                    alert('сохранение не успешно')
                                });
                        }}>
                            Сохранение
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    </Box>
}

function ConvertMandarinToMandarinOption(_mandarin:mandarin):option<mandarin>{
    let mandarinOption = {
        value: _mandarin,
        label: _mandarin.name
    } as option<mandarin>
    return mandarinOption;
}

export default AddLot;