import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputBase,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const fullName = `${user.name}`;

  return (
    <FlexBetween
      padding="1rem 6%"
      style={{
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid #e0e0e0",
      }}
    >
      {/* Logo or Title */}
      <FlexBetween gap="1.75rem">
        {/* Navigation Links */}
        <Link
          to="/mycars"
          style={{
            textDecoration: "none",
            color: "#1976d2",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#0d47a1")}
          onMouseLeave={(e) => (e.target.style.color = "#1976d2")}
        >
          My Cars
        </Link>
      </FlexBetween>

      {/* User Account Section */}
      <FlexBetween gap="2rem">
        <FormControl
          variant="standard"
          value={fullName}
          style={{ minWidth: "150px" }}
        >
          <Select
            value={fullName}
            style={{
              width: "150px",
              borderRadius: "8px",
              padding: "0.25rem 1rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s",
              color: "#333333",
            }}
            input={<InputBase />}
            MenuProps={{
              PaperProps: {
                style: {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                },
              },
            }}
          >
            <MenuItem value={fullName}>
              <Typography
                style={{
                  fontWeight: "bold",
                  color: "#1976d2",
                }}
              >
                {fullName}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(setLogout());
                navigate("/");
              }}
              style={{
                color: "#d32f2f",
                fontWeight: "bold",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffcdd2")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Log Out
            </MenuItem>
          </Select>
        </FormControl>
      </FlexBetween>
    </FlexBetween>
  );
}
