/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  DatePicker,
  Form,
  SelectPicker,
  Tooltip,
  Whisper,
} from "rsuite";
import { useGetStyleNoQuery } from "../../redux/features/styles/styleApi";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { renderLoading } from "../../components/renderLoading/RenderLoading";
import { toastMessageSuccess } from "../../interfacesAndConstants/shared/constants/toastMessages.constants";

import AddPpSubmitDate from "../../components/ppSubmission/AddPpSubmitDate";
import { useCreatePpSubmissionDateMutation } from "../../redux/features/ppSubmission/ppSubmissionDateApi";
import InfoOutlineIcon from "@rsuite/icons/InfoOutline";
import { isBefore, isToday } from "date-fns";

interface IFormInput {
  styleNo: string | null;
  factorySubmissionDate: string | undefined;
}

const AddPpSubmission = () => {
  // Fetching All Style
  const { data: styles, isLoading: isLoadingStyleNo } =
    useGetStyleNoQuery(null);

  const [
    createPpSubmissionDate,
    { isLoading, isError, isSuccess, data, error, reset: resetCreate },
  ] = useCreatePpSubmissionDateMutation();

  const allStyle = styles?.data?.map((style: any) => ({
    label: style?.styleNo,
    value: style?.styleNo,
  }));

  const isDateBeforeToday = (date: Date) =>
    isBefore(date, new Date()) && !isToday(date);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    const ppSubmissionData = {
      styleNo: data.styleNo,
      factorySubmissionDate: data.factorySubmissionDate,
    };
    await createPpSubmissionDate(ppSubmissionData);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!isError && !isLoading && isSuccess && data) {
      toast.success(
        data?.message || "Successfully added pp submission date.",
        toastMessageSuccess
      );
      reset();
      resetCreate();
      setValue("factorySubmissionDate", undefined);
      setValue("styleNo", null);
    }
    if (isError && !isLoading) {
      // @ts-ignore
      toast.error(error?.message || "Already added pp submission Date", {
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
  }, [
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    navigate,
    reset,
    resetCreate,
    setValue,
  ]);

  return (
    <>
      <div className="p-4">
        <div className="">
          <div>
            <h2 className="text-2xl text-[#212B36] font-semibold">
              PP Submission Date For Factory:
            </h2>
          </div>
        </div>

        {/* form */}
        <section className="mt-5 bg-white border rounded-lg p-5 mb-10">
          <div className="mb-6">
            {/* <p className="text-lg font-semibold">PO Details</p> */}
            <p>Please provide submission date:</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 1st section */}
            <div className="flex justify-between  gap-[24px] mb-5">
              {/* Style No */}
              <div className="flex flex-col gap-3 w-full ">
                <div>
                  <Whisper speaker={<Tooltip>Style No</Tooltip>}>
                    <label htmlFor="styleNo" className="text-sm font-medium">
                      Style No <InfoOutlineIcon />
                    </label>
                  </Whisper>
                </div>
                <Controller
                  name="styleNo"
                  control={control}
                  defaultValue={""}
                  rules={{ required: "Style No is required" }}
                  render={({ field }) => (
                    <div className="rs-form-control-wrapper">
                      <SelectPicker
                        size="lg"
                        data={allStyle || []}
                        value={field.value}
                        placement="bottom"
                        placeholder="Select Style No"
                        onChange={(value: string | null) =>
                          field.onChange(value)
                        }
                        style={{
                          width: "100%",
                        }}
                        renderMenu={(menu) =>
                          renderLoading(menu, isLoadingStyleNo)
                        }
                      />
                      <Form.ErrorMessage
                        show={
                          (!!errors?.styleNo && !!errors?.styleNo?.message) ||
                          false
                        }
                        placement="topEnd"
                      >
                        {errors?.styleNo?.message}
                      </Form.ErrorMessage>
                    </div>
                  )}
                />{" "}
              </div>
              {/* Factory Submission Date  */}

              <div className="flex flex-col gap-3 w-full ">
                <div>
                  <Whisper
                    speaker={<Tooltip> Factory Submission Date </Tooltip>}
                  >
                    <label
                      htmlFor="factorySubmissionDate"
                      className="text-sm font-medium"
                    >
                      Factory Submission Date <InfoOutlineIcon />
                    </label>
                  </Whisper>
                </div>

                <Controller
                  name="factorySubmissionDate"
                  control={control}
                  rules={{ required: "Factory Submission Date is required" }}
                  render={({ field }) => (
                    <div className="rs-form-control-wrapper">
                      <DatePicker
                        id="factorySubmissionDate"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(value: Date | null): void => {
                          if (value) {
                            const isoString = value.toISOString();
                            field.onChange(isoString);
                          } else {
                            field.onChange(null);
                          }
                        }}
                        style={{
                          width: "100%",
                        }}
                        shouldDisableDate={(date) => isDateBeforeToday(date)}
                        size="lg"
                        placeholder="Select pp Submission  Date"
                        editable={false}
                        placement="bottom"
                      />
                      <Form.ErrorMessage
                        show={
                          !!errors?.factorySubmissionDate &&
                          !!errors?.factorySubmissionDate?.message
                        }
                        placement="topEnd"
                      >
                        {errors?.factorySubmissionDate?.message}
                      </Form.ErrorMessage>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                className={`bg-[#0284c7] hover:bg-[#0284c7] focus:bg-[#0284c7] hover:text-white/80 focus:text-white text-white rounded-md  items-center   flex px-5 py-2 text-sm `}
              >
                PP Submission
              </Button>
            </div>
          </form>
        </section>
      </div>
      <div className="p-4 mb-20">
        {/* form */}
        <AddPpSubmitDate
          allStyle={allStyle}
          isLoadingStyleNo={isLoadingStyleNo}
        />
      </div>
    </>
  );
};

export default AddPpSubmission;