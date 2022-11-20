// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const NEXT_PUBLIC_MONGODB_COLLECTION_NAME =
  process.env.NEXT_PUBLIC_MONGODB_COLLECTION_NAME;

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

  const { nummer, start, dauer, gebaeude, voll, typ } = JSON.parse(req.body);

  const client = await clientPromise;

  const collection = client.db("wannmaschinefrei").collection(
    NEXT_PUBLIC_MONGODB_COLLECTION_NAME!,
  );

  collection.insertOne({
    nummer,
    start,
    dauer,
    gebaeude,
    voll,
    typ,
  });

  res.end();
}
