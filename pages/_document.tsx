import Document, {
  Head as NextHead,
  Html,
  Main,
  NextScript,
} from "next/document";
import { createGetInitialProps } from "@mantine/next";

class MyDocument extends Document {
  static getInitialProps = createGetInitialProps();

  render() {
    return (
      <Html lang="zh-CN">
        <NextHead>
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
