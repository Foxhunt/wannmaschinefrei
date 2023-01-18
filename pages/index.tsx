import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { Maschine } from "../components/Maschine";
import clientPromise from "../lib/mongodb";

const NEXT_PUBLIC_MONGODB_COLLECTION_NAME =
  process.env.NEXT_PUBLIC_MONGODB_COLLECTION_NAME;

interface props {
  maschinen: Maschine[];
}

const Home: NextPage<props> = ({ maschinen }) => {
  const maschinenB = maschinen?.filter((maschine) => maschine.gebaeude == "b");

  const maschinenD = maschinen?.filter((maschine) => maschine.gebaeude == "d");

  useEffect(() => {
    if (!localStorage.getItem("uid")) {
      const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
      localStorage.setItem("uid", uint32.toString(16));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Wann Maschine frei?</title>
      </Head>
      {maschinenB.length > 0 && <div className="p-3">Gebäude B</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
        {maschinenB?.map((maschine) => (
          <Maschine key={maschine.nummer} {...maschine} />
        ))}
      </div>
      {maschinenD.length > 0 && <div className="p-3">Gebäude D</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
        {maschinenD?.map((maschine) => (
          <Maschine key={maschine.nummer} {...maschine} />
        ))}
      </div>
      <div className="place-content-center">
        <a
          href="mailto:marco@mojica.de?subject=Feedback wannmaschinefrei"
          className="text-center text-gray-500 text-xs"
        >
          Fragen? Ideen? Schreib mir!
        </a>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise;
  const collection = client
    .db("wannmaschinefrei")
    .collection(NEXT_PUBLIC_MONGODB_COLLECTION_NAME!);

  const agg = [
    {
      $sort: {
        start: -1,
      },
    },
    {
      $addFields: {
        nummerAsString: {
          $toString: "$nummer",
        },
      },
    },
    {
      $group: {
        _id: {
          $concat: ["$gebaeude", "$nummerAsString"],
        },
        nummer: {
          $first: "$nummer",
        },
        start: {
          $first: "$start",
        },
        dauer: {
          $first: "$dauer",
        },
        gebaeude: {
          $first: "$gebaeude",
        },
        voll: {
          $first: "$voll",
        },
        typ: {
          $first: "$typ",
        },
      },
    },
    {
      $sort: {
        nummer: 1,
      },
    },
  ];

  const maschinen = await collection.aggregate(agg).toArray();

  return {
    props: {
      maschinen,
    },
  };
};

export default Home;
