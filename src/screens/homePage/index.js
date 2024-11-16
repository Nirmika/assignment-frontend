import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar";
import CreatePost from "../widgets/CreateCar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import CreateCar from "../widgets/CreateCar";

const HomePage = () => {
  const { _id } = useSelector((state) => state.auth.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={"flex"}
        gap="0.5rem"
        justifyContent="space-between"
        sx={{
          maxHeight: "100vh",
          overflowY: "auto",
          scrollbarWidth: "0px",
        }}
      >
        {/*  left part of the home screen */}
        <Box flexBasis={"26%"}></Box>

        {/*  middle part of the home screen */}
        <Box flexBasis={"42%"} mt={undefined}>
          <CreateCar userId={_id} />
        </Box>

        {/*  right part of the home screen */}
        <Box flexBasis={"26%"}></Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default HomePage;
