import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, Container, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { useForm, Controller, SubmitHandler, Control } from "react-hook-form";
import * as yup from "yup";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SectionWrapper from "../Wrappers/SectionWrapper";
import ControlledTextField from "../UI/ControlledTextField";
import DarkForeground from "../UI/DarkForeground";
import photo from "@/assets/get-in-touch-photo.jpg";
import { selectGetInTouchPlaceValues } from "@/data/selectGetInTouchPlaceValues";
import ControlledSelect from "../UI/ControlledSelect";
import { selectGetInTouchRecallValues } from "@/data/selectGetInTouchRecallValues";
import applicationsService from "@/services/applicationsService";

const applicationSchema = yup
  .object({
    parentName: yup.string().required(),
    childName: yup.string().required(),
    dateOfBirth: yup.string().matches(/^\d\d.\d\d.\d\d\d\d$/).required(),
    phone: yup.string().min(10).max(16).required(),
    branch: yup.string<"Автозавод" | "Машгородок">().required()
  })
  .required();

interface IFormInput extends InferType<typeof applicationSchema> { }

interface Props {

}

const GetInTouch: FC<Props> = ({ }) => {

  const [isApplicationSent, setIsApplicationSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      parentName: "",
      childName: "",
      dateOfBirth: "",
      phone: "",
      branch: "Автозавод"
    },
    resolver: yupResolver(applicationSchema)
  });

  useEffect(() => {
    setIsApplicationSent(!!sessionStorage.getItem("isSent"));
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);

      await applicationsService.createApplication(data);

      setIsApplicationSent(true);

      sessionStorage.setItem("isSent", "true");

    } catch (error: any) {
      setError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SectionWrapper id="contact" title="Записаться">
      <Box>
        <Container>
          <Stack spacing={2}>
            <Typography>Запишитесь на бесплатное пробное занятие</Typography>
            <Typography>Оставьте заявку и мы добавим Вас в группу в Viber</Typography>
            <Paper sx={{
              display: "flex",
              flexDirection: {
                smallPhone: "column",
                tablet: "row"
              }
            }}
            >
              <Box sx={{
                width: {
                  smallPhone: "100%",
                  tablet: "50%"
                }
              }}
              >
                <DarkForeground>
                  <Image
                    src={photo}
                    alt="child photo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)"
                    }}
                  />
                </DarkForeground>
              </Box>
              <Box sx={{
                width: {
                  smallPhone: "100%",
                  tablet: "50%"
                },
                padding: 3
              }}
              >
                {
                  isApplicationSent
                    ? <Stack sx={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <Typography fontSize={24}>Ваша заявка отправлена.</Typography>
                      <Typography fontSize={20}>Скоро добавим Вас в группу</Typography>
                    </Stack>
                    :
                    <form
                      style={{ display: "flex", flexDirection: "column", height: "100%" }}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Stack spacing={1.5} sx={{ flex: "1 1 0" }}>
                        <ControlledTextField
                          control={control}
                          name="parentName"
                          label="ФИО родителя"
                          fullWidth
                        />
                        <ControlledTextField
                          control={control}
                          name="childName"
                          label="ФИО ребенка"
                          fullWidth
                        />
                        <ControlledTextField
                          control={control}
                          name="dateOfBirth"
                          label="Дата рождения ребенка (ДД.ММ.ГГГГ)"
                          fullWidth
                        />
                        <ControlledTextField
                          control={control}
                          name="phone"
                          label="Телефон"
                          fullWidth
                        />
                        <ControlledSelect
                          control={control}
                          name="branch"
                          values={selectGetInTouchPlaceValues}
                          fullWidth
                        />
                      </Stack>
                      {
                        error && <Typography color="error">{error}</Typography>
                      }
                      <Button type="submit" variant="contained" disabled={isLoading} sx={{ marginTop: 2 }}>Записаться</Button>
                    </form>
                }
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </SectionWrapper>
  )
};

export default GetInTouch;
