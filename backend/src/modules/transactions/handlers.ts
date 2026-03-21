export const get = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: 1,
      amount: 100,
      description: "Grocery shopping",
      date: "2024-06-01",
    }),
  };
};

export const getAll = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: 1,
        amount: 100,
        description: "Grocery shopping",
        date: "2024-06-01",
      },
      {
        id: 2,
        amount: 50,
        description: "Restaurant",
        date: "2024-06-02",
      },
    ]),
  };
};
