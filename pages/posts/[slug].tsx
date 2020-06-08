import PostLayout from "../../components/post-layout";
import PostBody from "../../components/post-body";
import { fetchGraphql } from "../../lib/api";
import Header from "../../components/header";
import Head from "next/head";
import { useForm, usePlugin, FormOptions } from "tinacms";
import { useMemo, useEffect, useState } from "react";
import markdownToHtml from "../../lib/markdownToHtml";
import { InlineForm, InlineText } from "react-tinacms-inline";

export default function ({ post: initialPost, preview }) {
  const formConfig: any = {
    id: initialPost.slug,
    label: "Blog Post",
    initialValues: initialPost,
    fields: [
      {
        name: "title",
        label: "Post Title",
        component: "text",
      },
    ],
  };
  const [post, form] = useForm(formConfig);
  usePlugin(form);
  const initialContent = useMemo(() => post.content, []);
  const [htmlContent, setHtmlContent] = useState(post.content);

  useEffect(() => {
    markdownToHtml(post.content).then(setHtmlContent);
  }, [post.content]);

  return (
    <PostLayout preview={preview}>
      <Head>
        <title>{initialPost.title} | Tina Strapi Example</title>
      </Head>
      <InlineForm form={form}>
        <InlineText name="title" />
      </InlineForm>
      <PostBody content={htmlContent} />
    </PostLayout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await fetchGraphql(`
  query {
      blogPosts(where: {slug: "${params.slug}"}){
          title
          date
          author{
              fullName
          }
          content
      }
  }`);

  const post = pageData.data.blogPosts[0];

  return {
    props: {
      post: {
        ...post,
      },
    },
  };
}
export async function getStaticPaths() {
  const pageData = await fetchGraphql(`
    query {
        blogPosts {
            slug
        }
    }`);

  const posts = pageData.data.blogPosts;

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}
