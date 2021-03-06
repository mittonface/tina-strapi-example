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

export default function ({ post: initialPost, preview }) {
  const formConfig: any = {
    id: initialPost.slug,
    label: "Blog Post",
    initialValues: initialPost,
    onSubmit: async (values) => {
      const saveMutation = `
      mutation UpdateBlogPost(
        $id: ID!
        $title: String
        $content: String
      ) {
        updateBlogPost(
          input: {
            where: { id: $id }
            data: { title: $title, content: $content}
          }
        ) {
          blogPost {
            id
          }
        }
      }`;
      const response = await fetchGraphql(saveMutation, {
        id: values.id,
        title: values.title,
        content: values.content,
        date: values.date,
      });
    },
    fields: [
      {
        name: "title",
        label: "Post Title",
        component: "text",
      },
      {
        name: "content",
        label: "Content",
        component: "markdown",
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
      <InlineForm form={form} initialStatus={preview ? "active" : "inactive"}>
        <Header>
          <InlineText name="title" />
        </Header>
        <InlineWysiwyg name="content" format="markdown">
          <ReactMarkdown source={post.content} />
        </InlineWysiwyg>
        <SaveButton />
      </InlineForm>
    </PostLayout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await fetchGraphql(`
  query {
      blogPosts(where: {slug: "${params.slug}"}){
          id
          title
          date
          author{
              fullName
          }
          content
      }
  }`);

  const post = pageData.data.blogPosts[0];

  if (preview) {
    return {
      props: {
        preview,
        ...previewData,
        post: {
          ...post,
        },
      },
    };
  }

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

export function SaveButton() {
  const { form } = useInlineForm();

  /*
   ** If there are no changes
   ** to save, return early
   */
  if (form.finalForm.getState().pristine) {
    return null;
  }

  return <TinaButton onClick={form.submit}>Save</TinaButton>;
}
