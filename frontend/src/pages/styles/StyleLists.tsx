/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { SelectPicker, DateRangePicker, Pagination } from "rsuite";
import { useState } from "react";
import { useGetAllFactoryNamesQuery } from "../../redux/features/factories/factoryApi";
import { useGetAllItemNamesQuery } from "../../redux/features/items/itemApi";
import { renderLoading } from "../../components/renderLoading/RenderLoading";
import { useGetStylesQuery } from "../../redux/features/styles/styleApi";
import { BiSearchAlt } from "react-icons/bi";
import StyleListsTable from "../../components/styles/StyleListsTable";
import { predefinedRanges } from "../../constants";
import { useDebounced } from "../../redux/hook";

const StyleLists = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFactory, setSelectedFactory] = useState<string | undefined>(
    undefined
  );
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState({
    startDate: "",
    endDate: "",
  });
  //
  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  // query["searchTerm"] = searchTerm;
  query["factoryId"] = selectedFactory;
  query["itemId"] = selectedItem;
  query["startDate"] = selectedDate.startDate;
  query["endDate"] = selectedDate.endDate;
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const {
    data: allStylesList,
    isLoading,
    isFetching,
    isError,
  } = useGetStylesQuery({ ...query });

  const { data: allFactoryResponse, isLoading: isLoadingFactoryNames } =
    useGetAllFactoryNamesQuery(null);
  const { data: allItemResponse, isLoading: isLoadingItemNames } =
    useGetAllItemNamesQuery(null);

  const allFactoryNames = allFactoryResponse?.data?.map((style: any) => ({
    label: style?.factoryName,
    value: style?.factoryId,
  }));
  const allItemName = allItemResponse?.data?.map((style: any) => ({
    label: style?.itemName,
    value: style?.itemId,
  }));

  const handleFilterDate = (date: Date[] | null) => {
    if (!date?.length) {
      setSelectedDate({
        startDate: "",
        endDate: "",
      });
    }

    if (date) {
      const startDate = new Date(date[0]);
      const endDate = new Date(date[1]);

      // Set the start time to 00:00:00 (12:00 AM)
      startDate.setHours(0, 0, 0, 0);

      // Set the end time to 23:59:59 (11:59 PM)
      endDate.setHours(23, 59, 59, 999);

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      if (startDate !== null && endDate !== null) {
        setSelectedDate({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      }
    }
  };

  return (
    <div className="px-5 py-4  ">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-semibold text-[#212B36]">
            List Of Styles
          </h2>
        </div>
        <div className="flex gap-4">
          <Link to="/styles/addstyle">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-[4px] text-white  bg-[#0284c7]"
              type="button"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="#fff"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold">Add New Style</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-4 shadow-lg mb-20 shadow-[#eff1f3] border rounded-lg">
        <div className="p-5 ">
          {/* search and filter */}
          <div className="flex justify-between gap-4">
            <div className="w-[35%]">
              <label htmlFor="voice-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <BiSearchAlt size="1.6em" color="#91a0b0" />
                </div>
                <input
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  type="text"
                  id="voice-search"
                  className="border border-gray-300 text-gray-900 placeholder:text-[#919EAB]   w-full pl-10 p-2.5 py-2 rounded-lg focus:outline-none"
                  placeholder="Search with Style No..."
                  required
                />
              </div>
            </div>
            <SelectPicker
              size="lg"
              data={allFactoryNames}
              onChange={(value: string | null): void =>
                setSelectedFactory(value as string)
              }
              onClean={() => setSelectedFactory(undefined)}
              style={{ width: "20%" }}
              searchable={false}
              placeholder="Filter By Factory"
              renderMenu={(menu) => renderLoading(menu, isLoadingFactoryNames)}
            />
            <SelectPicker
              size="lg"
              data={allItemName}
              onChange={(value: string | null): void =>
                setSelectedItem(value as string)
              }
              onClean={() => setSelectedItem(undefined)}
              style={{ width: "20%" }}
              searchable={false}
              placeholder="Filter By Item"
              renderMenu={(menu) => renderLoading(menu, isLoadingItemNames)}
            />
            <DateRangePicker
              // @ts-ignore
              ranges={predefinedRanges}
              placement="auto"
              onChange={(value: Date[] | null): void => {
                handleFilterDate(value);
              }}
              size="lg"
              style={{ width: "25%" }}
              placeholder="Filter By Date"
            />
          </div>
        </div>

        {/* main section for table */}
        <div>
          <StyleListsTable
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setSortBy={setSortBy}
            allStylesList={allStylesList}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
          />

          <div style={{ padding: 20 }}>
            <Pagination
              total={allStylesList?.meta?.total}
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="lg"
              layout={["total", "-", "limit", "|", "pager", "skip"]}
              limitOptions={[10, 20, 30, 50, 100, 150, 200]}
              limit={size}
              onChangeLimit={(limitChange) => setSize(limitChange)}
              activePage={page}
              onChangePage={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleLists;
