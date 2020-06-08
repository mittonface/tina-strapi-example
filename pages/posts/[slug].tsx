import PostLayout from "../../components/post-layout";
import PostBody from "../../components/post-body";
import { fetchGraphql } from "../../lib/api";
import Header from "../../components/header";
import Head from "next/head";

export default function ({ post, preview }) {
  return (
    <PostLayout preview={preview}>
      <Head>
        <title>{post.title} | Tina Strapi Example</title>
      </Head>
      <Header>{post.title}</Header>
      <PostBody content={post.content} />
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
