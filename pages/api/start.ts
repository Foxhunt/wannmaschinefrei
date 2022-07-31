// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    res.end();
    return;
  }

  const { nummer, start, dauer } = JSON.parse(req.body);

  const client = await clientPromise;

  const collection = client.db("wannmaschinefrei").collection("maschinen");

  await collection.updateOne(
    { "_id": nummer },
    {
      $set: {
        start,
        dauer,
      },
    },
    { upsert: true },
  );

  console.dir(req.body);
  console.log(nummer, start, dauer);
  res.end();
}
