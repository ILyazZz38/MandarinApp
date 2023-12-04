import { Box, Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { mandarin } from "../../Type";
import { useEffect, useState } from "react";
import DataProvider from '../../providers/dataProviders';

const AddMandarin = () => {
    const initialValues = {
        name: "",
        description:"",
        startprice:0,
        dateadd:new Date (2023,1,1),
    }
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSchema = yup.object().shape({
        name: yup.string().required(),
        startprice: yup.number().required(),
        dateAdd: yup.date().required(),
    });
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleForSumbit = (values: any) => {
        console.log(values)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                
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
                handleChange,
                handleSubmit,
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
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Название"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name="name"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Стартовая цена"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.startprice}
                                        name="startprice"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </Box>
                            )}
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained" onClick={() => {
                            let newMandarin:mandarin={
                                name: values.name,
                                startPrice: values.startprice,
                                dateAdd: new Date(),
                            }
                            DataProvider.create<mandarin>('Mandarins', newMandarin)
                                .then(() => {
                                    alert('сохранение успешно')
                                    document.location = 'http://localhost:5173/mandarins';
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

export default AddMandarin;