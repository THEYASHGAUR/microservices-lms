import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>LMS - Learning Management System</title>
        <meta name="description" content="Full-stack LMS built with microservices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Welcome to LMS
          </h1>
          <p className="text-center text-gray-600">
            Learning Management System built with microservices architecture
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
