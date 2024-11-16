import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../screens/navbar";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState({
    images: [],
    title: "",
    tags: [],
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getCarDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_Backend_URL}/cars/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let data = await response.json();
        console.log(data.success);

        if (response.status == 200) {
          data = data.message;
          setCar({
            images: data.images || [],
            title: data.title || "",

            tags: data.tags || [],
            description: data.description || "",
          });
        } else {
          console.error("Failed to fetch car details");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      getCarDetails();
    }
  }, [id, token]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  console.log(car);

  return (
    <>
      <Navbar />
      <Box p={2} style={{ marginLeft: "5%" }}>
        <Typography variant="h4" gutterBottom>
          Car Details
        </Typography>

        {/* Images Section */}
        <Grid container spacing={2}>
          {car?.images?.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <div
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${process.env.REACT_APP_Backend_URL}/uploads/${image}`}
                  alt={`Car Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Details Section */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            <span>Title:</span>{" "}
            <span style={{ color: "#666" }}> {car.title}</span>
          </Typography>

          <Typography variant="h6" gutterBottom>
            <span>Tags:</span>{" "}
            <span style={{ color: "#666" }}> {car.tags.join(", ")}</span>
          </Typography>
          <Typography style={{ marginTop: "0.5rem" }} variant="h6" gutterBottom>
            <span>Description:</span>
            <p
              className="text-justify"
              style={{
                fontSize: "14px",
                color: "#666",
              }}
            >
              {car.description}
            </p>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default CarDetails;
