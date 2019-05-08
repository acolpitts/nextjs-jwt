import Document, { Head, Main, NextScript } from 'next/document';
import { getServerSideToken, getUserScript } from "../lib/auth";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const props = await Document.getInitialProps(ctx);
    const userData = await getServerSideToken(ctx.req);

    return { ...props, ...userData };
  }

  render() {
    const { user = {} } = this.props;

    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: getUserScript(user)}} />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument;
