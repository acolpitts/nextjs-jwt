import Link from 'next/link';
import Layout from "../components/Layout";
import { authInitialProps } from "../lib/auth";

const Index = (props) => {
  return (
    <Layout title="Public Landing Page" {...props}>
      <Link href="/profile"><a>Go to profile</a></Link>
    </Layout>
  )
};

Index.getInitialProps = authInitialProps();

export default Index;