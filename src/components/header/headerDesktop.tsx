import { StoriesSearchResultInterface } from "@/models/stories";
import { API } from "@/utils/config";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Autocomplete,
  Box,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};

export const HeaderDesktop = (props: Props) => {
  const router = useRouter();
  const timeout = useRef<any>(null);
  const [searchData, setSearchData] = useState<any[]>([]);

  const { control, handleSubmit, setValue } = useForm<{ keywords: string }>({
    mode: "onChange",
    defaultValues: {
      keywords: "",
    },
  });

  const submitHandle = (data: any) => {
    router.push(`/search?keywords=${data.keywords}`);
  };

  const onChangeHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = (await e.currentTarget) as HTMLInputElement;
    clearTimeout(timeout.current);

    timeout.current = await setTimeout(async () => {
      if (value) {
        const result: any = await API.get(
          `/search/storyTitle?keywords=${value}`
        );
        await setSearchData(result.result);
      }
    }, 500);
  };
  return (
    <>
      <Box
        display={{
          md: "block",
          sm: "none",
        }}
        height={"100%"}
        margin={"auto"}
      >
        <Container
          maxWidth={"md"}
          sx={{
            m: "auto!important",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"50px"}
          >
            <Box>
              <Box
                component={Link}
                sx={{
                  color: "#fff",
                  display: "flex",
                  alignItem: "center",
                  textDecoration: "none",
                  gap: "8px",
                  "& > svg": {
                    fontSize: "50px",
                    height: "50px",
                  },
                  "& > p": {
                    height: "50px",
                    display: "flex",
                    alignItems: "center!important",
                  },
                  height: "50px",
                }}
                href="/"
              >
                <MenuBookIcon />
                <Typography>TRUYENHOT.INFO</Typography>
              </Box>
            </Box>
            <Box>
              <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
                <Controller
                  name={"keywords"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: "4px",
                        width: "250px",
                      }}
                      value={value}
                      placeholder="Tìm kiếm"
                      size="small"
                    />
                  )}
                />
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
