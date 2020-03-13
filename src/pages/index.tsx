import PostExploreSection from '../component/PostExploreSection'

function Home(){
  return <PostExploreSection query={`
  {
      getLatestPosts(max:20)
      {
        $values
      }
    }
  `}></PostExploreSection>
}

export default Home;
