import { LoginUsertype } from "@/app/types";
import { client } from "../../sanity/lib/client";

export const SingleBlog = async (productName: any) => {
  // Encode the product name to handle special characters
  const encodedProductName = encodeURIComponent(productName);

  // Modify the query to search for the specific product name
  const query = `*[_type == 'product' && name match '${encodedProductName}*']{
    name,
    price
  }`;

  const res = await client.fetch(query);
  return res;
};

export const LoginDB = async (credent: LoginUsertype) => {
  try {
    const response = await fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credent.email, // Replace with the actual email value
        password: credent.password, // Replace with the actual password value
      }),
    });
    return response;
  } catch (error: any) {
    console.log("error in data.ts api ", error.message);
  }
};
