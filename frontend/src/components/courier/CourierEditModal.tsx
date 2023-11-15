/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, DatePicker, Modal, SelectPicker } from "rsuite";
import { useGetStyleNoQuery } from "../../redux/features/styles/styleApi";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import moment from "moment";
import { useEditCourierInfoMutation } from "../../redux/features/couriers/courierApi";
import { dataForSelectPicker } from "../../common/commonData";

interface IFormInput {
  courierName: string;
  awbNo: string;
  styleNo: string | null;
  courierWeight: string;
  courierDetails: string | undefined;
  courierDate: string | undefined;
}

const CourierEditModal = ({ open, courierEditData, handleClose }: any) => {
  // Fetching All Style
  const { data: styles } = useGetStyleNoQuery(null);

  const [
    editCourierInfo,
    { isLoading, isError, isSuccess, reset, error, data },
  ] = useEditCourierInfoMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    const updatedData = {
      courierName: data.courierName,
      styleNo: data.styleNo,
      awbNo: data.awbNo,
      courierWeight: data.courierWeight,
      courierDetails: data.courierDetails,
      courierDate: data.courierDate,
    };

    await editCourierInfo({
      id: courierEditData?.courierId,
      data: updatedData,
    });
  };

  useEffect(() => {
    if (!isError && !isLoading && isSuccess) {
      toast.success(data?.message || "Successfully Updated  Courier.", {
        style: {
          border: "1px solid green",
          padding: "16px",
          color: "green",
        },
        iconTheme: {
          primary: "green",
          secondary: "#FFFAEE",
        },
      });
      reset();
      handleClose();
    }
    if (isError && !isLoading) {
      // @ts-ignore
      toast.error(error?.message || "Failed to update Courier.", {
        style: {
          border: "1px solid red",
          padding: "16px",
          color: "red",
        },
        iconTheme: {
          primary: "red",
          secondary: "#FFFAEE",
        },
      });
    }
  }, [data, error, handleClose, isError, isLoading, isSuccess, reset]);

  return (
    <>
      <Modal size="full" backdrop="static" open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="font-semibold">
            Edit Courier Details : {courierEditData?.courierName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4">
            {/* form */}
            <section className=" bg-white border rounded-lg p-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* 1st section */}
                <div className="flex justify-between  gap-[24px] mb-5">
                  <div className="flex flex-col gap-3 w-full ">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="courierName"
                        className="text-sm font-medium"
                      >
                        Courier Name
                      </label>
                      {errors?.courierName && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.courierName?.message}
                        </span>
                      )}
                    </div>

                    <SelectPicker
                      id="courierName"
                      size="lg"
                      defaultValue={courierEditData?.courierName || undefined}
                      data={dataForSelectPicker.courierNamesData ?? []}
                      onChange={(value: string | null): void => {
                        setValue("courierName", value as string);
                      }}
                    />
                  </div>
                  {/* Style No */}
                  <div className="flex flex-col gap-3 w-full ">
                    <div className="flex justify-between items-center">
                      <label htmlFor="styleNo" className="text-sm font-medium">
                        Style No
                      </label>
                      {errors?.styleNo && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.styleNo?.message}
                        </span>
                      )}
                    </div>
                    <SelectPicker
                      onChange={(value: string | null): void =>
                        setValue("styleNo", value)
                      }
                      size="lg"
                      defaultValue={courierEditData?.styleNo || undefined}
                      data={
                        styles?.data?.map((style: any) => ({
                          label: style?.styleNo,
                          value: style?.styleNo,
                        })) || []
                      }
                    />
                  </div>
                </div>
                {/* 2nd section */}

                <div className="flex justify-between gap-[24px] mb-5">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="totalPack"
                        className="text-sm font-medium"
                      >
                        AWB no
                      </label>
                      {errors?.awbNo && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.awbNo?.message}
                        </span>
                      )}
                    </div>
                    <input
                      id="awbNo"
                      defaultValue={courierEditData?.awbNo}
                      type="text"
                      {...register("awbNo", {
                        required: "AWB no  is Required ",
                      })}
                      className=" border py-2 focus:outline-none px-2 border-[#E4E7EC] rounded-[8px]  "
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="courierWeight"
                        className="text-sm font-medium"
                      >
                        Courier Weight
                      </label>
                      {errors?.courierWeight && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.courierWeight?.message}
                        </span>
                      )}
                    </div>
                    <input
                      id="courierWeight"
                      defaultValue={courierEditData?.courierWeight}
                      type="text"
                      {...register("courierWeight", {
                        required: "Courier Details is Required ",
                      })}
                      className=" border py-2 focus:outline-none px-2 border-[#E4E7EC] rounded-[8px]  "
                    />
                  </div>
                </div>

                {/* 3rd section */}
                <div className="flex justify-between gap-[24px] mb-5">
                  {/* Total Pack */}

                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="totalPack"
                        className="text-sm font-medium"
                      >
                        Courier Details
                      </label>
                      {errors?.courierDetails && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.courierDetails?.message}
                        </span>
                      )}
                    </div>
                    <input
                      id="courierDetails"
                      defaultValue={courierEditData?.courierDetails}
                      type="text"
                      {...register("courierDetails", {
                        required: "Courier Details is Required ",
                      })}
                      className=" border py-2 focus:outline-none px-2 border-[#E4E7EC] rounded-[8px]  "
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-[50%]">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="courierDate"
                        className="text-sm font-medium"
                      >
                        Courier Date
                      </label>
                      {errors?.courierDate && (
                        <span className="text-[10px]  text-white px-1.5 py-0.5 rounded font-medium bg-red-800">
                          {errors?.courierDate?.message}
                        </span>
                      )}
                    </div>
                    <DatePicker
                      id="courierDate"
                      defaultValue={
                        courierEditData?.courierDate
                          ? moment(courierEditData.courierDate).toDate()
                          : undefined
                      }
                      onChange={(value: Date | null): void => {
                        const isoString = value?.toISOString();
                        setValue("courierDate", isoString);
                      }}
                      size="lg"
                      editable={false}
                      placeholder="Courier Date "
                      placement="topStart"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="submit"
                    loading={isLoading}
                    appearance="default"
                    className="bg-[#0284c7] text-white hover:text-white/80 hover:bg-[#0284c7] focus:bg-[#0284c7] focus:text-white/50"
                  >
                    Submit Changes
                  </Button>
                  <Button
                    onClick={handleClose}
                    appearance="ghost"
                    className="hover:border-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CourierEditModal;