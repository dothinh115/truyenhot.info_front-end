import { ChapterSection } from "@/sections";
import React from "react";
import { Stack, Container, Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
type Props = {
  chapterData: any;
};

const ChapterDetail = ({ chapterData }: Props) => {
  return (
    <>
      <ChapterSection>
        <Stack direction={"row"} justifyContent={"center"}>
          <Container maxWidth={"md"}>
            <Box
              component={"h1"}
              textAlign={"center"}
              color={"#3949ab"}
              fontWeight={"light"}
              fontSize={40}
              my={1}
            >
              Hết mực cưng chiều
            </Box>
            <Typography
              textAlign={"center"}
              fontWeight={"light"}
              fontSize={18}
              fontStyle={"italic"}
            >
              --- Chương 1 ---
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              spacing={1}
              my={2}
            >
              <Button color="info" variant="contained">
                <ArrowBackIcon />
                Chương trước
              </Button>
              <Button color="info" variant="contained">
                <MenuBookIcon />
              </Button>
              <Button color="info" variant="contained">
                Chương sau
                <ArrowForwardIcon />
              </Button>
            </Stack>
            <Box className={"hr"} my={4} />
            <Typography fontSize={24}>
              Tia nắng sớm, nhẹ nhàng chiếu lên hai thân ảnh đang nằm trên
              giường lớn qua ô cửa sổ. Mạc Chính Hoan ôm lấy thân thể nhỏ bé nằm
              trong lòng. Đuôi mi mắt thiếu niên nhè nhẹ rung lên như lông vũ
              nhỏ.
              <br />
              <br />
              Nhất Bảo tỉnh dậy trong lòng nam nhân, khuân mặt vẫn còn rất ngơ
              ngác. theo thói quen nhìn về phía tủ đầu giường, đồng hồ đã chỉ
              đến số 7. Cậu cảm thấy trong lòng rơi lộp độp, vùng khỏi cánh tay
              đang ôm eo của mình.
              <br />
              <br />
              Chết rồi! Sao hôm nay lại ngủ trễ vậy chứ!!
              <br />
              <br />
              Nhất bảo vừa nghĩ vừa hấp tấp rời giường. Giờ sinh học của hạ nhân
              Mạc Gia thường rất quy củ, 6h bọn họ đã rời giường để dọn dẹp rồi.
              Hôm nay cậu ngủ trễ một tiếng liệu có bị Tần quản gia trừ lương
              không chứ!!
              <br />
              <br />
              Mạc Chính Hoan đã dậy từ rất sớm, nam nhân để trần thân trên, nằm
              nghiêng người, một tay chống mặt nhìn bảo bối trong lòng hấp tấp
              vội vàng.
              <br />
              <br />
              Bước được hai bước bỗng Nhất Bảo cảm thấy lạ lạ, một loạt ký ức
              được tua lại trong đầu. Ngay lập tức khuân mặt trắng nộn nộn dần
              đỏ lên lan đến tai rồi ra tận sau gáy..
              <br />
              <br />
              <br />
              <br />
              "Bảo Bảo mới sáng sớm đã vội đi đâu vậy?"
              <br />
              <br />
              Mạc Chính Hoan cảm thấy dễ thương quá phạm quy rồi. Ôm lấy thiếu
              niên nhỏ ngại ngùng về lại giường. Hắn áp má của của mình lên trán
              cậu
              <br />
              <br />
              "Ừm.. khỏi rồi, nhưng vẫn phải uống thuốc!"
              <br />
              <br />
              "Đã khỏi rồi, sao phải uống thuốc chứ.."
              <br />
              <br />
              Nhất Bảo chu chu cái miệng phản bác. Hắn liền hôn chóc một miếng
              vào môi cậu. Hắn rất thích trêu chọc cho bảo bối mặt đỏ chín. Rất
              đáng yêu.
              <br />
              <br />
              *Cốc cốc*
              <br />
              <br />
              "Thiếu gia, đã rời giường chưa ạ?"
              <br />
              <br />
              Tần Lão nhẹ nhàng hỏi thăm dò, thấy một lúc không có ai đáp lại.
              Nghĩ thiếu gia vẫn còn ngủ định im lặng rời đi.
              <br />
              <br />
              "Rồi! Chuẩn bị cơm sáng đi "
              <br />
              <br />
              Nghe được mệnh lệnh, Tần Lão vâng một tiếng rồi nhanh chóng xuống
              bếp sắp xếp.
              <br />
              <br />
              Nhất Bảo được Mạc Chính Hoan bế trên tay vệ sinh cá nhân một hồi,
              hắn thỉnh thoảng sẽ hôn hôn rồi sờ mó một chút khiến cậu ngượng
              chín mặt.
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              "Em đã khỏi bệnh rồi mà.. ngài.. để em tự đi là được rồi.."
              <br />
              <br />
              Mạc Chính Hoan lấy lý do sàn nhà rất lạnh nhưng chỉ có một dép
              bông nên bế cậu, sự thật là hắn luyến tiếc bờ mông căng mọng này.
              Còn đôi dép bông hắn chuẩn bị cho bảo bối từ tối qua đã bị đá vào
              gầm giường từ lâu rồi..
              <br />
              <br />
              Trước cái nhìn của đám hầu trong nhà, Hắn ôm Nhất Bảo từ trên cầu
              thang đi xuống rồi đi thẳng ra gian phòng ăn. Đút cho bảo bảo một
              bữa no nê lại hôn chùn chụt vào chiếc môi mọng nước ấy.
              <br />
              <br />
              Nhất Bảo sau một hồi vật lộn với hắn cuối cùng vẫn phải uống
              thuốc. Trước khi ra khỏi cửa xử lý công việc, hắn chuẩn bị cho bảo
              bối của mình một cái ổ ấm trên sofa rồi thêm chút đồ ăn vặt, tất
              nhiên không thể thiếu bánh kem dâu nhỏ mà cậu thích ăn nhất, bật
              một chương trình đang hot nữa là hoàn hảo.
              <br />
              <br />
              <br />
              <br />
              Lưu luyến mấy hồi mới chịu rời đi, vốn hắn còn muốn mỗi ngày dính
              đến cậu. Nhưng nếu không đến công ty chắc thư ký Hà sẽ tự vẫn mất.
              <br />
              <br />
              Nhất Bảo nhìn đống đồ ăn vặt trước mặt, lại nhìn chiếc chăn bông
              ấm áp trên người, chiếc tivi lớn đang chiếu đến một bộ phim yêu
              thích. Cảm giác quá thích đi. Hạnh phúc đến với cậu quá nhanh, chỉ
              trong một ngày cậu gần như có tất cả những gì bản thân mong muốn.
              <br />
              <br />
              Ngồi được một chút, bỗng một nàng hầu từ từ tới gần. Cô cầm một
              thau quần áo lớn, nhìn thiếu niên trước mặt. Công việc giặt quần
              áo vốn là của cô và cậu. Bây giờ lại dám ngồi đây chơi để cô phải
              làm một mình.
              <br />
              <br />
              Bàn tay với đầy những móng sắc nhọn cắm vào da thịt Nhất Bảo,
              nhanh chóng lôi cậu khỏi ổ chăn ngã xuống đất.
              <br />
              <br />
              "Áaaaa"
              <br />
              <br />
              "Lại còn ngồi đây, mày nhìn cái đống quần áo trước mặt đi, còn có
              cả của mày đấy!! Mau mang đi giặt rồi phơi mau lên, còn cả đống
              quần áo của tao nữa, nhớ giặt đi! Quần áo trắng của tao đều phải
              giặt riêng ra, để bị phai thì đừng trách"
              <br />
              <br />
              Nhất Bảo nhìn cánh tay in hằn mấy vết móng rỉ máu, nghe thấy những
              lời đó cậu liền thấy uất ức. Nhưng đúng là vậy, công việc của cậu
              vốn là giặt quần áo của mọi người, trong đó còn có cả quần áo của
              cậu nữa. Giương mắt nhìn cô nàng đang cáu gắt trước mặt. Ánh mắt ả
              ta như hàng ngàn mũi kim đâm vào người cậu. Lật đật từ mặt đất
              đứng dậy, vất vả bê chậu quần áo ra ngoài sân sau nhanh chóng làm
              việc. Cô ả nhìn một màn trước mặt vô cùng hài lòng.
            </Typography>
            <Box className={"hr"} my={4} />
            <Stack
              direction={"row"}
              justifyContent={"center"}
              spacing={1}
              my={2}
            >
              <Button color="info" variant="contained">
                <ArrowBackIcon />
                Chương trước
              </Button>
              <Button color="info" variant="contained">
                <MenuBookIcon />
              </Button>
              <Button color="info" variant="contained">
                Chương sau
                <ArrowForwardIcon />
              </Button>
            </Stack>
          </Container>
        </Stack>
      </ChapterSection>
    </>
  );
};

export default ChapterDetail;
