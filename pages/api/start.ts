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

  const { nummer, start, dauer, gebaeude } = JSON.parse(req.body);

  const client = await clientPromise;

  const collection = client.db("wannmaschinefrei").collection("maschinen2");

  collection.insertOne({
    nummer,
    start,
    dauer,
    gebaeude,
  });

  res.end();
}
