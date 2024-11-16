import { DeleteOutlined, ImageOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  Button,
  IconButton,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCars } from "../../state";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import CloudinaryUploader from "../../components/CloudinaryUploader";
import WidgetWrapper from "../../components/WidgetWrapper";

const CreateCar = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const cloudinaryUploader = CloudinaryUploader();

  const handleCarCreation = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", carName);
      formData.append("description", description);
      formData.append("tags", tags);

      if (images.length > 0) {
        for (const image of images) {
          formData.append("images", image);
        }
      }

      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/cars`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to create car");

      const car = await response.json();
      toast.success("Car created successfully", { autoClose: 1000 });

      dispatch(setCars({ cars: [car] }));
      setCarName("");
      setDescription("");
      setTags("");
      setImages([]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Error creating car");
    }
  };

  return (
    <WidgetWrapper>
      <form onSubmit={handleCarCreation}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#1976d2",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1rem",
            }}
          >
            Add a New Car
          </Typography>
        </Box>

        <Divider sx={{ margin: "1.25rem 0", borderColor: "#1976d2" }} />

        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            sx={{
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Car Name
          </Typography>
          <InputBase
            placeholder="Enter car name"
            onChange={(e) => setCarName(e.target.value)}
            value={carName}
            sx={{
              width: "100%",
              borderRadius: "5px",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        </Box>

        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            sx={{
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Description
          </Typography>
          <InputBase
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            multiline
            sx={{
              width: "100%",
              borderRadius: "5px",
              padding: "1rem",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        </Box>

        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            sx={{
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Tags
          </Typography>
          <InputBase
            placeholder="e.g., Sedan, Toyota, Dealer ABC"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
            sx={{
              width: "100%",
              borderRadius: "5px",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        </Box>

        <Box border="1px solid #ccc" borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles="image/*"
            multiple
            maxFiles={10}
            onDrop={(acceptedFiles) =>
              setImages((prev) => [...prev, ...acceptedFiles])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                sx={{
                  "&:hover": { cursor: "pointer" },
                  textAlign: "center",
                }}
              >
                <input {...getInputProps()} />
                {images.length === 0 ? (
                  <Box
                    border="2px dashed #1976d2"
                    p="1rem"
                    borderRadius="5px"
                    sx={{
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography color="#1976d2">
                      Drag & drop images or click to select
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{ position: "relative", marginBottom: "1rem" }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Car ${index + 1}`}
                          style={{
                            width: "100%",
                            borderRadius: "5px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "#fff",
                            color: "#f44336",
                            "&:hover": {
                              backgroundColor: "#f44336",
                              color: "#fff",
                            },
                          }}
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>

        {isLoading ? (
          <Loading />
        ) : (
          <Box sx={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Button
              disabled={!carName || !description || images.length === 0}
              type="submit"
              sx={{
                borderRadius: "5px",
                padding: "0.75rem 2rem",
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Add Car
            </Button>
          </Box>
        )}
      </form>
    </WidgetWrapper>
  );
};

export default CreateCar;
