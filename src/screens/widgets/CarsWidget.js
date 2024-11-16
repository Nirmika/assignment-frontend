import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCars } from "../../state";
import CarWidget from "./CarWidget";
import Navbar from "../navbar";

const CarsWidget = () => {
  const dispatch = useDispatch();
  const cars = useSelector((state) => state.auth.cars);
  const token = useSelector((state) => state.auth.token);

  const fetchCars = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/cars`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      dispatch(setCars({ cars: data }));
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []); // Runs only once when the component mounts

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    padding: "1rem",
    justifyContent: "center",
  };

  return (
    <>
      <Navbar />
      <div style={gridStyles}>
        {cars?.map((car) => (
          <div
            key={car._id}
            style={{
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px)")
            }
          >
            <CarWidget
              carId={car._id}
              carUserId={car.user}
              title={car.title}
              description={car.description}
              imgUrls={car.images}
              tags={car.tags}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CarsWidget;
