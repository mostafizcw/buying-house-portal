import { Profile, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IUpdateProfileReqAndResponse, IUserUpdateReqAndResponse, IUsersResponse } from './user.interface';

// ! getting all users ----------------------------------------------------------------------->>>
const getAllUserService = async (options: IPaginationOptions): Promise<IGenericResponse<IUsersResponse[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const result = await prisma.user.findMany({
    where: {
      profile: {
        role: {
          in: ['ADMIN', 'USER'],
        },
      },
    },
    skip,
    take: limit,
    select: {
      userId: true,
      email: true,
      userStatus: true,
      profile: {
        select: {
          profileId: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              Orders: true,
              Styles: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count();

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ! getting single user data -------------------------------------------------------->>>
const getSingleUser = async (userId: string): Promise<IUsersResponse | null> => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      email: true,
      userStatus: true,
      profile: {
        select: {
          profileId: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          Orders: true,
          Styles: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  return result;
};

// ! update Profile info -------------------------------------------------------->>>
const updateProfileInfo = async (
  profileId: string,
  payload: IUpdateProfileReqAndResponse
): Promise<{
  message: string;
  updatedInfo: IUpdateProfileReqAndResponse;
}> => {
  // Ensure ProfileId cannot be changed
  if ('profileId' in payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Profile ID cannot be changed`);
  }

  // Check if the user exists
  const existingUser = await prisma.profile.findUnique({
    where: {
      profileId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not Found !!');
  }

  // Update the Profile
  const result = await prisma.profile.update({
    where: {
      profileId,
    },
    data: {
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      profileImage: payload?.profileImage,
      role: payload?.role,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile Update Failed');
  }

  return {
    message: 'Profile Information Updated Successful',
    updatedInfo: payload,
  };
};

// ! update user info -------------------------------------------------------->>>
const updateUserInfo = async (
  userId: string,
  payload: IUserUpdateReqAndResponse
): Promise<{
  message: string;
  updatedInfo: IUserUpdateReqAndResponse;
}> => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  const { password, email, userStatus, firstName, lastName, role, profileId } = payload;

  const updatedData: Partial<User> = {};

  // If a new password is provided, hash and include it in the update
  if (password) {
    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    updatedData['password'] = hashPassword;
  }

  if (userStatus) updatedData['userStatus'] = userStatus;

  if (email) updatedData['email'] = email;

  //  update the user Information

  const result = await prisma.user.update({
    where: {
      userId,
    },
    data: updatedData,
  });
  const updatedProfileData: Partial<Profile> = {};
  if (firstName) updatedProfileData['firstName'] = firstName;
  if (lastName) updatedProfileData['lastName'] = lastName;
  if (role) updatedProfileData['role'] = role;

  if (updatedProfileData && profileId) {
    const updateProfile = await prisma.profile.update({
      where: {
        profileId,
      },
      data: updatedProfileData,
    });
    if (!updateProfile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Update Failed');
    }
  }

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Update Failed');
  }

  return {
    message: 'User Information Updated Successful',
    updatedInfo: {
      email: email,
      password: password,
      userStatus: userStatus,
      firstName,
      lastName,
      role,
    },
  };
};

//! get my profile ----------------------------------------------------------------------->>>
const getMyProfile = async (userId: string): Promise<IUsersResponse | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      email: true,
      userStatus: true,
      profile: {
        select: {
          profileId: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          Orders: true,
          Styles: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  return result;
};

// ! --------------- exports all user service
export const UserService = {
  getAllUserService,
  getSingleUser,
  updateProfileInfo,
  updateUserInfo,
  getMyProfile,
};
