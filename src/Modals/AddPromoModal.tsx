import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik"; // ✅ Added Formik
import * as Yup from "yup"; // ✅ Added Yup
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Switch,
  SwitchProps,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CLASS_SETTING,
  DISCOUNT_TYPE,
  PROMOCODE_TYPE_CLASS,
} from "../constants/enums";
import { showToast } from "../constants/toast";
import { useGetClassesForTutorQuery } from "../service/class";
import {
  useAddPromoCodeMutation,
  useUpdatePromoByIdMutation,
} from "../service/promoCode";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface AddFormProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  data?: any;
  edit?: boolean;
  draft?:boolean;
}

export const AddPromoCodeModal = ({
  open,
  handleOpen,
  handleClose,
  data,
  edit,
  draft
}: AddFormProps) => {
  const [createPromo] = useAddPromoCodeMutation();
  const [updatePromo] = useUpdatePromoByIdMutation();
  const [setting, setSetting] = useState<number>(0);
  const navigate=useNavigate();
  const { data: classData } = useGetClassesForTutorQuery(
    {
      setting: CLASS_SETTING.PUBLISH,
      limit: 50,
      page: 1,
    },
    { skip: !open }
  );
  console.log(data, "data in prpomo");

  const validationSchema = Yup.object({
    name:   Yup.string().required("Name is required"),
    maxUses:  setting==CLASS_SETTING.PUBLISH ? Yup.string().required("Max Uses is required"):Yup.string().optional(),
    expiryDate:setting==CLASS_SETTING.PUBLISH ?  Yup.string().required("Expiry Date is required"):Yup.string().optional(),
  });

  const formik = useFormik<any>({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
      customCode: data?.codeName || "",
      discountType:
        data?.discountType == DISCOUNT_TYPE.PERCENTAGE ? false : true,
      percentage:
        data?.discountType == DISCOUNT_TYPE.PERCENTAGE ? data?.discount : "",
      maxUses: data?.maxUser || "",
      expiryDate: data?.expiryDate || "",
      startDate: data?.startDate || "",
      classType:
        data?.type == PROMOCODE_TYPE_CLASS.BOTH
          ? ["1-on-1", "Group"]
          : data?.type == PROMOCODE_TYPE_CLASS.CLASS
            ? ["Group"]
            : data?.type == PROMOCODE_TYPE_CLASS.ONE_TO_ONE
              ? ["1-on-1"]
              : [],
      applyOnAll: data?.allClasses || true,
      schedulePromotionStart: data?.startDate ? true : false,
      fixedAmount:
        data?.discountType == DISCOUNT_TYPE.FLAT ? data?.discount : "",
      classId: data?.classes || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      handleClose();
      const body = {
        name: values?.name,
        discountType: values?.discountType
          ? DISCOUNT_TYPE.FLAT
          : DISCOUNT_TYPE.PERCENTAGE,
        discount: !values?.discountType
          ? Number(values.percentage)
          : Number(values.fixedAmount),
          ...(values?.maxUses ? { maxUser: Number(values?.maxUses)}:{}),
       ...(values?.expiryDate ? {  expiryDate: values?.expiryDate}:{}),
      
        type:
          values?.classType?.length === 2
            ? PROMOCODE_TYPE_CLASS?.BOTH
            : values?.classType?.includes("Group")
              ? PROMOCODE_TYPE_CLASS?.CLASS
              : PROMOCODE_TYPE_CLASS?.ONE_TO_ONE,
        allClasses: values?.applyOnAll,
        setting:
          setting == CLASS_SETTING.DRAFT
            ? CLASS_SETTING.DRAFT
            : CLASS_SETTING.PUBLISH,
        ...(values?.classType?.includes("Group") && !values?.applyOnAll
          ? { classIds: values?.classId }
          : {}),
        ...(values?.schedulePromotionStart
          ? { startDate: values?.startDate }
          : {}),
        ...(values?.customCode ? { codeName: values?.customCode } : {}),
      };
      console.log(body, "body");

      try {
        let res;
        if (edit) {
          res = await updatePromo({ id: data._id, body: body }).unwrap();
        } else {
          res = await createPromo(body).unwrap();
        }
        if (res?.statusCode === 200) {
          edit
            ? showToast("Promo code updated successfully")
            : showToast(setting==CLASS_SETTING.PUBLISH ?   "Promo code added successfully":"Promo code added in drafts");

          formik.resetForm();
        }
        if(draft){
          navigate('/tutor/promo-codes')
        }
       
      } catch (error: any) {
        toast.error(error?.data?.m);
      } finally {
        handleClose();
      }
    },
  });


  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("discountType", event.target.checked);
  };
  const handleSwitchChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("schedulePromotionStart", event.target.checked);
  };
  const handleSwitchChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("applyOnAll", event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentArray = formik.values.classType;

    if (checked) {
      formik.setFieldValue("classType", [...currentArray, value]);
    } else {
      formik.setFieldValue(
        "classType",
        currentArray.filter((item: any) => item !== value)
      );
    }
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="add_promo_modal"
    >
      <Box sx={style}>
        <div className="form_discuss">
          <div
            className="btn-close"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            <CloseIcon onClick={handleClose} />
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Promo Code
          </Typography>

          {/* ✅ Wrapped form in formik.handleSubmit */}
          <form
            className="form gap_p"
            onSubmit={formik.handleSubmit}
            style={{ marginTop: "20px" }}
          >
            {/* ✅ Title input with Formik bindings */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label htmlFor="">Promo Name</label>
              <Input
                fullWidth
                placeholder="Enter promotion name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.name as string}
                </Typography>
              )}
            </div>

            <div className="control_group" style={{ marginTop: "15px" }}>
              <label htmlFor="">Custom Promo Code Name (Optional)</label>
              <Input
                fullWidth
                placeholder="Leave Blank for auto-generation"
                name="customCode"
                value={formik.values.customCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <small>If left blank, a random code will be generated</small>
              {formik.touched.customCode && formik.errors.customCode && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.customCode as string}
                </Typography>
              )}
            </div>
            <div className="control_group set_discount">
              <label htmlFor="Discount Type">Discount Type</label>
              {/* <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={currency}
                name="category"
                onChange={handleChange}
                fullWidth

              >
                <MenuItem value="" disabled>
                  USD
                </MenuItem>
                <MenuItem value="1">
                  CAD
                </MenuItem>
                <MenuItem value="2">
                  EUR
                </MenuItem>
                <MenuItem value="3">
                  AUD
                </MenuItem>

              </Select> */}
              <div className="set">
                <p>%</p>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={formik.values.discountType}
                      name="discountType"
                      onChange={handleSwitchChange}
                      defaultChecked
                    />
                  }
                  label=""
                />
                <p>$</p>
              </div>
            </div>
            {!formik.values.discountType ? (
              <div className="control_group" style={{ marginTop: "15px" }}>
                <label htmlFor="">Percentage</label>
                <Input
                  fullWidth
                  placeholder="Percentage"
                  name="percentage"
                  type="number"
                  value={formik.values.percentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.percentage && formik.errors.percentage && (
                  <Typography color="error" fontSize={12}>
                    {formik.errors.percentage as string}
                  </Typography>
                )}
              </div>
            ) : (
              <div className="control_group" style={{ marginTop: "15px" }}>
                <label htmlFor="">Fixed Amount (CAD)</label>
                <Input
                  fullWidth
                  placeholder="Fixed Amount (CAD)"
                  name="fixedAmount"
                  type="number"
                  value={formik.values.fixedAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fixedAmount && formik.errors.fixedAmount && (
                  <Typography color="error" fontSize={12}>
                    {formik.errors.fixedAmount as string}
                  </Typography>
                )}
              </div>
            )}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label htmlFor="">Max uses</label>

              <Input
                fullWidth
                placeholder="Max uses"
                name="maxUses"
                type="number"
                value={formik.values.maxUses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.maxUses && formik.errors.maxUses && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.maxUses as string}
                </Typography>
              )}
            </div>

            <div className="control_group" style={{ marginTop: "15px" }}>
              <label htmlFor="">Expiry date</label>
              <Input
                fullWidth
                placeholder="Expiry date"
                name="expiryDate"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.expiryDate as string}
                </Typography>
              )}
            </div>

            <div className="control_group set_discount">
              <label htmlFor="">Schedule Promotion Start</label>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    name="schedulePromotionStart"
                    checked={formik.values.schedulePromotionStart}
                    onChange={handleSwitchChange1}
                    defaultChecked
                  />
                }
                label=""
              />
            </div>
            {formik.values.schedulePromotionStart ? (
              <>
                {" "}
                <div className="control_group" style={{ marginTop: "15px" }}>
                  <label htmlFor="">Start date</label>
                  <Input
                    fullWidth
                    placeholder="Start date"
                    name="startDate"
                    type="date"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <Typography color="error" fontSize={12}>
                      {formik.errors.startDate as string}
                    </Typography>
                  )}
                </div>
              </>
            ) : null}
            <div className="control_group">
              <label htmlFor="">Class Type</label>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik?.values?.classType?.includes("1-on-1")}
                    onChange={handleCheckboxChange}
                    name="classType"
                    value="1-on-1"
                  />
                }
                label="1-on-1"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik?.values?.classType?.includes("Group")}
                    onChange={handleCheckboxChange}
                    name="classType"
                    value="Group"
                  />
                }
                label="Group"
              />
            </div>
            <div className="control_group set_discount">
              <label htmlFor="">Apply a discount on all classes</label>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={formik.values.applyOnAll}
                    onChange={handleSwitchChange2}
                    defaultChecked
                  />
                }
                label=""
              />
            </div>
            {formik.values.applyOnAll ? null : (
              <div className="control_group">
                <label htmlFor="classId">Select Classes</label>
                <Select
                  id="classId"
                  name="classId"
                  multiple
                  value={formik.values.classId}
                  onChange={(e) => {
                    const {
                      target: { value },
                    } = e;
                    formik.setFieldValue(
                      "classId",
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected.length) return "Select Classes";
                    return classData?.data?.data
                      ?.filter((item: any) => selected.includes(item._id))
                      .map((item: any) => item.topic)
                      .join(", ");
                  }}
                >
                  {classData?.data?.data?.map((item: any) => (
                    <MenuItem key={item._id} value={item._id}>
                      <Checkbox
                        checked={formik.values.classId?.includes(item._id)}
                      />
                      {item?.topic || ""}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            <div className="form_btn">
              <button className="btn transparent" onClick={handleClose}>
                Cancel
              </button>
              {edit ? null:(
                <button
                className="btn transparent"
                type="button"
                onClick={async () => {
                  await setSetting(CLASS_SETTING.DRAFT);
                  formik.submitForm();
                }}
              
              >
                Save as draft
              </button>
              )}
              
              <button type="button"   onClick={async () => {
                  await setSetting(CLASS_SETTING.PUBLISH);
                  formik.submitForm();
                }}className=" btn primary">
                {edit ? "Save" : "Generate and Activate"}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};
