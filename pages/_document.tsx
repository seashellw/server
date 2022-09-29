import { getInitColorSchemeScript } from "@mui/joy/styles";
import Document, {
  DocumentContext,
  Head as NextHead,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html lang="zh-CN">
        <NextHead>
          {getInitColorSchemeScript()}
          <link
            href="https://blog-1259243245.cos-website.ap-beijing.myqcloud.com/STATIC_RESOURCES/favicon.ico"
            rel="icon"
          />
        </NextHead>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
