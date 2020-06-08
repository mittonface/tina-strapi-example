import { FormOptions, useForm, usePlugin } from "tinacms";
import { InlineForm, InlineText, useInlineForm } from "react-tinacms-inline";
import { useEffect, useMemo, useState } from "react";

import Head from "next/head";
import Header from "../../components/header";
import { InlineWysiwyg } from "react-tinacms-editor";
import PostBody from "../../components/post-body";
import PostLayout from "../../components/post-layout";
import ReactMarkdown from "react-markdown";
import { Button as TinaButton } from "@tinacms/styles";
import { fetchGraphql } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";

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

  return (
    <PostLayout preview={preview}>
      <Head>
        <title>{initialPost.title} | Tina Strapi Example</title>
      </Head>
      <InlineForm form={form}>
        <Header>
          <InlineText name="title" />
        </Header>
        <InlineWysiwyg name="content" format="markdown">
          <ReactMarkdown source={post.content} />
        </InlineWysiwyg>
        <EditToggle />
      </InlineForm>
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

export function EditToggle() {
  // Access 'edit mode' controls via `useInlineForm` hook
  const { status, deactivate, activate } = useInlineForm();

  return (
    <TinaButton
      primary
      onClick={() => {
        status === "active" ? deactivate() : activate();
      }}
    >
      {status === "active" ? "Preview" : "Edit"}
    </TinaButton>
  );
}
