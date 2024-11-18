import ProductItem from "@/components/products/ProductItem";
import { Rating } from "@/components/products/Rating";
import { Product } from "@/lib/models/ProductModel";
import productServices from "@/lib/services/productService";
import Link from "next/link";
import React from "react";

const sortOrders = ["newest", "lowest", "highest", "rating"];
const prices = [
  { name: "₦1000 to ₦100000", value: "1000-100000" },
  { name: "₦101000 to ₦1000000", value: "101000-1000000" },
  { name: "₦1000000 to ₦20000000", value: "1000000-20000000" },
];
const ratings = [5, 4, 3, 2, 1];

export default async function SearchPage({
  searchParams: {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = JSON.parse(
    JSON.stringify(await productServices.getCategories())
  );
  const { countProducts, products, pages } = JSON.parse(
    JSON.stringify(
      await productServices.getByQuery({
        category,
        q,
        price,
        rating,
        page,
        sort,
      })
    )
  );

  return (
    <div className="grid md:grid-cols-5 gap-5">
      <div className="p-4 md:col-span-1 bg-base-100 rounded-md">
        {/* Department Filter */}
        <div tabIndex={0} className="collapse collapse-arrow mb-4">
          <input type="checkbox" />
          <div className="collapse-title btn text-lg font-semibold">
            Department
          </div>
          <div className="collapse-content">
            <ul className="space-y-2">
              <li>
                <Link
                  className={`link ${"all" === category ? "link-primary" : ""}`}
                  href={getFilterUrl({ c: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c: string) => (
                <li key={c}>
                  <Link
                    className={`link ${c === category ? "link-primary" : ""}`}
                    href={getFilterUrl({ c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Price Filter */}
        <div tabIndex={0} className="collapse collapse-arrow mb-4">
          <input type="checkbox" />
          <div className="collapse-title btn text-lg font-semibold">Price</div>
          <div className="collapse-content">
            <ul className="space-y-2">
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={`link ${
                      p.value === price ? "link-primary" : ""
                    }`}
                    href={getFilterUrl({ p: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Customer Review Filter */}
        <div tabIndex={0} className="collapse collapse-arrow mb-4">
          <input type="checkbox" />
          <div className="collapse-title btn text-lg font-semibold">
            Customer Review
          </div>
          <div className="collapse-content">
            <ul className="space-y-2">
              {ratings.map((r) => (
                <li key={r}>
                  <Link
                    className={`link ${
                      `${r}` === rating ? "link-primary" : ""
                    }`}
                    href={getFilterUrl({ r: `${r}` })}
                  >
                    <Rating caption=" & up" value={r} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="md:col-span-4 p-4 bg-base-100 rounded-lg shadow-md">
        {/* Results Info and Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-300 mb-4">
          {/* Results Info */}
          <div className="text-sm md:text-base text-center sm:text-left mb-4 sm:mb-0">
            <span className="font-semibold">
              {products.length === 0 ? "No" : countProducts} Results
            </span>
            {q !== "all" && ` : ${q}`}
            {category !== "all" && ` : ${category}`}
            {price !== "all" && ` : Price ${price}`}
            {rating !== "all" && ` : Rating ${rating} & up`}
            {(q !== "all" ||
              category !== "all" ||
              price !== "all" ||
              rating !== "all") && (
              <Link href="/search" className="btn btn-xs btn-ghost ml-2">
                Clear
              </Link>
            )}
          </div>

          {/* Sort By */}
          <div
            tabIndex={0}
            className="collapse collapse-arrow w-full sm:w-auto"
          >
            <input type="checkbox" />
            <div className="collapse-title btn w-full sm:w-auto">
              Sort by: {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </div>
            <div className="collapse-content w-full sm:w-auto bg-base-100 rounded-md shadow-md">
              <ul className="menu p-2 space-y-1 text-sm">
                {sortOrders.map((s) => (
                  <li key={s} className="flex justify-center">
                    <Link
                      href={getFilterUrl({ s })}
                      className={`link ${
                        sort === s ? "link-primary font-semibold" : ""
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: Product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="join flex justify-center mt-6">
            {Array.from(Array(pages).keys()).map((p) => (
              <Link
                key={p}
                className={`join-item btn ${
                  Number(page) === p + 1 ? "btn-active" : ""
                }`}
                href={getFilterUrl({ pg: `${p + 1}` })}
              >
                {p + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
