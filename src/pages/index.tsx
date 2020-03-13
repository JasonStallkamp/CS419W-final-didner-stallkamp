import PostExploreSection from '../component/PostExploreSection'

function Home(){
  return <PostExploreSection query={`
  {
      getLatestPosts(max:20)
      {
        id,
        title,
        author{
          username,
          id
        },
        tags
      }
    }
  `}></PostExploreSection>
}

export default Home;
