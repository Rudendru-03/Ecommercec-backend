const categoryRepository = require("../repository/categoryRepository");

// Helper function to generate slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.getAllCategoriesTree();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, parent_id, description, image_url, is_active } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const slug = generateSlug(name);
    
    const newCategory = await categoryRepository.createCategory({
      name,
      slug,
      parent_id: parent_id || null,
      description,
      image_url,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    const updatedCategory = await categoryRepository.updateCategory(id, updateData);
    
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await categoryRepository.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.seedInitialCategories = async (req, res) => {
  try {
    // 1. Root categories
    const roots = ['Men', 'Women', 'Child'];
    const createdRoots = {};
    
    for (const root of roots) {
      let cat = await categoryRepository.findCategoryByNameAndParent(root, null);
      if (!cat) {
        cat = await categoryRepository.createCategory({
          name: root,
          slug: generateSlug(root),
          parent_id: null
        });
      }
      createdRoots[root] = cat;
    }

    // 2. Men's Subcategories (Top wear, Bottom wear)
    const mensSubcats = ['Top wear', 'Bottom wear'];
    const createdMensSubcats = {};
    
    for (const sub of mensSubcats) {
      let cat = await categoryRepository.findCategoryByNameAndParent(sub, createdRoots['Men'].id);
      if (!cat) {
        cat = await categoryRepository.createCategory({
          name: sub,
          slug: generateSlug(`men-${sub}`), // Prefix slug to avoid collisions
          parent_id: createdRoots['Men'].id
        });
      }
      createdMensSubcats[sub] = cat;
    }

    // 3. Specific Clothing Items for Top wear
    const topWearItems = ['tshirt', 'casual shirt', 'formal shirt', 'jacket', 'suit', 'blazer', 'rain jacket'];
    for (const item of topWearItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdMensSubcats['Top wear'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`men-topwear-${item}`),
          parent_id: createdMensSubcats['Top wear'].id
        });
      }
    }

    // 4. Specific Clothing Items for Bottom wear
    const bottomWearItems = ['jeans', 'shorts', 'formal trouser', 'track pant', 'joggers'];
    for (const item of bottomWearItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdMensSubcats['Bottom wear'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`men-bottomwear-${item}`),
          parent_id: createdMensSubcats['Bottom wear'].id
        });
      }
    }

    // 5. Women's Subcategories
    const womensSubcats = ['Indian & Fusion Wear', 'Western Wear'];
    const createdWomensSubcats = {};
    
    for (const sub of womensSubcats) {
      let cat = await categoryRepository.findCategoryByNameAndParent(sub, createdRoots['Women'].id);
      if (!cat) {
        cat = await categoryRepository.createCategory({
          name: sub,
          slug: generateSlug(`women-${sub}`),
          parent_id: createdRoots['Women'].id
        });
      }
      createdWomensSubcats[sub] = cat;
    }

    // 6. Indian & Fusion Wear Items
    const indianFusionWearItems = [
      'Kurtas & Suits',
      'Kurtis, Tunics & Tops',
      'Sarees',
      'Ethnic Wear',
      'Leggings, Salwars & Churidars',
      'Skirts & Palazzos',
      'Dress Materials',
      'Lehenga Cholis',
      'Dupattas & Shawls',
      'Jackets'
    ];
    for (const item of indianFusionWearItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdWomensSubcats['Indian & Fusion Wear'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`women-indian-fusion-${item}`),
          parent_id: createdWomensSubcats['Indian & Fusion Wear'].id
        });
      }
    }

    // 7. Western Wear Items
    const westernWearItems = [
      'Dresses',
      'Tops',
      'Tshirts',
      'Jeans',
      'Trousers & Capris',
      'Shorts & Skirts',
      'Co-ords',
      'Playsuits',
      'Jumpsuits',
      'Shrugs',
      'Sweaters & Sweatshirts',
      'Jackets & Coats'
    ];
    for (const item of westernWearItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdWomensSubcats['Western Wear'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`women-western-${item}`),
          parent_id: createdWomensSubcats['Western Wear'].id
        });
      }
    }

    // 8. Child's Subcategories
    const childsSubcats = ['Boys Clothing', 'Girls Clothing'];
    const createdChildsSubcats = {};
    
    for (const sub of childsSubcats) {
      let cat = await categoryRepository.findCategoryByNameAndParent(sub, createdRoots['Child'].id);
      if (!cat) {
        cat = await categoryRepository.createCategory({
          name: sub,
          slug: generateSlug(`child-${sub}`),
          parent_id: createdRoots['Child'].id
        });
      }
      createdChildsSubcats[sub] = cat;
    }

    // 9. Boys Clothing Items
    const boysClothingItems = [
      'T-Shirts',
      'Shirts',
      'Shorts',
      'Jeans',
      'Trousers',
      'Clothing Sets',
      'Ethnic Wear',
      'Track Pants & Pyjamas',
      'Jacket, Sweater & Sweatshirts',
      'Party Wear',
      'Innerwear & Thermals',
      'Nightwear & Loungewear',
      'Value Packs'
    ];
    for (const item of boysClothingItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdChildsSubcats['Boys Clothing'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`child-boys-${item}`),
          parent_id: createdChildsSubcats['Boys Clothing'].id
        });
      }
    }

    // 10. Girls Clothing Items
    const girlsClothingItems = [
      'Dresses',
      'Tops',
      'Tshirts',
      'Clothing Sets',
      'Lehenga choli',
      'Kurta Sets',
      'Party wear',
      'Dungarees & Jumpsuits',
      'Skirts & shorts',
      'Tights & Leggings',
      'Jeans, Trousers & Capris',
      'Jacket, Sweater & Sweatshirts',
      'Innerwear & Thermals',
      'Nightwear & Loungewear',
      'Value Packs'
    ];
    for (const item of girlsClothingItems) {
      let cat = await categoryRepository.findCategoryByNameAndParent(item, createdChildsSubcats['Girls Clothing'].id);
      if (!cat) {
        await categoryRepository.createCategory({
          name: item,
          slug: generateSlug(`child-girls-${item}`),
          parent_id: createdChildsSubcats['Girls Clothing'].id
        });
      }
    }

    res.status(201).json({ success: true, message: "Initial categories seeded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
