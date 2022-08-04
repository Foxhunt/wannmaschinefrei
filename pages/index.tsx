import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Maschine } from '../components/Maschine';
import clientPromise from '../lib/mongodb';

interface props {
  maschinen: Maschine[]
}

const Home: NextPage<props> = ({ maschinen }) => {
  const maschinenB = maschinen?.filter(maschine =>
    maschine.gebaeude == "b"
  )

  const maschinenD = maschinen?.filter(maschine =>
    maschine.gebaeude == "d"
  )

  return (
    <>
      <Head>
        <title>Wann Maschine frei?</title>
      </Head>
      {maschinenB.length > 0 && <div className="p-3">Gebäude B</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
        {
          maschinenB?.map(maschine =>
            <Maschine key={maschine.nummer} {...maschine} />
          )
        }
      </div>
      {maschinenD.length > 0 && <div className="p-3">Gebäude D</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
        {
          maschinenD?.map(maschine =>
            <Maschine key={maschine.nummer} {...maschine} />
          )
        }
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const collection = client.db("wannmaschinefrei").collection("maschinen2");

  const agg = [
    {
      '$sort': {
        'start': -1
      }
    }, {
      '$addFields': {
        'nummerAsString': {
          '$toString': '$nummer'
        }
      }
    }, {
      '$group': {
        '_id': {
          '$concat': [
            '$gebaeude', '$nummerAsString'
          ]
        },
        'nummer': {
          '$first': '$nummer'
        },
        'start': {
          '$first': '$start'
        },
        'dauer': {
          '$first': '$dauer'
        },
        'gebaeude': {
          '$first': '$gebaeude'
        }
      }
    }, {
      '$sort': {
        'nummer': 1
      }
    }
  ]

  const maschinen = await collection.aggregate(agg).toArray()

  return {
    props: {
      maschinen
    },
    revalidate: 1
  }
}

export default Home
