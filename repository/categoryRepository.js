const Category = require("../model/Category");

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const findCategoryByNameAndParent = async (name, parent_id) => {
  return await Category.findOne({
    where: {
      name,
      parent_id: parent_id || null,
    },
  });
};

const getAllCategoriesTree = async () => {
  return await Category.findAll({
    where: { parent_id: null },
    include: [
      {
        model: Category,
        as: "subcategories",
        include: [
          {
            model: Category,
            as: "subcategories",
          },
        ],
      },
    ],
  });
};

const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

const updateCategory = async (id, updateData) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  return await category.update(updateData);
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return false;
  await category.destroy();
  return true;
};

module.exports = {
  createCategory,
  findCategoryByNameAndParent,
  getAllCategoriesTree,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
