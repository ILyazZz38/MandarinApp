import { Box, Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { lot, bet, option } from "../../Type";
import { useEffect, useState } from "react";
import DataProvider from '../../providers/dataProviders';
import SelectField from 'react-select';
import Userfront from "@userfront/toolkit";

const AddBet = () => {
    const initialValues = {
        price: 0,
        lot: { value: {}, label: 'Выберите Лот'} as option<lot>
    }
    const [lotOption, setLotOption] = useState<option<lot>[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSchema = yup.object().shape({
        lot: yup.object().required(),
        price: yup.number().required(),
    });
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleForSumbit = (values: any) => {
        console.log(values)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DataProvider.getList<lot>('lots')
                if (data.data) {
                    setLotOption(data.data.map(ConvertLotToLotOption))
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
                handleChange,
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
                                        id={"lot"}
                                        value={values.lot}
                                        onChange={option => setFieldValue("lot", option)}
                                        options={lotOption}
                                        onBlur={handleBlur}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Стартовая цена"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.price}
                                        name="price"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </Box>
                            )}
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" onClick={() => {
                            let newBet:bet={
                                lotId:values.lot.value.id||'0',
                                price:values.price,
                                userEmail:Userfront.user.email,
                            }
                            DataProvider.create<bet>('Bets', newBet)
                                .then(() => {
                                    alert('сохранение успешно')
                                    document.location = 'http://localhost:5173/bets';
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

function ConvertLotToLotOption(_lot:lot):option<lot>{
    let mandarinOption = {
        value: _lot,
        label: 'Лот №' + _lot.id
    } as option<lot>
    return mandarinOption;
}

export default AddBet;