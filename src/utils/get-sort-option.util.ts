export const getSortOption = (sortBy: string, order?: string) => {
  const allowedSortFields = ["createdAt", "updatedAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortOption: Record<string, 1 | -1> = {
    [sortField]: order === "asc" ? 1 : -1,
  };

  return sortOption;
};
