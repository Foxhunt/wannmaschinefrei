import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Maschine } from '../components/Maschine';
import clientPromise from '../lib/mongodb';

interface props {
  maschinen: Maschine[]
}

const Home: NextPage<props> = ({ maschinen }) => {
  return (
    <>
      <Head>
        <title>Wann Maschine frei?</title>
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
        {
          maschinen?.map(maschine =>
            <Maschine key={maschine.nummer} {...maschine} />
          )
        }
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const collection = client.db("wannmaschinefrei").collection("maschinen");

  const maschinen = await collection.find({}, {
    sort: {
      _id: 1
    },
    projection: {
      _id: 0,
      nummer: "$_id",
      start: 1,
      dauer: 1
    }
  }).toArray()

  console.log(maschinen)

  return {
    props: {
      maschinen
    },
    revalidate: 60
  }
}

export default Home
