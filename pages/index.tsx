import {
  BlocksControls,
  InlineBlocks,
  InlineForm,
  InlineImage,
} from "react-tinacms-inline";
import { useForm, usePlugin } from "tinacms";

import Head from "next/head";
import Header from "../components/header";
import HeroPost from "../components/hero-post";
import MoreStories from "../components/more-stories";
import { STRAPI_URL } from "../components/tina-strapi/tina-strapi-client";
import { fetchGraphql } from "../lib/api";
import get from "lodash.get";

export function Image(props) {
  return (
    <BlocksControls index={props.index}>
      <InlineImage
        name="coverImage.url"
        previewSrc={(formValues) => {
          return STRAPI_URL + get(formValues, "coverImage.url");
        }}
        uploadDir={() => {
          return `/uploads/`;
        }}
        parse={(filename) => {
          return `/uploads/${filename}`;
        }}
      >
        {() => {
          return <img src={STRAPI_URL + props.data.coverImage.url} />;
        }}
      </InlineImage>
    </BlocksControls>
  );
}

export const image_template = {
  label: "Image",
  type: "image",
  key: "image-block",
  defaultItem: {
    coverImage: { url: "" },
    _template: "image",
  },
  fields: [],
};

const PAGE_BLOCKS = {
  image: {
    Component: Image,
    template: image_template,
  },
};

export default function Home({ allPosts, blocks: initialBlocks }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  const formConfig = {
    id: "index",
    label: "index",
    initialValues: initialBlocks,
    onSubmit: () => {
      alert("nice");
    },
    fields: [],
  };

  const [blocks, form] = useForm(formConfig);
  usePlugin(form);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </Header>
        <InlineForm form={form}>
          <InlineBlocks name="blocks" blocks={PAGE_BLOCKS} />
        </InlineForm>
        {heroPost && (
          <HeroPost
            date={heroPost.date}
            slug={heroPost.slug}
            author={heroPost.author}
            excerpt={heroPost.summary}
            title={heroPost.title}
          />
        )}

        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await fetchGraphql(`
  query {
    blogPosts {
      title
      summary
      date
      slug
      author {
        fullName
      }
    }
    pageBySlug(name:"index"){
      blocks
    }
  }`);

  console.log(JSON.stringify(pageData.data.pageBySlug.blocks));
  if (preview) {
    return {
      props: {
        allPosts: pageData.data.blogPosts,
        blocks: pageData.data.pageBySlug.blocks,
        preview,
        ...previewData,
      },
    };
  }

  return {
    props: {
      preview: false,
      allPosts: pageData.data.blogPosts,
      blocks: pageData.data.pageBySlug.blocks,
    },
  };
}
