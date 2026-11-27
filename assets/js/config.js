"use strict";

// Giữ đúng hai API và ba key đánh giá học sinh đang sử dụng.
// /1/ là test key công khai của nhà cung cấp cho học tập, không phải key riêng.
const FOOD_CONFIG = {
  MEAL_URL: "https://www.themealdb.com/api/json/v1/1/",
  DRINK_URL: "https://www.thecocktaildb.com/api/json/v1/1/",
  DEFAULT_MEAL_SEARCH: "chicken",
  PLACEHOLDER: "assets/images/recipe-placeholder.svg",
  REVIEW_KEYS: {
    meal: "foodMenuMealReviews",
    vegetarian: "foodMenuVegetarianReviews",
    drink: "foodMenuDrinkReviews",
  },
};
