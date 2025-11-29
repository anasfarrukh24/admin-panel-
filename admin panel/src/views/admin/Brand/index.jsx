import { useEffect, useState } from "react";
import Banner from "../../../components/banner";
import InputField from "components/fields/InputField";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { withAuthContext } from "context/Auth";
import Upload from "./Upload";
import ImageCloud from "../../../link";

const initialState = {
  name: "",
  description: "",
  country: "",
  website: "",
  logo: {},
  preview: ""
}
const Brand = ({ Token, CheckToken }) => {
  const { id } = useParams()

  const [state, setState] = useState(initialState);

  function handleChange(name, value) {
    setState({ ...state, [name]: value })
  }

  const navigate = useNavigate();


  const GetBrandInfo = () => {
    if (Token) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/BrandInfo/${id}`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setState({
              ...res?.data?.data,
              preview: `${ImageCloud}/${res?.data?.data?.logo?.filename}`,
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
          navigate("/admin/Brand");
        });
    } else {
      CheckToken();
      GetBrandInfo()
    }
  };

  const handleSubmit = () => {
    if (state !== initialState && Token) {
      axios
        .post(`${process.env.REACT_APP_PUBLIC_PATH}/${id != "New" ? `Update-Brand/${id}` : "Create-Brand"}`, state, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setState(initialState)
            navigate("/admin/Brand");
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
          console.log(err?.response?.data)
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
      handleSubmit()

    }
  };

  useEffect(() => {
    if (id != "New") {
      GetBrandInfo()
    }
  }, [id])


  const handleImageSelected = (imageData) => {
    handleChange("logo", imageData);
  };
  return (
    <div className="mt-3 grid h-full grid-cols-1">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <Banner Heading={" Add/Update Brands"} SubHeading={" Embark on a journey of quality and trust with us, your premier meat exporter. From farm to fork, our commitment to excellence ensures premium, ethically sourced meats. Elevate your culinary experience with our top-tier products."} />
        <div class="grid grid-cols-4 gap-4 my-10 bg-white rounded-[50px] py-20 px-10">
          <h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">
            Basic Details
          </h4>
          <InputField
            variant="auth"
            extra="mb-3"
            label="name*"
            id="name"
            type="text"
            name="name"
            value={state?.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={id != "New"}
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
          <InputField
            variant="auth"
            extra="mb-3"
            label="country*"
            id="country"
            type="text"
            name="country"
            value={state?.country}
            onChange={(e) => handleChange("country", e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="website*"
            id="website"
            type="text"
            name="website"
            value={state?.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
          <div className="col-span-4">
            <Upload
              onImageSelected={handleImageSelected}
              preview={state?.preview}
            />
          </div>

          <button onClick={() => handleSubmit()} className="col-span-4 linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            {id != "New" ? "Update" : "Add"} Brand
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuthContext(Brand);
