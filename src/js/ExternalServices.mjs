const baseURL = import.meta.env.VITE_SERVER_URL;

<<<<<<< HEAD
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
=======
function convertToJson(res) {
  const body = res.json();
  if (res.ok) {
    return body;
  } else {
    return body.then((err) => {
      throw {name: "servicesError", message: err || "An error occurred while fetching data"};
    });
>>>>>>> bd2f10acbacaf6a476c437660aeddab22043fbfd
  }
}

export default class ExternalServices {
  constructor() {
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async getProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    return await this.getProductById(id);
  }

  async checkout(orderDetails) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderDetails)
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}