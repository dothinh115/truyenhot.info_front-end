import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button } from "@mui/material";
import { useAuth } from "@/hooks/auth";
import useSWR from "swr";
import { API } from "@/utils/config";
import { useRouter } from "next/router";
type Props = {
  story_code: string;
  likeNumberMutate: () => void;
};

export const StoryLikeButton = ({ story_code, likeNumberMutate }: Props) => {
  const { profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: checkIfLikedData, mutate: checkIfLikedMutate } = useSWR(
    `/like/checkIfLiked/${story_code}`,
    {
      revalidateOnMount: false,
    }
  );

  const likeHandle = async () => {
    if (!profile) {
      router.push("/login");
      return;
    }
    try {
      setLoading(true);
      if (checkIfLikedData?.result.like) {
        await API.delete(`/like/delete/${story_code}`);
      } else {
        await API.get(`/like/new/${story_code}`);
      }
      checkIfLikedMutate();
    } catch (error: any) {
      console.log(error);
    } finally {
      likeNumberMutate();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && story_code) checkIfLikedMutate();
  }, [profile, story_code]);

  return (
    <Button
      color="info"
      startIcon={
        checkIfLikedData?.result.like ? (
          <FavoriteIcon />
        ) : (
          <FavoriteBorderIcon />
        )
      }
      onClick={likeHandle}
      variant={checkIfLikedData?.result.like ? "contained" : "text"}
      disabled={loading ? true : false}
    >
      thích
    </Button>
  );
};
