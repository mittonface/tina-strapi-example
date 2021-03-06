import {
  BlocksControls,
  InlineBlocks,
  InlineForm,
  InlineImage,
  InlineText,
  InlineTextarea,
  useInlineForm,
} from "react-tinacms-inline";
import { useForm, usePlugin } from "tinacms";

import { Button } from "@tinacms/styles";
import Head from "next/head";
import Header from "../components/header";
import HeroPost from "../components/hero-post";
import MoreStories from "../components/more-stories";
import PostPreview from "../components/post-preview";
import { STRAPI_URL } from "../components/tina-strapi/tina-strapi-client";
import { fetchGraphql } from "../lib/api";
import get from "lodash.get";

export function Image(props) {
  return (
    <section>
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
    </section>
  );
}

export function Content(props) {
  return (
    <section>
      <BlocksControls index={props.index}>
        <InlineTextarea name="content" />
      </BlocksControls>
    </section>
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

export const content_template = {
  label: "Content",
  name: "content",
  key: "content-block",
  defaultItem: {
    content: "I'm a really cool block of content",
    _template: "textarea",
  },
  fields: [],
};

const PAGE_BLOCKS = {
  image: {
    Component: Image,
    template: image_template,
  },
  textarea: {
    Component: Content,
    template: content_template,
  },
};

export default function Home({ pageData }) {
  const formConfig = {
    id: "index",
    label: "index",
    initialValues: pageData,
    onSubmit: async (values) => {
      const saveMutation = `
      mutation UpdatePage($id: ID!, $pageTitle: String, $blocks: JSON) {
        updatePage(
          input: { where: { id: $id }, data: { pageTitle: $pageTitle, blocks: $blocks } }
        ) {
          page {
            id
          }
        }
      }
      `;
      const response = await fetchGraphql(saveMutation, {
        id: values.id,
        pageTitle: values.title,
        blocks: values.blocks,
      });
    },
    fields: [],
  };

  const [page, form] = useForm(formConfig);
  usePlugin(form);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <InlineForm form={form}>
          <Header>
            <InlineText name="pageTitle" />
          </Header>
          <InlineBlocks name="blocks.blocks" blocks={PAGE_BLOCKS} />
          <SaveButton />
        </InlineForm>
        <h3>Highlighted Posts</h3>
        {pageData.highlightedPosts &&
          pageData.highlightedPosts.map((post) => (
            <PostPreview
              date={post.date}
              slug={post.slug}
              author={post.author}
              excerpt={post.summary}
              title={post.title}
              coverImage=""
            ></PostPreview>
          ))}
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
          align-items: left;
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

export function SaveButton() {
  const { form } = useInlineForm();

  /*
   ** If there are no changes
   ** to save, return early
   */
  if (form.finalForm.getState().pristine) {
    return null;
  }

  return <Button onClick={form.submit}>Save</Button>;
}
export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await fetchGraphql(`
  query {
    pageBySlug(name:"index"){
      id
      pageTitle
      highlightedPosts {
        title
        summary
        slug
        author {
          fullName
        }
      }
      blocks
    }
  }`);

  if (preview) {
    return {
      props: {
        pageData: pageData.data.pageBySlug,
        preview,
        ...previewData,
      },
    };
  }

  return {
    props: {
      pageData: pageData.data.pageBySlug,
      preview: false,
    },
  };
}
