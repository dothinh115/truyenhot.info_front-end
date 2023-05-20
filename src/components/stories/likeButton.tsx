import React, { useEffect, useState, useRef } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button } from "@mui/material";
import { useAuth } from "@/hooks/auth";
import { API } from "@/utils/config";
import { useRouter } from "next/router";
import { CheckIfLikedInterface } from "@/models/stories";
type Props = {
  story_code: string;
  likeNumberMutate: (data?: any, options?: boolean) => void;
  likeNumberData: {
    message?: string;
    result: {
      number: number;
    };
  };
};

export const StoryLikeButton = ({
  story_code,
  likeNumberMutate,
  likeNumberData,
}: Props) => {
  const { profile } = useAuth();
  const router = useRouter();
  const timeout = useRef<any>();
  const [checkIfLikedData, setCheckIfLikedData] =
    useState<CheckIfLikedInterface>();

  const likeHandle = async () => {
    if (!profile) {
      router.push(`/login?backTo=${window.location.href}`);
      return;
    }

    setCheckIfLikedData({
      result: {
        like: !checkIfLikedData?.result.like,
      },
    });

    likeNumberMutate(
      {
        result: {
          number:
            likeNumberData?.result.number +
            (checkIfLikedData?.result.like ? -1 : 1),
        },
      },
      false
    );

    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      try {
        if (checkIfLikedData?.result.like) {
          await API.delete(`/like/delete/${story_code}`);
        } else {
          await API.get(`/like/new/${story_code}`);
        }
        checkIfLikedHandle();
      } catch (error: any) {
      } finally {
        likeNumberMutate();
      }
    }, 500);
  };

  const checkIfLikedHandle = async () => {
    try {
      const response: any = await API.get(`/like/checkIfLiked/${story_code}`);
      setCheckIfLikedData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (profile && story_code) checkIfLikedHandle();
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
      onClick={() => likeHandle()}
      variant={checkIfLikedData?.result.like ? "contained" : "text"}
    >
      thích
    </Button>
  );
};
