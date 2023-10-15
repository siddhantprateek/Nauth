import { Request, Response } from "express";
import { Prisma } from "@prisma/client"; // Import Prisma
import { prisma } from "../config/postgres/postgres";

// Get All Users
// @params: 
// @method: GET
// @route: /api/users
const GetAllUser = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // Get the requested page number (default to 1)
  const pageSize = parseInt(req.query.pageSize as string) || 10; // Get the page size (default to 10)
  const sortBy = (req.query.sortBy as string) || "id"; // Get the sorting field (default to 'id')
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc"; // Get the sorting order (default to 'asc')

  // Define valid sorting fields
  const validSortFields: Record<
    string,
    keyof Prisma.userOrderByWithRelationInput
  > = {
    id: "id",
    name: "name",
    email: "email",
  };

  try {
    const orderBy: Prisma.userOrderByWithRelationInput = {};
    if (validSortFields[sortBy]) {
      orderBy[validSortFields[sortBy]] = sortOrder;
    } else {

      orderBy.id = sortOrder;
    }
    const skip = (page - 1) * pageSize;

    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy,
    });
    const totalCount = await prisma.user.count();

    res.status(200).json({
      message: "Users retrieved successfully",
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalItems: totalCount,
      },
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default GetAllUser;
