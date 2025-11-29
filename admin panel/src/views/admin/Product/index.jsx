import { useEffect, useState } from "react";
import Banner from "../../../components/banner";
import InputField from "components/fields/InputField";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { withAuthContext } from "context/Auth";
import Upload from "./Upload";
import Dropdown from "components/dropdown";
import { withBrandContext } from "context/Brand";
import { withCategoryContext } from "context/Category";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProductCard from "./ProductCard";
import ImageCloud from "../../../link";

const initialState = {
  ProductCode: "",
  name: "",
  description: "",
  currentColor: "",
  LifeStage: "",
  currentSize: "",
  currentFlavor: "",
  fat: "",
  protein: "",
  moisture: "",
  fiber: "",
  ingredients: "",
  price: 0,
  category: "",
  brand: "",
  quantity: 0,
  images: [],
  preview: [],
  color: [],
  size: [],
  flavor: [],
}
const Product = ({ Token, CheckToken,
  AllBrand,
  GetAllBrand,
  BrandError,
  AllCategory,
  GetAllCategory,
  CategoryError, }) => {
  useEffect(() => {
    GetAllBrand();
    GetAllCategory();
  }, []);
  const { id } = useParams()

  const [state, setState] = useState(initialState);

  function handleChange(name, value) {
    setState({ ...state, [name]: value })
  }

  const navigate = useNavigate();


  const GetProductInfo = () => {
    if (Token) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/ProductInfo/${id}`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            const images = [];
            res?.data?.data?.images?.map((a) => {
              images.push(`${ImageCloud}/${a?.filename}`,
              )
            })
            setState({
              ...res?.data?.data,
              preview: images,
              images: [],
              fat: res?.data?.data?.nutritional_info?.fat,
              protein: res?.data?.data?.nutritional_info?.protein,
              moisture: res?.data?.data?.nutritional_info?.moisture,
              fiber: res?.data?.data?.nutritional_info?.fiber,
            })
          }
        })
        .catch((err) => {
          swal({
            text: err?.response?.data?.message
              ? err?.response?.data?.message
              : "There was some Error",
            button: {
              text: "Ok",
              closeModal: true,
            },
            icon: "error",
            time: 3000,
          });
          navigate("/admin/Product");
        });
    } else {
      CheckToken();
      GetProductInfo()

    }
  };

  const handleSubmit = () => {
    if (state !== initialState && Token) {
      axios
        .post(`${process.env.REACT_APP_PUBLIC_PATH}/${id != "New" ? `Update-Product/${id}` : "Create-Product"}`, state, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setState(initialState)
            navigate("/admin/Product");
          }

          swal({
            text: res?.data?.message,
            button: {
              text: "Ok",
              closeModal: true,
            },
            icon: res?.data?.status == 200 ? "success" : "error",
            time: 3000,
          });
        })
        .catch((err) => {
          const message = err?.response?.data?.message || "There was some Error"
          swal({
            text: message,
            button: {
              text: "Ok",
              closeModal: true,
            },
            icon: "error",
            time: 3000,
          });
        });
    } else {
      swal({
        text: "Please Check All Fields As There was some Error",
        button: {
          text: "Ok",
          closeModal: true,
        },
        icon: "error",
        time: 3000,
      });
      CheckToken();
      handleSubmit()

    }
  };

  useEffect(() => {
    if (id != "New") {
      GetProductInfo()
    }
  }, [id])



  const handleImageSelected = (imageData) => {
    const images = state?.images ? [...state?.images] : []
    const preview = state?.preview ? [...state?.preview] : []
    images.push(imageData);
    preview.push(imageData?.data);
    setState({ ...state, preview: preview, images: images });
  };



  const handleRemove = (Obj) => {
    if (Token && state?.ProductCode) {
      axios
        .post(
          `${process.env.REACT_APP_PUBLIC_PATH}/Remove-Product-Accesories/${state?.ProductCode}`,
          Obj,
          {
            headers: {
              Authorization: Token
                ? `${Token}`
                : `${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res?.data?.status == 200) {
            GetProductInfo()
          }
          swal({
            text: res?.data?.message,
            button: {
              text: "Ok",
              closeModal: true,
            },
            icon: res?.data?.status == 200 ? "success" : "error",
            time: 3000,
          });
        })
        .catch((err) => {
          swal({
            text: "There was some Error",
            button: {
              text: "Ok",
              closeModal: true,
            },
            icon: "error",
            time: 3000,
          });
        });
    } else {
      swal({
        text: "Please Check All Fields As There was some Error",
        button: {
          text: "Ok",
          closeModal: true,
        },
        icon: "error",
        time: 3000,
      });
      CheckToken();
      handleRemove();
    }
  };


  return (
    <div className="mt-3 grid h-full grid-cols-1">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <Banner Heading={" Add/Update Products"} SubHeading={" Embark on a journey of quality and trust with us, your premier meat exporter. From farm to fork, our commitment to excellence ensures premium, ethically sourced meats. Elevate your culinary experience with our top-tier products."} />
        <div class="grid grid-cols-4 gap-4 my-10 bg-white rounded-[50px] py-20 px-10">
          <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
            Basic Details
          </h4>
          <InputField
            variant="auth"
            extra="mb-3"
            label="ProductCode*"
            id="ProductCode"
            type="text"
            name="ProductCode"
            value={state?.ProductCode}
            onChange={(e) => handleChange("ProductCode", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="name*"
            id="name"
            type="text"
            name="name"
            value={state?.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="description*"
            id="description"
            type="text"
            name="description"
            value={state?.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
            Product Details
          </h4>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="currentColorLabel">currentColor</InputLabel>

            <Select
              label="currentColor"
              labelId="currentColorLabel"
              id="currentColor"
              name="currentColor"
              value={state?.currentColor}
              onChange={(e) => handleChange("currentColor", e.target.value)}
            >
              {[
                "black",
                "brown",
                "multi-color",
                "orange",
                "blue",
                "pink",
                "off white",
                "green",
                "purple",
                "yellow"
              ]?.map((a) => (
                <MenuItem value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="LifeStageLabel">LifeStage</InputLabel>

            <Select
              label="LifeStage"
              labelId="LifeStageLabel"
              id="LifeStage"
              name="LifeStage"
              value={state?.LifeStage}
              onChange={(e) => handleChange("LifeStage", e.target.value)}
            >
              {[
                "all",
                "adult",
                "senior",
                "puppy",
                "kitten",
                "juvenile",
                "average",
                "all life stages",
                "low",
                "training"
              ]?.map((a) => (
                <MenuItem value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="currentSizeLabel">currentSize</InputLabel>

            <Select
              label="currentSize"
              labelId="currentSizeLabel"
              id="currentSize"
              name="currentSize"
              value={state?.currentSize}
              onChange={(e) => handleChange("currentSize", e.target.value)}
            >
              {[
                "large",
                "medium",
                "small",
                "giant",
                "toy",
                "x-large",
                "any",
                "x-small",
                "softchews",
                "xx-large"
              ]?.map((a) => (
                <MenuItem value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="currentFlavorLabel">currentFlavor</InputLabel>

            <Select
              label="currentFlavor"
              labelId="currentFlavorLabel"
              id="currentFlavor"
              name="currentFlavor"
              value={state?.currentFlavor}
              onChange={(e) => handleChange("currentFlavor", e.target.value)}
            >
              {[
                "beef",
                "lamb",
                "venison",
                "chicken",
                "duck",
                "salmon",
                "turkey",
                "pork",
                "fish",
                "rabbit",
                "tuna",
                "giblets"
              ]?.map((a) => (
                <MenuItem value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
            Ingredeints Details
          </h4>

          <InputField
            variant="auth"
            extra="mb-3"
            label="ingredients*"
            id="ingredients"
            type="text"
            name="ingredients"
            value={state?.ingredients}
            onChange={(e) => handleChange("ingredients", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="fat*"
            id="fat"
            type="text"
            name="fat"
            value={state?.fat}
            onChange={(e) => handleChange("fat", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="fiber*"
            id="fiber"
            type="text"
            name="fiber"
            value={state?.fiber}
            onChange={(e) => handleChange("fiber", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="moisture*"
            id="moisture"
            type="text"
            name="moisture"
            value={state?.moisture}
            onChange={(e) => handleChange("moisture", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="protein*"
            id="protein"
            type="text"
            name="protein"
            value={state?.protein}
            onChange={(e) => handleChange("protein", e.target.value)}
          />
          <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
            Brand And Other Details
          </h4>
          {!BrandError && (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="BrandLabel">Brand</InputLabel>

              <Select
                label="brand"
                labelId="BrandLabel"
                id="brand"
                name="brand"
                value={state?.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              >
                {AllBrand?.length && AllBrand?.map((a) => (
                  <MenuItem value={a?._id}>{a?.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!CategoryError && (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="categoryLabel">Category</InputLabel>

              <Select
                label="category"
                labelId="categoryLabel"
                id="category"
                name="category"
                value={state?.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {AllCategory?.length && AllCategory?.map((a) => (
                  <MenuItem value={a?._id}>{a?.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <InputField
            variant="auth"
            extra="mb-3"
            label="price*"
            id="price"
            type="number"
            name="price"
            value={state?.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="quantity*"
            id="quantity"
            type="text"
            name="quantity"
            value={state?.quantity}
            disabled={id != "New"}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />

          <div className="col-span-4">
            <Upload
              onImageSelected={handleImageSelected}
              preview={state?.preview}
            />
          </div>

          <button onClick={() => handleSubmit()} className="col-span-4 mb-[5%] linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            {id != "New" ? "Update" : "Add"} Product
          </button>

          {id != "New" &&
            <div className="col-span-4">
              <div className="flex flex-row justify-between ">
                <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
                  {state?.color?.length > 0 ? "Colors" : "No Colors To Show"}
                </h4>

                <button onClick={() => { if (state?.ProductCode && id) navigate(`/SelectProduct/${state?.ProductCode}/Color/${id}`) }} className="linear mt-2 w-[50%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                  Add Product Colors
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {state?.color?.length > 0 &&
                  state?.color?.map((a) => (
                    <ProductCard
                      name={a?.name}
                      ProductCode={a?.ProductCode}
                      price={a?.price}
                      image={`${ImageCloud}/${a?.images?.[0]?.filename}`}
                      description={a?.description}
                      currentColor={a?.currentColor}
                      currentSize={a?.currentSize}
                      id={a?._id}
                      SelectHeading={"Remove"}
                      SelectProduct={(id) => {
                        handleRemove({
                          ColorProductId: id,
                        });
                      }}
                      currentFlavor={a?.currentFlavor}
                    />
                  ))}
              </div>
            </div>}



          {id != "New" &&
            <div className="col-span-4">
              <div className="flex flex-row justify-between ">
                <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
                  {state?.size?.length > 0 ? "Sizes" : "No Sizes To Show"}
                </h4>

                <button onClick={() => { if (state?.ProductCode && id) navigate(`/SelectProduct/${state?.ProductCode}/Size/${id}`) }} className="linear mt-2 w-[50%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                  Add Product Sizes
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {state?.size?.length > 0 &&
                  state?.size?.map((a) => (
                    <ProductCard
                      name={a?.name}
                      ProductCode={a?.ProductCode}
                      price={a?.price}
                      image={`${ImageCloud}/${a?.images?.[0]?.filename}`}
                      description={a?.description}
                      currentColor={a?.currentColor}
                      currentSize={a?.currentSize}
                      id={a?._id}
                      SelectHeading={"Remove"}
                      SelectProduct={(id) => {
                        handleRemove({
                          SizeProductId: id,
                        });
                      }}
                      currentFlavor={a?.currentFlavor}
                    />
                  ))}
              </div>
            </div>}

          {id != "New" &&
            <div className="col-span-4">
              <div className="flex flex-row justify-between ">
                <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
                  {state?.flavor?.length > 0 ? "Flavors" : "No Flavors To Show"}
                </h4>

                <button onClick={() => { if (state?.ProductCode && id) navigate(`/SelectProduct/${state?.ProductCode}/Flavor/${id}`) }} className="linear mt-2 w-[50%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                  Add Product Flavors
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {state?.flavor?.length > 0 &&
                  state?.flavor?.map((a) => (
                    <ProductCard
                      name={a?.name}
                      ProductCode={a?.ProductCode}
                      price={a?.price}
                      image={`${ImageCloud}/${a?.images?.[0]?.filename}`}
                      description={a?.description}
                      currentColor={a?.currentColor}
                      currentSize={a?.currentSize}
                      id={a?._id}
                      SelectHeading={"Remove"}
                      SelectProduct={(id) => {
                        handleRemove({
                          FlavorProductId: id,
                        });
                      }}
                      currentFlavor={a?.currentFlavor}
                    />
                  ))}
              </div>
            </div>}
        </div>


      </div>
    </div>
  );
};

export default withAuthContext(withBrandContext(withCategoryContext(Product)));
