import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const DailyFoodList = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  // Fetch All Daily Food Entries
  const fetchFoods = async () => {
    try {
      const response = await api.get("/dailyfood/all"); // Fetch all food entries
      setFoods(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching daily food entries:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Group Food Entries by Date
  const groupByDate = (foods) => {
    const groupedData = {};
    foods.forEach((food) => {
      const date = new Date(food?.time).toLocaleDateString(); // Group by date
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(food);
    });

    // Sort entries by time in descending order
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].sort((a, b) => new Date(b.time) - new Date(a.time));
    });

    return groupedData;
  };

  const groupedFoods = groupByDate(foods);

  // Open Food Entry for Editing / Viewing
  const handleFoodClick = (foodId) => {
    navigate("/dailyfood/id/" + foodId);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Daily Food Log</h2>

        {Object.keys(groupedFoods).length === 0 ? (
          <div className="text-center text-gray-500">No food entries found.</div>
        ) : (
          Object.keys(groupedFoods).map((date, index) => (
            <div key={index} className="mb-6">
              {/* Parent Date Section */}
              <div className="text-sm text-gray-600 font-semibold mb-4 bg-gray-100 shadow-md rounded-lg px-4 py-2">
                {date}
              </div>

              {/* Comment-style Food Entries (Child Entries) */}
              <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-500 pl-4">
                {groupedFoods[date].map((food, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleFoodClick(food?._id)}
                    className="bg-white shadow-md p-4 rounded-lg relative cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    {/* Time (Sorted by Time Desc) */}
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(food?.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Food Images (Only Show if Available) */}
                    {food?.images?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {food.images.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={
                              API_BASE_URL +
                              "/media/img/" +
                              img +
                              "?token=" +
                              localStorage.getItem("jwt")
                            }
                            alt={`food-${i}`}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {/* Food Items as Pills */}
                    {food?.items?.length > 0 && (
                      <div className="flex flex-wrap gap-2 ">
                        {food.items.map((item, i) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    

                    <div className="absolute left-[-18px] top-8 w-4 h-4 border-l-2 border-b-2 border-gray-500 rounded-bl-md"></div>

                    {/* Curved Border if Not Last */}
                    {/* {idx !== groupedFoods[date].length - 1 && (
                      <div className="absolute left-[-30px] top-8 w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl-md"></div>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyFoodList;
