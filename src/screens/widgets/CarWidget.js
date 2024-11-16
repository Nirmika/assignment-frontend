import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCar, setCars } from "../../state";
import { toast } from "react-toastify";
import CloudinaryUploader from "../../components/CloudinaryUploader";
import WidgetWrapper from "../../components/WidgetWrapper";

const CarWidget = ({
  carId,
  carUserId,
  imgUrls: initialImgUrls = [],
  title: initialTitle,
  description: initialDescription,
  tags: initialTags,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [images, setImages] = useState([]);
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [newTags, setNewTags] = useState(initialTags || "");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentCars = useSelector((state) => state.auth.cars);
  const cloudinaryUploader = CloudinaryUploader();

  /* ---------------- Edit Car ---------------- */
  const handleEditCar = async () => {
    setIsLoading(true);
    try {
      // Prepare FormData to handle images and other data
      const formData = new FormData();

      // Add text data
      formData.append("title", newTitle);
      formData.append("description", newDescription);
      formData.append("tags", JSON.stringify(newTags));

      // Append old image URLs if they exist
      initialImgUrls.forEach((url) => formData.append("images", url));

      // Append new images from the Dropzone
      images.forEach((image) => formData.append("images", image));
      console.log(formData);

      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/cars/${carId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send FormData directly
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit car");
      }

      const { message: updatedCar } = await response.json(); // Assuming the response returns the updated car object

      const updatedCars = currentCars.map((car) =>
        car._id === updatedCar._id ? updatedCar : car
      ); // Replace the old car with the updated car based on _id

      dispatch(setCars({ cars: updatedCars })); // Update the state with the modified car list

      toast.success("Car updated successfully", { autoClose: 1000 });
      setOpenEditModal(false);
      resetEditFields();
    } catch (error) {
      console.error("Error editing car:", error);
      toast.error("Error editing car");
    } finally {
      setIsLoading(false);
    }
  };

  const resetEditFields = () => {
    setImages([]);
    setNewTitle(initialTitle);
    setNewDescription(initialDescription);
    setNewTags(initialTags);
  };

  /* ---------------- Delete Car ---------------- */
  const handleDeleteCar = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/cars/${carId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      const { message: deletedCar } = await response.json();
      const updatedCars = currentCars.filter(
        (car) => car._id !== deletedCar._id
      );
      dispatch(setCars({ cars: updatedCars }));
      toast.success("Car deleted successfully", { autoClose: 1000 });
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Error deleting car");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      {/* Car Card */}
      <Box
        className="car-card"
        onClick={() => navigate(`/car-details/${carId}`)}
        sx={{
          width: "300px", // Set a consistent width
          height: "400px", // Set a consistent height
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          cursor: "pointer",
          overflow: "hidden", // Ensure content stays within the box
          display: "flex",
          flexDirection: "column", // Aligns image and content vertically
        }}
      >
        {initialImgUrls.length > 0 && (
          <img
            src={`${process.env.REACT_APP_Backend_URL}/uploads/${initialImgUrls[0]}`}
            alt={initialTitle}
            style={{
              width: "100%",
              height: "60%", // Consistent height for the image section
              objectFit: "cover", // Ensures the image covers the space proportionally
            }}
          />
        )}
        <Box sx={{ padding: "16px", flex: 1 }}>
          {" "}
          {/* Ensures content fills remaining space */}
          <Typography variant="h6" gutterBottom>
            <strong>Car Title:</strong> {initialTitle}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong>{" "}
            <span
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.6",
                maxHeight: "40px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2, // Limit to 2 lines
                WebkitBoxOrient: "vertical",
              }}
            >
              {initialDescription}
            </span>
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Tags:</strong> {initialTags}
          </Typography>
          <Box display="flex" justifyContent="space-between" mt="1rem">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteOutline />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenEditModal(true);
              }}
            >
              <EditOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Car</DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="1rem">
            <TextField
              label="Car Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Tags"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              fullWidth
            />
            <Box>
              <Dropzone
                acceptedFiles="image/*"
                multiple
                onDrop={(acceptedFiles) =>
                  setImages((prev) => [...prev, ...acceptedFiles])
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed gray",
                      borderRadius: "8px",
                      padding: "1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: "1rem",
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography>Add Images (Max: 10)</Typography>
                  </Box>
                )}
              </Dropzone>

              {images.length > 0 && (
                <Box>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        marginBottom: "1rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          display: "block",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditCar}
            disabled={isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Car?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this car? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteCar}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default CarWidget;
