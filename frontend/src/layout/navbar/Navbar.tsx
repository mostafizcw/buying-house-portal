/* eslint-disable @typescript-eslint/no-explicit-any */

import { GoBell } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserInfo, removeUserInfo } from "../../hooks/services/auth.service";
import { getAuthKey, fileUrlKey } from "../../config/envConfig";
import { Dropdown, IconButton } from "rsuite";
import AdminIcon from "@rsuite/icons/Admin";
import OffIcon from "@rsuite/icons/Off";
import PlusIcon from "@rsuite/icons/Plus";
import ListIcon from "@rsuite/icons/List";
import { MdOutlineFactory } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
const Navbar = () => {
  const navigate = useNavigate();

  const logOut = () => {
    removeUserInfo(getAuthKey());
    navigate("/login");
  };

  const user = getUserInfo() as any;

  const renderIconButton = (props: any, ref: any) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={
          <img
            className="h-8 w-8  object-contain  rounded-full "
            src={`${fileUrlKey()}/${user?.profileImage}`}
            alt=""
          />
        }
        circle
        size="xs"
        className="border-2 border-[#2222223b] hover:!border-[#22222281] hover:ring-0"
        appearance="ghost"
      />
    );
  };
  const renderPlusIconButton = (props: any, ref: any) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={<PlusIcon />}
        circle
        color="blue"
        appearance="primary"
      />
    );
  };
  return (
    <>
      <div className="flex z-50 flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between py-3 border-b h-[60px] shadow-sm bg-white sticky top-0 items-center">
        <div className="pl-5">
          <h2 className="font-semibold">
            Welcome back, {user?.firstName} {user?.lastName} 👋
          </h2>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6 pr-6">
          <div>
            <Dropdown renderToggle={renderPlusIconButton} placement="bottomEnd">
              <Dropdown.Item
                icon={<IoShirtOutline />}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500"
                as={NavLink}
                to="/styles/addstyle"
              >
                New style
              </Dropdown.Item>
              <Dropdown.Item
                icon={<MdOutlineFactory />}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500"
                as={NavLink}
                to="/styles/styleAssign"
              >
                New style assign
              </Dropdown.Item>
              <hr />
              <Dropdown.Item
                icon={<ListIcon />}
                className="flex items-center gap-[3px] hover:bg-blue-50 hover:text-blue-500"
                as={NavLink}
                to="/po/poLists"
              >
                New Po
              </Dropdown.Item>
              <hr />
              <Dropdown.Item
                as={NavLink}
                to="/LdCpAopStatus"
                className="flex items-center gap-[3px] hover:bg-blue-50 hover:text-blue-500"
              >
                New LD/CP/AOP strike off status
              </Dropdown.Item>
              <Dropdown.Item
                as={NavLink}
                to="/ppStatus"
                className="flex items-center gap-[3px] hover:bg-blue-50 hover:text-blue-500"
              >
                New PP status
              </Dropdown.Item>
              <Dropdown.Item
                as={NavLink}
                to="/bulkProductionStatus"
                className="flex items-center gap-[3px] hover:bg-blue-50 hover:text-blue-500"
              >
                Bulk production status
              </Dropdown.Item>

              <hr />
              <Dropdown.Item
                icon={<FaRegPaperPlane />}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500"
                as={NavLink}
                to="/courier/addcourier"
              >
                New courier
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <GoBell size={24} aria-hidden="true" />
            </button>
          </div>
          {/* Profile dropdown */}
          <div>
            <Dropdown placement="bottomEnd" renderToggle={renderIconButton}>
              <Dropdown.Item icon={<AdminIcon />}>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={logOut} icon={<OffIcon />}>
                Log Out
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
