import { useEffect, useState } from "react";
import { getCategories } from "../services/auth";
import { Link } from "react-router-dom";

const CategoryButtons = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <section className="category-buttons">
      <div className="container category-buttons-container">
        {/* {loading && <Loader />} */}
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category-posts/${category.name}`}
            className="category-button"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryButtons;
